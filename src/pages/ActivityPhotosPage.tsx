import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  User, 
  CheckCircle2, 
  Eye, 
  Plus, 
  X, 
  Trash2, 
  Sparkles, 
  Calendar,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ActivityPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: '기본1 (기초)' | '기본2(중급)' | '기본3(고급)';
  eventDate: string; // e.g. "05.11"
  author: string; // e.g. "유아교육과"
  viewCount: number;
  createdAt: any;
}

const DEFAULT_PHOTOS: ActivityPhoto[] = [
  {
    id: 'seed-1',
    title: '2026 스승의 날',
    eventDate: '05.11',
    description: '스승의 날을 맞이하여 교수님들께 감사한 마음을 전하는 시간을 가졌습니다. 유아교육과 학우들은 스승의 사랑에 작게나마 보답하기 위하여 따스한 카네이션과 마음이 깃든 메세지를 준비했습니다.',
    category: '기본1 (기초)',
    author: '유아교육과',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    viewCount: 106,
    createdAt: null
  },
  {
    id: 'seed-2',
    title: '2026 유아교육과 엠티',
    eventDate: '04.10~04.11',
    description: '4월 10일부터 11일까지 1박 2일 동안 대자연과 고풍스러운 문화 가옥이 어우러진 공간에서 유아교육과 연합 엠티를 진행하였습니다. 유아교육과 교수님과 선후배 학우들이 만나 따뜻한 소통의 물결을 이루었습니다.',
    category: '기본2(중급)' as any, // fallback
    author: '유아교육과',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    viewCount: 225,
    createdAt: null
  },
  {
    id: 'seed-3',
    title: '2026 학생회 간담회',
    eventDate: '03.20',
    description: '2026년, 제45대 유아교육과 학생회 \'청아\'가 새롭게 출범하였습니다. 이에 2026학년도 1차 간담회를 통해 다채로운 학생 주도 탐구 활동과 학술 아카이브 활성화 방안에 대해 논의를 다졌습니다.',
    category: '기본3(고급)' as any, // fallback
    author: '유아교육과',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    viewCount: 256,
    createdAt: null
  }
];

