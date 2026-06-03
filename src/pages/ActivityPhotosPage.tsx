import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ChevronDown,
  Clock,
  Home,
  Edit
} from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const cleanActivityTitle = (title: string) => {
  // 1. Remove [M:만남] prefix
  let clean = title.replace(/^\[[^\]]+\]\s*/, '');
  // 2. If it contains "Heritage - Title", extract the Title part
  if (clean.includes(' - ')) {
    const parts = clean.split(' - ');
    // Return the second part onwards
    clean = parts.slice(1).join(' - ');
  }
  return clean;
};
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
  displayDate?: string;
  makerStage?: string;
  heritage?: string;
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
  const [selectedMakerStage, setSelectedMakerStage] = useState<string>('전체');
  const [selectedHeritage, setSelectedHeritage] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modal state
  const [activePhoto, setActivePhoto] = useState<ActivityPhoto | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<'기본1 (기초)' | '기본2(중급)' | '기본3(고급)'>('기본1 (기초)');
  const [newAuthor, setNewAuthor] = useState('유아교육과');
  const [authorSelectType, setAuthorSelectType] = useState('유아교육과');
  const [newCustomAuthor, setNewCustomAuthor] = useState('');
  const [newMakerStage, setNewMakerStage] = useState('');
  const [newHeritageSelect, setNewHeritageSelect] = useState('호조벌');
  const [newCustomHeritage, setNewCustomHeritage] = useState('');
  const [newDisplayDate, setNewDisplayDate] = useState(new Date().toISOString().split('T')[0]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [formError, setFormError] = useState('');

  // State for editing a post
  const [selectedPost, setSelectedPost] = useState<ActivityPhoto | null>(null);

  // Form states for editing
  const [editTitle, setEditTitle] = useState('');
  const [editEventDate, setEditEventDate] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<'기본1 (기초)' | '기본2(중급)' | '기본3(고급)'>('기본1 (기초)');
  const [editAuthor, setEditAuthor] = useState('');
  const [editDisplayDate, setEditDisplayDate] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editMakerStage, setEditMakerStage] = useState('');
  const [editHeritage, setEditHeritage] = useState('');

  useEffect(() => {
    if (selectedPost) {
      setEditTitle(selectedPost.title);
      setEditEventDate(selectedPost.eventDate);
      setEditDescription(selectedPost.description);
      setEditCategory(selectedPost.category);
      setEditAuthor(selectedPost.author);
      setEditImageUrl(selectedPost.imageUrl);
      setEditDisplayDate(selectedPost.displayDate || new Date().toISOString().split('T')[0]);
      setEditMakerStage(selectedPost.makerStage || '');
      setEditHeritage(selectedPost.heritage || '');
    }
  }, [selectedPost]);

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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('파일을 읽는 데 실패했습니다.'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
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
    const computedAuthor = authorSelectType === 'custom' ? newCustomAuthor.trim() : authorSelectType;
    if (!computedAuthor) {
      setFormError('소속/작성자를 입력해주세요.');
      setUploadProgress(false);
      return;
    }

    let finalImageUrl = newImageUrl.trim();

    try {
      // 1. File Upload to Storage if chosen
      if (imageFile) {
        try {
          const uploadPromise = async () => {
            const fileRef = ref(storage, `activity_photos/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(fileRef, imageFile);
            return await getDownloadURL(snapshot.ref);
          };

          const timeoutPromise = new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error("Storage timeout")), 3000)
          );

          finalImageUrl = await Promise.race([uploadPromise(), timeoutPromise]);
        } catch (storageError) {
          console.warn("Storage upload failed or timed out, falling back to Base64:", storageError);
          if (imageFile.size > 800 * 1024) {
            throw new Error("파일 크기가 너무 큽니다 (최대 800KB). 이미지 크기를 줄이거나 더 저용량 주소로 작성해 주세요.");
          }
          finalImageUrl = await fileToBase64(imageFile);
        }
      }

      if (!finalImageUrl) {
        setFormError('활동 사진 이미지를 업로드하거나 이미지 URL 주소를 입력해주세요.');
        setUploadProgress(false);
        return;
      }

      const chosenHeritage = newHeritageSelect === '기타' ? newCustomHeritage.trim() : newHeritageSelect;
      const finalTitlePart = newTitle.trim() ? ` - ${newTitle.trim()}` : '';
      const baseTitle = newHeritageSelect === '기타' ? newCustomHeritage.trim() : newHeritageSelect;
      const computedTitleWithoutStage = baseTitle ? (baseTitle + finalTitlePart) : newTitle.trim();

      const finalTitle = newMakerStage ? `[${newMakerStage}] ${computedTitleWithoutStage}` : computedTitleWithoutStage;

      // 2. Save document to Firestore
      const docData = {
        title: finalTitle,
        eventDate: newEventDate.trim(),
        description: newDescription.trim(),
        category: newCategory,
        author: computedAuthor,
        imageUrl: finalImageUrl,
        viewCount: 0,
        createdAt: serverTimestamp(),
        displayDate: newDisplayDate,
        makerStage: newMakerStage || null,
        heritage: chosenHeritage || null
      };

      await addDoc(collection(db, 'activity_photos'), docData);

      // Reset states
      setNewTitle('');
      setNewEventDate('');
      setNewDescription('');
      setNewAuthor('유아교육과');
      setAuthorSelectType('유아교육과');
      setNewCustomAuthor('');
      setNewMakerStage('');
      setNewHeritageSelect('호조벌');
      setNewCustomHeritage('');
      setNewDisplayDate(new Date().toISOString().split('T')[0]);
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

  // Save Edit Logic
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;

    try {
      setUploadProgress(true);
      
      const updatedData = {
        title: editTitle,
        eventDate: editEventDate,
        description: editDescription,
        category: editCategory,
        author: editAuthor,
        imageUrl: editImageUrl,
        displayDate: editDisplayDate,
        makerStage: editMakerStage || null,
        heritage: editHeritage || null
      };

      if (!selectedPost.id.startsWith('seed-')) {
        const docRef = doc(db, 'activity_photos', selectedPost.id);
        await updateDoc(docRef, updatedData);
      } else {
        // If it's a seed post, update local state
        setPhotos(prev => prev.map(p => p.id === selectedPost.id ? { ...p, ...updatedData } : p));
      }

      // Update active photo detail view if it's currently open
      if (activePhoto && activePhoto.id === selectedPost.id) {
        setActivePhoto({
          ...activePhoto,
          ...updatedData
        } as any);
      }

      alert('성공적으로 수정되었습니다.');
      setSelectedPost(null);
    } catch (err: any) {
      console.error(err);
      alert(`수정 중 오류가 발생했습니다: ${err.message || err}`);
    } finally {
      setUploadProgress(false);
    }
  };

  // Combine Firestore uploads with DEFAULT_PHOTOS to keep the 3 pre-seeded items always present
  const displayPhotos = [
    ...photos,
    ...DEFAULT_PHOTOS.filter(dp => !photos.some(p => p.title.includes(dp.title) || p.description.includes(dp.description.substring(0, 10))))
  ];

  // Filtering
  const filteredPhotos = displayPhotos.filter(photo => {
    // 1. Category Filter
    const categoryMatch = selectedCategory === '전체' || photo.category === selectedCategory || 
      (selectedCategory === '기본2(중급)' && (photo.category as string) === '기본2(중급)') || 
      (selectedCategory === '기본3(고급)' && (photo.category as string) === '기본3(고급)');
    
    // 2. Maker Stage Filter
    const stageMatch = 
      selectedMakerStage === '전체' ||
      (photo as any).makerStage === selectedMakerStage ||
      photo.title.includes(`[${selectedMakerStage}]`) ||
      (selectedMakerStage && photo.title.startsWith(`[${selectedMakerStage.split(':')[0]}`)) ||
      photo.title.includes(selectedMakerStage.split(':')[0]) ||
      (selectedMakerStage.includes(':') && photo.title.includes(selectedMakerStage.split(':')[1]));

    // 3. Heritage Filter
    const heritageMatch = 
      selectedHeritage === '전체' ||
      (photo as any).heritage === selectedHeritage ||
      photo.title.includes(selectedHeritage) ||
      (selectedHeritage === '기타' && !['호조벌', '관곡지', '오이도 패총', '군자봉성황제', '능곡선사유적지', '갯골·염전', '생금집'].some(h => photo.title.includes(h) || (photo as any).heritage === h));

    // 4. Search Query Filter
    const searchMatch = searchQuery.trim() === '' || 
      photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      photo.author.toLowerCase().includes(searchQuery.toLowerCase());
      
    return categoryMatch && stageMatch && heritageMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-white pb-24 font-sans pt-20">
      {/* Dynamic top header bar shadow alignment */}
      <div className="h-[1px] bg-zinc-200 w-full fixed top-20 z-40" />

      {/* Breadcrumb section matching screenshot exactly */}
      <div className="bg-[#FAF8F5] border-b border-zinc-200 py-3 mb-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center space-x-2 text-xs text-zinc-500 font-sans">
          <Link to="/" className="flex items-center text-zinc-400 hover:text-zinc-700 transition-colors">
            <Home className="w-3.5 h-3.5" />
          </Link>
          <span className="text-zinc-300 font-light">/</span>
          <div className="flex items-center space-x-1 hover:text-zinc-700 cursor-pointer">
            <span>학생활동</span>
            <ChevronDown className="w-3 h-3 text-zinc-400 opacity-60" />
          </div>
          <span className="text-zinc-300 font-light">/</span>
          <div className="flex items-center space-x-1 text-zinc-800 font-semibold cursor-pointer">
            <span>학생 활동사진</span>
            <ChevronDown className="w-3 h-3 text-zinc-400 opacity-60" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header Block centered with simple layout */}
        <div className="text-center py-12 space-y-3">
          <div className="w-10 h-[1.5px] bg-zinc-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight font-sans">학생 활동사진</h1>
        </div>

        {/* Filter Controls (Dropdown + Search Input aligned on the right above a solid divider line) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mb-4">
          <div className="flex items-center space-x-2 justify-end">
            {/* Dropdown Selector */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 text-xs py-2.5 pl-4 pr-10 outline-none cursor-pointer font-sans transition-colors min-w-[100px]"
              >
                <option value="전체">전체</option>
                <option value="기본1 (기초)">기본1(기초)</option>
                <option value="기본2(중급)">기본2(중급)</option>
                <option value="기본3(고급)">기본3(고급)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Search Box with Search Icon on the Far Right */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="검색어를 입력해 주세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-xs py-2.5 pl-4 pr-10 outline-none focus:border-zinc-400 font-sans transition-all placeholder-zinc-400"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Admin Add Entry Trigger Button */}
            {isAdmin && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2.5 bg-[#8C6239] hover:bg-[#6D4926] text-white font-sans text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>활동 등록</span>
              </button>
            )}
          </div>
        </div>

        {/* Dense Divider Line stretching across the full screen width, exactly like screenshot */}
        <div className="h-[2px] bg-zinc-300 w-full mb-10" />

        {/* Optional Admin/Advanced view filter toggler (Keeps matching perfect but enables deep functionality) */}
        <div className="flex justify-start mb-6">
          <button 
            onClick={() => {
              // Toggle detailed filters if user wishes to
              const target = document.getElementById('maker-advanced-filters');
              if (target) {
                target.classList.toggle('hidden');
              }
            }}
            className="text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors font-sans flex items-center space-x-1"
          >
            <span>※ 상세 조건 필터링 (M.A.K.E.R) 토글하기</span>
          </button>
        </div>

        {/* Interactive Filters Bar (Collapsible/Hidden by default to keep clean screenshot looks) */}
        <div id="maker-advanced-filters" className="hidden bg-zinc-50 border border-zinc-100 p-6 space-y-5 rounded-sm shadow-xs mb-8">
          {/* MAKER Stage Selectors */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest min-w-[120px] font-sans">
              M.A.K.E.R 단계
            </span>
            <div className="flex flex-wrap gap-2 font-sans">
              {['전체', 'M:만남', 'A:질문', 'K:이해', 'E:표현', 'R:연결'].map(stage => {
                const isActive = selectedMakerStage === stage;
                return (
                  <button
                    key={stage}
                    onClick={() => setSelectedMakerStage(stage)}
                    className={`px-4 py-1.5 text-xs font-sans transition-all duration-300 border cursor-pointer rounded-sm ${
                      isActive
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-md font-bold'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cultural Heritage Selectors */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 pt-4 border-t border-zinc-200">
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest min-w-[120px] font-sans">
              문화유산 분류
            </span>
            <div className="flex flex-wrap gap-2 font-sans">
              {['전체', '호조벌', '관곡지', '오이도 패총', '군자봉성황제', '능곡선사유적지', '갯골·염전', '생금집', '기타'].map(heritage => {
                const isActive = selectedHeritage === heritage;
                return (
                  <button
                    key={heritage}
                    onClick={() => setSelectedHeritage(heritage)}
                    className={`px-4 py-1.5 text-xs font-sans transition-all duration-300 border cursor-pointer rounded-sm ${
                      isActive
                        ? 'bg-[#8C6239] text-white border-[#8C6239] shadow-md font-bold'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {heritage}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Grid Content */}
        {loading ? (
          <div className="py-24 text-center text-zinc-400 font-sans">
            아카이브에서 활동 내역을 가져오고 있습니다...
          </div>
        ) : filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id || index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="group cursor-pointer bg-white transition-all flex flex-col justify-between align-top"
                onClick={() => handleViewDetails(photo)}
              >
                {/* Responsive Image Aspect Container - Rectangular 16/10 aspect ratio matching screenshot */}
                <div className="relative aspect-[16/10] bg-stone-50 overflow-hidden mb-4">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-102 duration-500 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Body Details Area */}
                <div className="flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1.5">
                    <h3 className="text-[15px] font-bold text-zinc-950 group-hover:text-blue-600 transition-colors leading-snug break-keep text-left font-sans">
                      {cleanActivityTitle(photo.title)} ({photo.eventDate})
                    </h3>
                    <p className="text-[12px] text-zinc-500/90 leading-relaxed line-clamp-2 break-keep h-9 font-sans text-left">
                      {photo.description}
                    </p>
                  </div>

                  {/* Icon Block Meta Row exactly formatted per user's screenshot */}
                  <div className="flex items-center space-x-4 text-[11px] font-sans text-zinc-400 font-medium leading-none pt-2">
                    {/* Blue user profile icon + name */}
                    <div className="flex items-center text-zinc-500">
                      <User className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
                      <span className="font-semibold text-zinc-600">{photo.author || '유아교육과'}</span>
                    </div>

                    {/* Clock/Calendar date icon + dots formatted date */}
                    <div className="flex items-center select-none text-zinc-400">
                      <Clock className="w-3.5 h-3.5 text-zinc-300 mr-1.5" />
                      <span>
                        {photo.displayDate 
                          ? photo.displayDate.replace(/-/g, '.')
                          : `2026.${photo.eventDate || '05.31'}`
                        }
                      </span>
                    </div>

                    {/* View Count with grey eye icon */}
                    <div className="flex items-center text-zinc-400">
                      <Eye className="w-3.5 h-3.5 text-zinc-300 mr-1.5" />
                      <span>{photo.viewCount || 0}</span>
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
                      {activePhoto.displayDate 
                        ? activePhoto.displayDate.replace(/-/g, '.')
                        : (activePhoto.createdAt 
                            ? new Date(activePhoto.createdAt.seconds * 1000).toLocaleDateString('ko-KR')
                            : '2026.05.31'
                          )
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
                  <div className="flex justify-end pt-4 border-t border-zinc-100 space-x-2">
                    <button
                      onClick={() => setSelectedPost(activePhoto)}
                      className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 text-xs font-serif transition-colors rounded-sm flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>수정하기</span>
                    </button>
                    <button
                      onClick={() => handleDelete(activePhoto.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-xs font-serif transition-colors rounded-sm flex items-center space-x-1 cursor-pointer"
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
                  {/* M.A.K.E.R Stage Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">M.A.K.E.R 단계 선택</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                      value={newMakerStage}
                      onChange={(e) => setNewMakerStage(e.target.value)}
                    >
                      <option value="">선택 안 함 (없음)</option>
                      <option value="M:만남">M:만남</option>
                      <option value="A:질문">A:질문</option>
                      <option value="K:이해">K:이해</option>
                      <option value="E:표현">E:표현</option>
                      <option value="R:연결">R:연결</option>
                    </select>
                  </div>

                  {/* Cultural Heritage Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">문화유산 분류 선택</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                      value={newHeritageSelect}
                      onChange={(e) => setNewHeritageSelect(e.target.value)}
                    >
                      <option value="호조벌">호조벌</option>
                      <option value="관곡지">관곡지</option>
                      <option value="오이도 패총">오이도 패총</option>
                      <option value="군자봉성황제">군자봉성황제</option>
                      <option value="능곡선사유적지">능곡선사유적지</option>
                      <option value="갯골·염전">갯골·염전</option>
                      <option value="생금집">생금집</option>
                      <option value="기타">기타(입력)</option>
                    </select>
                  </div>

                  {newHeritageSelect === '기타' && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">기타 문화유산 직접 입력</label>
                      <input
                        required
                        type="text"
                        className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                        placeholder="예: 생금쌍우물"
                        value={newCustomHeritage}
                        onChange={(e) => setNewCustomHeritage(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">활동 상세 제목 (선택사항)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="예: 탐방 학습지 제작"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
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

                  {/* Admin Display Date selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">등록일자 직접 선택 (카드에 표시될 날짜)</label>
                    <input
                      type="date"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      value={newDisplayDate}
                      onChange={(e) => setNewDisplayDate(e.target.value)}
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

                  {/* Author / Crew Name selectable dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">소속 학과 / 탐구동아리명 선택</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer mb-2"
                      value={authorSelectType}
                      onChange={(e) => {
                        setAuthorSelectType(e.target.value);
                        if (e.target.value !== 'custom') {
                          setNewAuthor(e.target.value);
                        }
                      }}
                    >
                      <option value="유아교육과">유아교육과</option>
                      <option value="초등교육과">초등교육과</option>
                      <option value="역사탐구동아리">역사탐구동아리</option>
                      <option value="AI크리에이터동아리">AI크리에이터동아리</option>
                      <option value="지역연계탐구팀">지역연계탐구팀</option>
                      <option value="M:만남">M:만남</option>
                      <option value="A:질문">A:질문</option>
                      <option value="K:이해">K:이해</option>
                      <option value="E:표현">E:표현</option>
                      <option value="R:연결">R:연결</option>
                      <option value="custom">직접 입력...</option>
                    </select>

                    {authorSelectType === 'custom' && (
                      <input
                        type="text"
                        className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] mt-1"
                        placeholder="소속 학과 혹은 탐구동아리명을 직접 입력하세요"
                        value={newCustomAuthor}
                        onChange={(e) => {
                          setNewCustomAuthor(e.target.value);
                          setNewAuthor(e.target.value);
                        }}
                        required
                      />
                    )}
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

      {/* Edit Modal (selectedPost) */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedPost(null)}
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
                    <Edit className="w-5 h-5 text-[#8C6239]" />
                    <span>활동 기록 수정 (관리자전용)</span>
                  </h4>
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="p-1 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-4 font-serif text-xs">
                  {/* M.A.K.E.R Stage Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">M.A.K.E.R 단계 선택</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                      value={editMakerStage}
                      onChange={(e) => setEditMakerStage(e.target.value)}
                    >
                      <option value="">선택 안 함 (없음)</option>
                      <option value="M:만남">M:만남</option>
                      <option value="A:질문">A:질문</option>
                      <option value="K:이해">K:이해</option>
                      <option value="E:표현">E:표현</option>
                      <option value="R:연결">R:연결</option>
                    </select>
                  </div>

                  {/* Cultural Heritage Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">문화유산 분류 선택</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                      value={editHeritage}
                      onChange={(e) => setEditHeritage(e.target.value)}
                    >
                      <option value="호조벌">호조벌</option>
                      <option value="관곡지">관곡지</option>
                      <option value="오이도 패총">오이도 패총</option>
                      <option value="군자봉성황제">군자봉성황제</option>
                      <option value="능곡선사유적지">능곡선사유적지</option>
                      <option value="갯골·염전">갯골·염전</option>
                      <option value="생금집">생금집</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">활동 상세 제목</label>
                    <input
                      required
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="예: 탐방 학습지 제작"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>

                  {/* Event Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">날짜 표시 (예: 05.11 또는 04.10~04.11)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="05.11"
                      value={editEventDate}
                      onChange={(e) => setEditEventDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Date selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">등록일자 선택</label>
                    <input
                      type="date"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      value={editDisplayDate}
                      onChange={(e) => setEditDisplayDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Club Category */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">구분 (게시판 카테고리)</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as any)}
                    >
                      <option value="기본1 (기초)">기본1 (기초)</option>
                      <option value="기본2(중급)">기본2(중급)</option>
                      <option value="기본3(고급)">기본3(고급)</option>
                    </select>
                  </div>

                  {/* Author / Crew Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">소속 학과 / 탐구동아리명</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="소속 학과 혹은 탐구동아리명"
                      value={editAuthor}
                      onChange={(e) => setEditAuthor(e.target.value)}
                      required
                    />
                  </div>

                  {/* Image URL option */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">활동 이미지 URL 주소</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      required
                    />
                  </div>

                  {/* Description Box */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">상세 활동 설명</label>
                    <textarea
                      rows={4}
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="활동에 관련된 세부 내용을 작성해주세요"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      required
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-2 pt-4 justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedPost(null)}
                      className="px-4 py-2.5 bg-white border border-zinc-200 hover:bg-stone-50 text-[#1A1A1A] cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={uploadProgress}
                      className="px-6 py-2.5 bg-[#8C6239] hover:bg-[#6D4926] text-white flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>{uploadProgress ? '수정 중...' : '수정 완료'}</span>
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