export default function ActivityPhotosPage() {
  const { isAdmin } = useAuth();
  const [photos, setPhotos] = useState<ActivityPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modal state
  const [activePhoto, setActivePhoto] = useState<ActivityPhoto | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<'기본1 (기초)' | '기본2(중급)' | '기본3(고급)'>('기본1 (기초)');
  const [newAuthor, setNewAuthor] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch photos from Firestore
  useEffect(() => {
    const q = query(collection(db, 'activity_photos'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityPhoto[];
      
      setPhotos(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error loading activity photos:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle Incremental View Count
  const handleViewDetails = async (photo: ActivityPhoto) => {
    setActivePhoto(photo);
    
    // Only update Firestore if it's not a local seed item with placeholder ID
    if (!photo.id.startsWith('seed-')) {
      try {
        const photoRef = doc(db, 'activity_photos', photo.id);
        await updateDoc(photoRef, {
          viewCount: photo.viewCount + 1
        });
      } catch (e) {
        console.warn("Could not increment view count", e);
      }
    } else {
      // Local viewcount increment for offline responsiveness
      setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, viewCount: p.viewCount + 1 } : p));
    }
  };

  // Seeding trigger if collection is empty (Admin tool helper)
  const handleSeedSamples = async () => {
    setUploadProgress(true);
    try {
      const batch = writeBatch(db);
      DEFAULT_PHOTOS.forEach((photo) => {
        const newDocRef = doc(collection(db, 'activity_photos'));
        batch.set(newDocRef, {
          title: photo.title,
          eventDate: photo.eventDate,
          description: photo.description,
          category: photo.category === '기본2(중급)' as any ? '기본2(중급)' : photo.category === '기본3(고급)' as any ? '기본3(고급)' : photo.category,
          author: photo.author,
          imageUrl: photo.imageUrl,
          viewCount: photo.viewCount,
          createdAt: serverTimestamp()
        });
      });
      await batch.commit();
      alert('샘플 활동사진 데이터 3건이 성공적으로 DB에 등록되었습니다!');
    } catch (e: any) {
      alert('오류 발생: ' + e.message);
    } finally {
      setUploadProgress(false);
    }
  };

  // Upload Logic
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setUploadProgress(true);

    if (!newTitle.trim()) {
      setFormError('제목을 입력해주세요.');
      setUploadProgress(false);
      return;
    }
    if (!newEventDate.trim()) {
      setFormError('날짜를 입력해주세요 (예: 05.11 또는 04.10~04.11).');
      setUploadProgress(false);
      return;
    }
    if (!newDescription.trim()) {
      setFormError('상세 설명을 입력해주세요.');
      setUploadProgress(false);
      return;
    }
    if (!newAuthor.trim()) {
      setFormError('소속/작성자를 입력해주세요.');
      setUploadProgress(false);
      return;
    }

    let finalImageUrl = newImageUrl.trim();

    try {
      // 1. File Upload to Storage if chosen
      if (imageFile) {
        const fileRef = ref(storage, `activity_photos/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(fileRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      if (!finalImageUrl) {
        setFormError('활동 사진 이미지를 업로드하거나 이미지 URL 주소를 입력해주세요.');
        setUploadProgress(false);
        return;
      }

      // 2. Save document to Firestore
      const docData = {
        title: newTitle.trim(),
        eventDate: newEventDate.trim(),
        description: newDescription.trim(),
        category: newCategory,
        author: newAuthor.trim(),
        imageUrl: finalImageUrl,
        viewCount: 0,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'activity_photos'), docData);

      // Reset states
      setNewTitle('');
      setNewEventDate('');
      setNewDescription('');
      setNewAuthor('');
      setNewImageUrl('');
      setImageFile(null);
      setShowUploadModal(false);
      alert('활동 사진이 성공적으로 등록되었습니다!');
    } catch (err: any) {
      console.error(err);
      setFormError(`저장 중 오류 발생: ${err.message || err}`);
    } finally {
      setUploadProgress(false);
    }
  };

  // Delete Logic (only Admin)
  const handleDelete = async (photoId: string) => {
    if (!window.confirm('정말로 이 활동 사진을 삭제하시겠습니까?')) return;
    
    try {
      if (photoId.startsWith('seed-')) {
        // Just remove from local state
        setPhotos(prev => prev.filter(p => p.id !== photoId));
      } else {
        await deleteDoc(doc(db, 'activity_photos', photoId));
      }
      setActivePhoto(null);
      alert('성공적으로 삭제되었습니다.');
    } catch (err: any) {
      alert(`삭제 오류: ${err.message}`);
    }
  };

  // Combine Firestore results with preloaded/seeded items so if Firestore is blank, the board is perfectly populated!
  const displayPhotos = photos.length > 0 ? photos : DEFAULT_PHOTOS;

  // Filtering
  const filteredPhotos = displayPhotos.filter(photo => {
    const categoryMatch = selectedCategory === '전체' || photo.category === selectedCategory || 
      (selectedCategory === '기본2(중급)' && (photo.category as string) === '기본2(중급)') || 
      (selectedCategory === '기본3(고급)' && (photo.category as string) === '기본3(고급)');
    
    const searchMatch = searchQuery.trim() === '' || 
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.author.toLowerCase().includes(searchQuery.toLowerCase());
      
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 font-serif pt-28">
      {/* Decorative top header line */}
      <div className="h-1 bg-gradient-to-r from-[#8C6239] via-[#C5A880] to-[#1A1A1A] w-full fixed top-20 z-40" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header Block */}
        <div className="text-center py-10">
          <div className="inline-flex items-center space-x-1.5 text-[10px] text-[#8C6239] font-serif uppercase tracking-[0.25em] font-bold mb-2">
            <span className="w-1.5 h-1.5 bg-[#8C6239] rotate-45" />
            <span>Siheung History M.A.K.E.R Board</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#1A1A1A] tracking-wide mb-3">학생 활동사진</h1>
          <div className="h-[2px] w-24 bg-[#8C6239] mx-auto opacity-70" />
        </div>

        {/* Filter Controls (Dropdown + Search Input aligned on the right) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-3 mb-6">
          {/* Dropdown Styled with Classic Border */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-[#EADFCB] text-zinc-800 text-xs py-3 pl-4 pr-10 rounded-sm font-serif outline-none cursor-pointer focus:border-[#8C6239] shadow-xs"
            >
              <option value="전체">전체</option>
              <option value="기본1 (기초)">기본1(기초)</option>
              <option value="기본2(중급)">기본2(중급)</option>
              <option value="기본3(고급)">기본3(고급)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Search Box with Search Icon on the Right */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="검색어를 입력해 주세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#EADFCB] text-zinc-800 text-xs py-3 pl-4 pr-10 rounded-sm font-serif outline-none focus:border-[#8C6239] shadow-xs placeholder-zinc-400"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Admin Create Control Trigger Button */}
          {isAdmin && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-3 bg-[#8C6239] hover:bg-[#6D4926] text-[#FAF8F5] font-serif text-xs uppercase tracking-widest flex items-center justify-center space-x-1.5 transition-colors rounded-sm shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>활동 등록</span>
            </button>
          )}
        </div>

        {/* Dense Separator Line in benchmark color */}
        <div className="h-0.5 bg-[#415174] w-full mb-10 shadow-xs" />

        {/* Main Grid Content */}
        {loading ? (
          <div className="py-24 text-center text-zinc-400 font-serif">
            아카이브에서 활동 내역을 가져오고 있습니다...
          </div>
        ) : filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="group cursor-pointer bg-white border border-[#EADFCB]/60 hover:border-[#8C6239]/60 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
                onClick={() => handleViewDetails(photo)}
              >
                {/* Responsive Image Aspect Container */}
                <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 duration-750 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-xs text-[9px] text-[#EADFCB] font-serif tracking-wider rounded-sm uppercase">
                    {photo.category}
                  </div>
                </div>

                {/* Body Details Area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-md font-bold text-zinc-900 group-hover:text-[#8C6239] transition-colors leading-snug break-keep">
                      {photo.title} ({photo.eventDate})
                    </h3>
                    <p className="text-xs text-zinc-500/90 leading-relaxed line-clamp-2 break-keep font-light h-8 font-serif">
                      {photo.description}
                    </p>
                  </div>

                  {/* Icon Block Rows matched directly to your screenshot */}
                  <div className="flex items-center space-x-4 border-t border-zinc-100 pt-3.5 text-[11px] text-zinc-500 font-serif">
                    {/* Author Icon Row */}
                    <div className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5 text-[#3C82F6]" />
                      <span className="font-semibold text-zinc-700">{photo.author}</span>
                    </div>

                    {/* Check Circle Icon Row (Reg Date) */}
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>
                        {photo.createdAt 
                          ? new Date(photo.createdAt.seconds * 1000).toLocaleDateString('ko-KR').replace(/ /g, '').slice(0, -1)
                          : `2026.05.31`
                        }
                      </span>
                    </div>

                    {/* View Count Row */}
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5 text-[#3C82F6]" />
                      <span>{photo.viewCount}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center text-zinc-400 font-serif border border-dashed border-[#EADFCB] bg-white rounded-sm max-w-xl mx-auto space-y-4">
            <AlertCircle className="w-10 h-10 text-zinc-300 mx-auto" />
            <p className="text-sm">검색 필터에 해당되는 활동사진이 없습니다.</p>
            {isAdmin && photos.length === 0 && (
              <button
                onClick={handleSeedSamples}
                className="px-4 py-2 bg-[#8C6239] text-white text-xs font-serif rounded-sm inline-block"
              >
                데모 데이터 일체 주입하기 (Seed)
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pop-up Card Detailed Modal */}
      <AnimatePresence>
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1A1A1A]/70 backdrop-blur-sm"
              onClick={() => setActivePhoto(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#FCFAF5] border border-[#EADFCB] rounded-sm p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              {/* Traditional grid background accent */}
              <div className="hanji-texture absolute inset-0 opacity-10 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8C6239] font-bold font-serif uppercase tracking-widest bg-[#8C6239]/5 px-2.5 py-0.5 rounded-sm border border-[#8C6239]/20">
                      {activePhoto.category}
                    </span>
                    <h3 className="text-2xl font-bold font-serif text-[#1A1A1A] mt-2 leading-snug">
                      {activePhoto.title} ({activePhoto.eventDate})
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActivePhoto(null)}
                    className="p-1 px-1.5 border border-zinc-200 text-zinc-400 hover:text-zinc-600 rounded-sm hover:bg-stone-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Detailed Image */}
                <div className="aspect-[16/10] bg-black rounded-xs overflow-hidden shadow-inner relative border border-[#EADFCB]/30">
                  <img 
                    src={activePhoto.imageUrl} 
                    alt={activePhoto.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Sub-meta details */}
                <div className="flex flex-wrap items-center gap-6 py-3 px-4 bg-[#FAF8F5] border border-[#EADFCB]/40 rounded-sm text-xs text-zinc-600 font-serif">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-[#3C82F6]" />
                    <span className="font-bold text-zinc-800">활동 동아리/작성자:</span>
                    <span>{activePhoto.author}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span className="font-bold text-zinc-800">등록일자:</span>
                    <span>
                      {activePhoto.createdAt 
                        ? new Date(activePhoto.createdAt.seconds * 1000).toLocaleDateString('ko-KR')
                        : '2026.05.31'
                      }
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Eye className="w-4 h-4 text-[#3C82F6]" />
                    <span className="font-bold text-zinc-800">조회수:</span>
                    <span>{activePhoto.viewCount}회</span>
                  </div>
                </div>

                {/* Multi-line Description text */}
                <div className="space-y-2">
                  <h4 className="text-xs text-[#8C6239] font-bold uppercase tracking-wider font-serif">■ 상세 활동 기록</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed break-keep font-serif whitespace-pre-wrap pl-1 font-light">
                    {activePhoto.description}
                  </p>
                </div>

                {/* Admin specific action */}
                {isAdmin && (
                  <div className="flex justify-end pt-4 border-t border-zinc-100">
                    <button
                      onClick={() => handleDelete(activePhoto.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-xs font-serif transition-colors rounded-sm flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>활동 내역 삭제</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin New Creation dialog pop-up */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowUploadModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#EADFCB] rounded-sm p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-[#EADFCB]/50">
                  <h4 className="text-xl font-bold font-serif text-[#1A1A1A] flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-[#8C6239]" />
                    <span>새 활동사진 등록 (관리자전용)</span>
                  </h4>
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="p-1 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {formError && (
                  <p className="p-3 bg-red-50 border border-red-200 text-xs text-red-600 rounded-sm font-serif">
                    {formError}
                  </p>
                )}

                <form onSubmit={handleUpload} className="space-y-4 font-serif text-xs">
                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">활동 제목 (예: 2026 스승의 날)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="행사 제목을 입력하세요"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </div>

                  {/* Event Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">날짜 표시 (예: 05.11 또는 04.10~04.11)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="05.11"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Club Category */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">구분 (게시판 카테고리)</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                    >
                      <option value="기본1 (기초)">기본1 (기초)</option>
                      <option value="기본2(중급)">기본2(중급)</option>
                      <option value="기본3(고급)">기본3(고급)</option>
                    </select>
                  </div>

                  {/* Author / Crew Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">소속 학과 / 탐구동아리명 (예: 유아교육과)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="유아교육과"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      required
                    />
                  </div>

                  {/* Image Options */}
                  <div className="space-y-2 border-y border-[#EADFCB]/30 py-3 my-2">
                    <span className="text-[10px] text-zinc-500 font-bold tracking-wider block">활동 이미지 입력 (파일 업로드 혹은 URL 주소 제공 중 택1)</span>
                    
                    {/* File Upload Option */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#8C6239] font-semibold block">1. 로컬 이미지 파일 선택</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                          }
                        }}
                        className="w-full p-1 border border-dashed border-[#EADFCB] bg-white rounded-sm text-zinc-500"
                      />
                    </div>

                    <div className="text-center text-[9px] text-zinc-400 my-1">─ 또는 ─</div>

                    {/* Image URL option */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#8C6239] font-semibold block">2. 외부 이미지 URL 주소 직접 입력</label>
                      <input
                        type="text"
                        className="w-full p-2.5 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">상세 활동 설명</label>
                    <textarea
                      rows={4}
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="활동에 관련된 세부 내용을 작성해주세요"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      required
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-2 pt-4 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2.5 bg-white border border-zinc-200 hover:bg-stone-50 text-[#1A1A1A]"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={uploadProgress}
                      className="px-6 py-2.5 bg-[#8C6239] hover:bg-[#6D4926] text-white flex items-center justify-center space-x-2"
                    >
                      {uploadProgress ? '등록 중...' : '등록하기'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
