import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  Edit,
  ArrowRight,
  PenTool,
  Code,
  Rocket
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
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

const cleanActivityTitle = (title: string) => {
  let clean = title.replace(/^\[[^\]]+\]\s*/, '');
  if (clean.includes(' - ')) {
    const parts = clean.split(' - ');
    clean = parts.slice(1).join(' - ');
  }
  return clean;
};

interface PhotoItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  eventDate: string;
  author: string;
  viewCount: number;
  createdAt: any;
  displayDate?: string;
  makerStage?: string;
  heritage?: string;
  summary?: string;
  keywords?: string;
  attachmentUrl?: string;
  dayOfWeek?: string;
  majorActivities?: string[];
  warnings?: string[];
  toolType?: string;
  parentExcerpt?: string;
  activityType?: '기초학습' | '수준별 심화학습' | '학생동아리 활동' | '미분류';
  _sourceCollection?: 'activity_photos' | 'intensive_photos';
}

interface CommonArchiveProps {
  pageTitle: string; // e.g. "2-1. 기초학습"
  activityType: '기초학습' | '수준별 심화학습' | '학생동아리 활동';
  defaultPhotos: PhotoItem[];
  categoryTitle: string; // e.g. "단계" or "활동 구분"
  categories: string[]; // e.g. ['전체', '기본1', '기본2', '기본3', '미분류(기타)']
  learningAreas: string[]; // e.g. ['전체', '구글 기반...', ...]
  defaultCategoryValue: string; // e.g. "기본1 (기초)"
  authorOptions: string[];
  defaultAuthorValue: string;
  defaultHeritageValue: string;
}

export default function CommonArchive({
  pageTitle,
  activityType,
  defaultPhotos,
  categoryTitle,
  categories,
  learningAreas,
  defaultCategoryValue,
  authorOptions,
  defaultAuthorValue,
  defaultHeritageValue
}: CommonArchiveProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useAuth();

  // State Management
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedMakerStage, setSelectedMakerStage] = useState('전체');
  const [selectedHeritage, setSelectedHeritage] = useState('전체');
  
  // Selected post for Detail view
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);

  // Upload/Create modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [formError, setFormError] = useState('');

  // New Post Form Field States
  const [newTitle, setNewTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newDisplayDate, setNewDisplayDate] = useState(new Date().toISOString().split('T')[0]);
  const [newCategory, setNewCategory] = useState(defaultCategoryValue);
  const [newDescription, setNewDescription] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');
  const [newMakerStage, setNewMakerStage] = useState('');
  const [newHeritageSelect, setNewHeritageSelect] = useState(defaultHeritageValue);
  const [newCustomHeritage, setNewCustomHeritage] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Author selection states
  const [authorSelectType, setAuthorSelectType] = useState(defaultAuthorValue);
  const [newAuthor, setNewAuthor] = useState(defaultAuthorValue);
  const [newCustomAuthor, setNewCustomAuthor] = useState('');

  // Edit modal states
  const [selectedPost, setSelectedPost] = useState<PhotoItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editEventDate, setEditEventDate] = useState('');
  const [editDisplayDate, setEditDisplayDate] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editMakerStage, setEditMakerStage] = useState('');
  const [editHeritage, setEditHeritage] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editKeywords, setEditKeywords] = useState('');
  const [editAttachmentUrl, setEditAttachmentUrl] = useState('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  
  // Custom added: edit activityType
  const [editActivityType, setEditActivityType] = useState<'기초학습' | '수준별 심화학습' | '학생동아리 활동' | '미분류'>('기초학습');

  const computedAuthor = authorSelectType === 'custom' ? newCustomAuthor.trim() : newAuthor;

  // Sync edit form when a post is selected for editing
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
      setEditSummary(selectedPost.summary || '');
      setEditKeywords(selectedPost.keywords || '');
      setEditAttachmentUrl(selectedPost.attachmentUrl || '');
      setEditActivityType(selectedPost.activityType || '기초학습');
      setEditImageFile(null);
    }
  }, [selectedPost]);

  // Fetch photos from BOTH collections and merge
  useEffect(() => {
    setLoading(true);
    const q1 = query(collection(db, 'activity_photos'), orderBy('createdAt', 'desc'));
    const q2 = query(collection(db, 'intensive_photos'), orderBy('createdAt', 'desc'));

    let unsub1 = () => {};
    let unsub2 = () => {};

    let list1: any[] = [];
    let list2: any[] = [];

    const handleCombinedUpdate = () => {
      // Map activity_photos
      const mappedList1 = list1.map(doc => {
        let actType = doc.activityType || doc.division;
        if (!actType) {
          const cat = doc.category || '';
          if (cat.includes('기본') || cat.includes('기초') || cat.includes('중급') || cat.includes('고급')) {
            actType = '기초학습';
          } else if (cat.includes('심화')) {
            actType = '수준별 심화학습';
          } else if (cat.includes('동아리')) {
            actType = '학생동아리 활동';
          } else {
            actType = '미분류';
          }
        }
        return {
          ...doc,
          activityType: actType,
          _sourceCollection: 'activity_photos' as const
        };
      });

      // Map intensive_photos
      const mappedList2 = list2.map(doc => {
        let actType = doc.activityType || doc.division;
        if (!actType) {
          actType = '수준별 심화학습';
        }
        return {
          ...doc,
          activityType: actType,
          _sourceCollection: 'intensive_photos' as const
        };
      });

      // Combine
      const merged = [...mappedList1, ...mappedList2];
      
      // Deduplicate by ID
      const uniqueMap = new Map<string, any>();
      merged.forEach(item => {
        if (item.id) {
          uniqueMap.set(item.id, item);
        }
      });
      const uniqueList = Array.from(uniqueMap.values());

      // Filter system/unwanted logs
      const filtered = uniqueList.filter((photo: any) => {
        const toExclude = ['유아교육과', '스승의 날', '엠티', 'student_council'];
        const titleContains = photo.title && toExclude.some(term => photo.title.toLowerCase().includes(term.toLowerCase()));
        const descContains = photo.description && toExclude.some(term => photo.description.toLowerCase().includes(term.toLowerCase()));
        const authorContains = photo.author && toExclude.some(term => photo.author.toLowerCase().includes(term.toLowerCase()));
        return !titleContains && !descContains && !authorContains;
      });

      setPhotos(filtered);
      setLoading(false);
    };

    unsub1 = onSnapshot(q1, (snapshot) => {
      list1 = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      handleCombinedUpdate();
    }, (error) => {
      console.error("Firestore error loading activity_photos:", error);
      handleFirestoreError(error, OperationType.GET, 'activity_photos');
    });

    unsub2 = onSnapshot(q2, (snapshot) => {
      list2 = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      handleCombinedUpdate();
    }, (error) => {
      console.error("Firestore error loading intensive_photos:", error);
      handleFirestoreError(error, OperationType.GET, 'intensive_photos');
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  // Sync category parameter or action parameters
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'upload') {
      setShowUploadModal(true);
    }
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Handle Incremental View Count
  const handleViewDetails = async (photo: PhotoItem) => {
    setActivePhoto(photo);
    if (!photo.id.startsWith('seed-') && !photo.id.startsWith('intensive-seed-')) {
      try {
        const collectionName = photo._sourceCollection || 'activity_photos';
        const photoRef = doc(db, collectionName, photo.id);
        await updateDoc(photoRef, {
          viewCount: (photo.viewCount || 0) + 1
        });
      } catch (e) {
        console.warn("Could not increment view count", e);
      }
    } else {
      setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, viewCount: (p.viewCount || 0) + 1 } : p));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Create / Upload Post Handler
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setUploadProgress(true);

    let finalImageUrl = newImageUrl.trim();

    try {
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
            throw new Error("파일 크기가 너무 큽니다 (최대 800KB). 이미지 크기를 줄이거나 주소 입력을 이용해 주세요.");
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
        heritage: chosenHeritage || null,
        summary: newSummary.trim() || null,
        keywords: newKeywords.trim() || null,
        attachmentUrl: newAttachmentUrl.trim() || null,
        activityType: activityType // Store current page activityType explicitly!
      };

      await addDoc(collection(db, 'activity_photos'), docData);

      // Reset form fields
      setNewTitle('');
      setNewEventDate('');
      setNewDescription('');
      setNewAuthor(defaultAuthorValue);
      setAuthorSelectType(defaultAuthorValue);
      setNewCustomAuthor('');
      setNewMakerStage('');
      setNewHeritageSelect(defaultHeritageValue);
      setNewCustomHeritage('');
      setNewDisplayDate(new Date().toISOString().split('T')[0]);
      setNewImageUrl('');
      setImageFile(null);
      setNewSummary('');
      setNewKeywords('');
      setNewAttachmentUrl('');
      setShowUploadModal(false);
      alert('새 활동이 아카이브에 안전하게 등록되었습니다!');
    } catch (err: any) {
      console.error(err);
      setFormError(`저장 중 오류 발생: ${err.message || err}`);
      handleFirestoreError(err, OperationType.CREATE, 'activity_photos');
    } finally {
      setUploadProgress(false);
    }
  };

  // Delete Post Handler
  const handleDelete = async (id: string) => {
    if (!window.confirm('이 콘텐츠를 삭제하시겠습니까?')) return;
    try {
      const targetPost = photos.find(p => p.id === id);
      const collectionName = (targetPost && targetPost._sourceCollection) || 'activity_photos';
      
      if (!id.startsWith('seed-') && !id.startsWith('intensive-seed-') && !id.startsWith('club-seed-')) {
        await deleteDoc(doc(db, collectionName, id));
      } else {
        setPhotos(prev => prev.filter(p => p.id !== id));
      }
      setActivePhoto(null);
      alert('성공적으로 삭제되었습니다.');
    } catch (e: any) {
      alert(`삭제 중 오류가 발생했습니다: ${e.message}`);
      handleFirestoreError(e, OperationType.DELETE, `activity_photos/${id}`);
    }
  };

  // Edit / Update Post Handler
  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;
    setUploadProgress(true);

    let finalImageUrl = editImageUrl.trim();

    try {
      if (editImageFile) {
        try {
          const uploadPromise = async () => {
            const fileRef = ref(storage, `${selectedPost._sourceCollection || 'activity_photos'}/${Date.now()}_${editImageFile.name}`);
            const snapshot = await uploadBytes(fileRef, editImageFile);
            return await getDownloadURL(snapshot.ref);
          };

          const timeoutPromise = new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error("Storage timeout")), 3000)
          );

          finalImageUrl = await Promise.race([uploadPromise(), timeoutPromise]);
        } catch (storageError) {
          console.warn("Storage upload failed or timed out during edit, falling back to Base64:", storageError);
          if (editImageFile.size > 800 * 1024) {
            alert("파일 크기가 너무 큽니다 (최대 800KB).");
            setUploadProgress(false);
            return;
          }
          finalImageUrl = await fileToBase64(editImageFile);
        }
      }

      const updatedData = {
        title: editTitle,
        eventDate: editEventDate,
        description: editDescription,
        category: editCategory,
        author: editAuthor,
        imageUrl: finalImageUrl,
        displayDate: editDisplayDate,
        makerStage: editMakerStage || null,
        heritage: editHeritage || null,
        summary: editSummary.trim() || null,
        keywords: editKeywords.trim() || null,
        attachmentUrl: editAttachmentUrl.trim() || null,
        activityType: editActivityType // Admins can directly select and modify activityType!
      };

      const collectionName = selectedPost._sourceCollection || 'activity_photos';

      if (!selectedPost.id.startsWith('seed-') && !selectedPost.id.startsWith('intensive-seed-')) {
        const docRef = doc(db, collectionName, selectedPost.id);
        await updateDoc(docRef, updatedData);
      } else {
        setPhotos(prev => prev.map(p => p.id === selectedPost.id ? { ...p, ...updatedData } : p));
      }

      if (activePhoto && activePhoto.id === selectedPost.id) {
        setActivePhoto({
          ...activePhoto,
          ...updatedData
        } as any);
      }

      alert('성공적으로 저장되었습니다.');
      setSelectedPost(null);
      setEditImageFile(null);
    } catch (err: any) {
      console.error(err);
      alert(`수정 중 오류가 발생했습니다: ${err.message || err}`);
      handleFirestoreError(err, OperationType.UPDATE, `${selectedPost._sourceCollection || 'activity_photos'}/${selectedPost.id}`);
    } finally {
      setUploadProgress(false);
    }
  };

  // Seed samples logic if database is empty for current section
  const handleSeedSamples = async () => {
    setUploadProgress(true);
    try {
      const batch = writeBatch(db);
      defaultPhotos.forEach((photo) => {
        const newDocRef = doc(collection(db, 'activity_photos'));
        batch.set(newDocRef, {
          title: photo.title,
          eventDate: photo.eventDate,
          description: photo.description,
          category: photo.category,
          author: photo.author,
          imageUrl: photo.imageUrl,
          viewCount: photo.viewCount || 0,
          createdAt: serverTimestamp(),
          displayDate: photo.displayDate || new Date().toISOString().split('T')[0],
          makerStage: photo.makerStage || null,
          heritage: photo.heritage || null,
          summary: photo.summary || null,
          keywords: photo.keywords || null,
          attachmentUrl: photo.attachmentUrl || null,
          activityType: activityType
        });
      });
      await batch.commit();
      alert(`샘플 활동 데이터 ${defaultPhotos.length}건이 성공적으로 등록되었습니다!`);
    } catch (e: any) {
      alert('오류 발생: ' + e.message);
    } finally {
      setUploadProgress(false);
    }
  };

  // Filtering Logic
  // Filtering Logic
  const displayPhotos = [
    ...photos,
    ...(defaultPhotos || []).map(dp => ({
      ...dp,
      activityType: dp.activityType || activityType
    })).filter(dp => !photos.some(p => p.id === dp.id || p.title === dp.title))
  ].filter(photo => {
    // Exclude certain specific dates if matching standard exclusions
    const rawStr = photo.displayDate || (photo.eventDate ? `2026-${photo.eventDate.replace('.', '-')}` : '');
    const isExcluded = ['2026-05-25', '2026-06-03', '2026-06-10'].some(ex => rawStr.includes(ex));
    return !isExcluded;
  }).sort((a, b) => {
    // Keep 1st to 15th (or 5th) seed lessons in perfect ascending order first
    const isSeedA = a.id.startsWith('seed-') || a.id.startsWith('intensive-seed-') || a.id.startsWith('club-seed-');
    const isSeedB = b.id.startsWith('seed-') || b.id.startsWith('intensive-seed-') || b.id.startsWith('club-seed-');
    if (isSeedA && isSeedB) {
      const numA = parseInt(a.id.replace(/^[^\d]+/, ''), 10);
      const numB = parseInt(b.id.replace(/^[^\d]+/, ''), 10);
      return numA - numB;
    }
    if (isSeedA) return -1;
    if (isSeedB) return 1;
    
    // User-added entries are sorted descending by date
    const rawDateA = a.displayDate || (a.eventDate ? `2026-${a.eventDate.replace('.', '-')}` : '1970-01-01');
    const rawDateB = b.displayDate || (b.eventDate ? `2026-${b.eventDate.replace('.', '-')}` : '1970-01-01');
    return rawDateB.localeCompare(rawDateA);
  });

  // Filter the complete display photos by exact conditions
  const filteredPhotos = displayPhotos.filter((photo) => {
    // 1. Strict Page/ActivityType Separation
    if (photo.activityType !== activityType) {
      return false;
    }

    // 2. Category / Step Filter (Disabled since subcategory box is removed)
    // Always returns true to prevent filtering by category
    
    // 3. M.A.K.E.R filter
    if (selectedMakerStage !== '전체') {
      const cleanPhotoStage = (photo.makerStage || '').replace(/\s/g, '');
      const cleanFilterStage = selectedMakerStage.replace(/\s/g, '');
      if (cleanPhotoStage !== cleanFilterStage) {
        return false;
      }
    }

    // 4. Learning Area filter
    if (selectedHeritage !== '전체') {
      // Special edge case for basic learning
      if (activityType === '기초학습' && selectedHeritage === '구글 기반 디지털·협업 기초') {
        const isMatch = photo.heritage === '구글 기반 디지털·협업 기초' || 
                        photo.heritage === '구글 디지털 기초' || 
                        photo.category?.includes('기본1');
        if (!isMatch) return false;
      } else {
        if (photo.heritage !== selectedHeritage) {
          return false;
        }
      }
    }

    // 5. Search query matching
    if (searchQuery.trim()) {
      const cleanQuery = searchQuery.toLowerCase().trim();
      const matchesTitle = photo.title && photo.title.toLowerCase().includes(cleanQuery);
      const matchesDesc = photo.description && photo.description.toLowerCase().includes(cleanQuery);
      const matchesAuthor = photo.author && photo.author.toLowerCase().includes(cleanQuery);
      const matchesKeywords = photo.keywords && photo.keywords.toLowerCase().includes(cleanQuery);
      const matchesHeritage = photo.heritage && photo.heritage.toLowerCase().includes(cleanQuery);

      if (!matchesTitle && !matchesDesc && !matchesAuthor && !matchesKeywords && !matchesHeritage) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 text-left pt-20">
      {/* Decorative Accent Border */}
      <div className="h-1 bg-gradient-to-r from-[#8C6239] via-[#C5A880] to-[#1A1A1A] w-full" />

      {/* Breadcrumb section */}
      <div className="bg-[#FAF8F5] border-b border-zinc-200 py-3">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center space-x-2 text-xs text-zinc-500 font-sans">
          <Link to="/" className="flex items-center text-zinc-400 hover:text-zinc-700 transition-colors">
            <Home className="w-3.5 h-3.5" />
          </Link>
          <span className="text-zinc-300 font-light">/</span>
          <div className="flex items-center space-x-1 hover:text-zinc-700 cursor-pointer">
            <span style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}>2. 디딤발 활동</span>
          </div>
          <span className="text-zinc-300 font-light">/</span>
          <div className="flex items-center space-x-1 text-zinc-800 font-semibold cursor-pointer">
            <span style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}>{pageTitle}</span>
          </div>
        </div>
      </div>

      {/* [2. 공통 제목 영역] */}
      <div className="relative py-20 px-4 bg-[#FCFAF5] border-b border-[#EADFCB]/30 overflow-hidden text-center">
        <div className="hanji-texture absolute inset-0 opacity-15 pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <h1 
            className="font-serif text-[#1A1A1A] font-bold tracking-tight px-4"
            style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal', fontSize: 'clamp(1.5rem, 5.5vw, 2.75rem)' }}
          >
            {pageTitle}
          </h1>
          <div className="h-0.5 w-16 bg-[#8C6239]/40 mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 space-y-8">
        
        {/* [3. 공통 내용 영역] */}
        <div className="bg-white border border-[#EADFCB]/30 p-6 rounded-sm shadow-xs space-y-6">
          
          {/* Row 1: Search and New Post button */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="결과물 제목, 내용, 키워드로 검색해보세요..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-zinc-200 hover:border-zinc-300 focus:border-[#8C6239] focus:bg-white rounded-md text-sm outline-none transition-all font-sans"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* + 새 활동 등록 (NEW POST) button for admin */}
            {isAdmin && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-5 py-2.5 bg-[#8C6239] hover:bg-[#704e2d] text-white text-xs font-bold rounded-md flex items-center justify-center transition-all shadow-xs cursor-pointer"
                style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
              >
                <span>＋ 새 활동 등록 (NEW POST)</span>
              </button>
            )}
          </div>

          {/* Row 2: M.A.K.E.R Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-zinc-100">
            <span 
              className="text-xs font-bold text-zinc-500 uppercase tracking-wider min-w-[100px] text-left"
              style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
            >
              M.A.K.E.R 필터
            </span>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {['전체', 'M: 만남', 'A: 질문', 'K: 이해', 'E: 표현', 'R: 연결'].map(stage => {
                const isActive = selectedMakerStage === stage;
                return (
                  <button
                    key={stage}
                    onClick={() => setSelectedMakerStage(stage)}
                    className={`px-3 py-1.5 text-xs font-sans transition-all duration-200 border rounded-md cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs font-bold'
                        : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-350 hover:bg-slate-50'
                    }`}
                    style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 3: Learning Area Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-zinc-100">
            <span 
              className="text-xs font-bold text-zinc-500 uppercase tracking-wider min-w-[100px] text-left"
              style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
            >
              학습 영역 필터
            </span>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {learningAreas.map(area => {
                const isActive = selectedHeritage === area;
                return (
                  <button
                    key={area}
                    onClick={() => setSelectedHeritage(area)}
                    className={`px-3 py-1.5 text-xs font-sans transition-all duration-200 border rounded-md cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs font-bold'
                        : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-350 hover:bg-slate-50'
                    }`}
                    style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Main Grid Content of Student Photos */}
        {loading ? (
          <div className="py-24 text-center text-zinc-400 font-sans">
            아카이브에서 활동 내역을 가져오고 있습니다...
          </div>
        ) : filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhotos.map((photo, index) => {
              const stageColors: Record<string, string> = {
                'M:만남': 'bg-blue-50 text-blue-800 border-blue-200',
                'A:질문': 'bg-pink-50 text-pink-800 border-pink-200',
                'K:이해': 'bg-yellow-50 text-yellow-800 border-yellow-200',
                'E:표현': 'bg-amber-50 text-amber-800 border-amber-200',
                'R:연결': 'bg-emerald-50 text-emerald-800 border-emerald-200'
              };

              const normalizedStageKey = photo.makerStage || '';
              const badgeClass = stageColors[normalizedStageKey] || 'bg-slate-100 text-slate-700 border-slate-200';

              return (
                <motion.div
                  key={photo.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="group bg-white border border-zinc-200 hover:border-[#8C6239]/50 transition-all duration-300 rounded-sm overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md relative"
                >
                  {/* Card Image */}
                  <div 
                    className="relative aspect-[16/10] bg-zinc-50 overflow-hidden cursor-pointer"
                    onClick={() => handleViewDetails(photo)}
                  >
                    <img
                      src={photo.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-103 duration-500 transition-transform"
                      referrerPolicy="no-referrer"
                    />

                    {/* Stage Badges overlaid */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 shadow-xs">
                      {photo.category && (
                        <span className="text-[10px] font-sans font-bold bg-zinc-950/80 text-white px-2 py-0.5 rounded-sm">
                          {photo.category.replace(/기본\d\s*\(.+\)/g, (m) => m.split(' ')[0])}
                        </span>
                      )}
                      
                      {photo.makerStage && (
                        <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-sm border ${badgeClass}`}>
                          {photo.makerStage}
                        </span>
                      )}

                      {photo.toolType && (
                        <span className="text-[10px] font-sans font-bold bg-[#1E3A8A]/95 text-white px-2 py-0.5 rounded-sm border border-[#1E3A8A]">
                          {photo.toolType}
                        </span>
                      )}
                    </div>

                    {/* Admin Controls quick delete/edit */}
                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex items-center space-x-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPost(photo);
                          }}
                          className="p-1.5 bg-white/95 hover:bg-white text-zinc-700 hover:text-[#8C6239] rounded-full shadow-md transition-colors border border-[#EADFCB]/40 cursor-pointer"
                          title="수정"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(photo.id);
                          }}
                          className="p-1.5 bg-white/95 hover:bg-red-500 hover:text-white text-red-600 rounded-full shadow-md transition-colors border border-red-100 cursor-pointer"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Content info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-sans">
                        <div className="flex items-center space-x-1.5">
                          <User className="w-3 h-3 text-zinc-300" />
                          <span>{photo.author}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Clock className="w-3 h-3 text-zinc-300" />
                          <span>
                            {photo.displayDate 
                              ? photo.displayDate.substring(5).replace('-', '.') 
                              : photo.eventDate || '06.15'}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-zinc-900 text-base leading-snug line-clamp-2 group-hover:text-[#8C6239] transition-colors">
                        {cleanActivityTitle(photo.title)}
                      </h3>

                      <p className="text-xs text-zinc-500 font-sans line-clamp-3 leading-relaxed">
                        {photo.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 font-sans uppercase">
                        {photo.heritage || '구글 디지털 소양'}
                      </span>
                      <button 
                        onClick={() => handleViewDetails(photo)}
                        className="text-xs font-serif font-semibold text-[#8C6239] hover:text-[#704e2d] transition-colors flex items-center space-x-0.5"
                      >
                        <span>자세히 보기</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 duration-200 transition-transform" />
                      </button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-zinc-200 rounded-lg bg-white">
            <AlertCircle className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-500 font-sans text-sm mb-4">
              {activityType === '학생동아리 활동' 
                ? '학생동아리 활동 내용은 추후 등록됩니다.' 
                : '해당 카테고리나 필터 조건에 부합하는 학생 활동 결과물이 없습니다.'}
            </p>
            {isAdmin && (
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-[#8C6239] text-white hover:bg-[#704e2d] rounded-sm text-xs font-bold transition-all cursor-pointer"
                >
                  직접 아카이브 채우기
                </button>
                <button
                  onClick={handleSeedSamples}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 rounded-sm text-xs font-bold transition-all cursor-pointer"
                >
                  기본 샘플 데이터 생성
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* DETAIL MODAL CONTAINER */}
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
              <div className="hanji-texture absolute inset-0 opacity-10 pointer-events-none" />

              <div className="relative z-10 space-y-6 text-left">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {activePhoto.category && (
                        <span className="text-[10px] text-[#8C6239] bg-[#8C6239]/5 border border-[#8C6239]/20 px-2.5 py-0.5 rounded-sm font-bold font-serif uppercase tracking-widest">
                          {activePhoto.category}
                        </span>
                      )}
                      {activePhoto.makerStage && (
                        <span className="text-[10px] text-zinc-700 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-sm font-bold font-serif whitespace-nowrap">
                          {activePhoto.makerStage}
                        </span>
                      )}
                      {activePhoto.toolType && (
                        <span className="text-[10px] text-[#1967D2] bg-[#E8F0FE] border border-[#D2E3FC] px-2.5 py-0.5 rounded-sm font-bold font-serif whitespace-nowrap">
                          도구: {activePhoto.toolType}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold font-serif text-[#1A1A1A] leading-snug">
                      {cleanActivityTitle(activePhoto.title)}
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans">
                      분류: <span className="font-semibold text-zinc-650">{activePhoto.activityType || '미분류'}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => setActivePhoto(null)}
                    className="p-1 px-1.5 border border-zinc-200 text-zinc-400 hover:text-zinc-600 rounded-sm hover:bg-stone-50 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Image */}
                <div className="aspect-[16/10] bg-black rounded-xs overflow-hidden shadow-inner relative border border-[#EADFCB]/30">
                  <img 
                    src={activePhoto.imageUrl} 
                    alt={activePhoto.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Sub-metadata row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3.5 px-4 bg-[#FAF8F5] border border-[#EADFCB]/40 rounded-sm text-xs text-zinc-600 font-serif">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-zinc-400" />
                    <div>
                      <span className="font-bold text-zinc-800 block sm:inline">작성자:</span>{' '}
                      <span className="text-zinc-600">{activePhoto.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                    <div>
                      <span className="font-bold text-zinc-800 block sm:inline">날짜:</span>{' '}
                      <span className="text-zinc-650">
                        {activePhoto.displayDate 
                          ? activePhoto.displayDate.replace(/-/g, '.')
                          : activePhoto.eventDate || '2026.06.15'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-zinc-400" />
                    <div>
                      <span className="font-bold text-zinc-800 block sm:inline">조회수:</span>{' '}
                      <span className="text-zinc-650">{activePhoto.viewCount || 0}회</span>
                    </div>
                  </div>
                </div>

                {/* Course name */}
                <div className="pt-2 pb-1 border-b border-zinc-100 text-xs text-zinc-600 font-serif">
                  <span className="font-bold text-zinc-800">학습 과정명 / 영역:</span>{' '}
                  <span className="text-[#8C6239] font-semibold">{activePhoto.heritage || '미분류'}</span>
                </div>

                {/* Summary */}
                {activePhoto.summary && (
                  <div className="bg-[#FAF8F5]/80 border-l-4 border-[#8C6239] p-4 rounded-sm">
                    <h4 className="text-xs text-[#8C6239] font-bold font-serif uppercase tracking-wider mb-1">■ 활동 요약</h4>
                    <p className="text-xs text-zinc-700 font-sans leading-relaxed break-all">
                      {activePhoto.summary}
                    </p>
                  </div>
                )}

                {/* Full Description */}
                <div className="space-y-2">
                  <h4 className="text-xs text-[#8C6239] font-bold uppercase tracking-wider font-serif">■ 상세 활동 기록</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed break-keep font-serif whitespace-pre-wrap pl-1 font-light">
                    {activePhoto.description}
                  </p>
                </div>

                {/* Major Activities */}
                {activePhoto.majorActivities && activePhoto.majorActivities.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <h4 className="text-xs text-[#8C6239] font-bold uppercase tracking-wider font-serif">■ 주요 활동 목록</h4>
                    <ul className="list-disc list-inside text-xs text-zinc-750 font-sans leading-relaxed pl-2 space-y-1">
                      {activePhoto.majorActivities.map((act, i) => (
                        <li key={i} className="pl-1 text-zinc-700">{act}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {activePhoto.warnings && activePhoto.warnings.length > 0 && (
                  <div className="bg-red-50/50 border-l-4 border-red-300 p-4 rounded-sm space-y-1">
                    <h4 className="text-xs text-red-700 font-bold uppercase tracking-wider font-sans">⚠️ 주의사항</h4>
                    <ul className="list-disc list-inside text-[11px] text-red-800 font-sans leading-relaxed pl-1 space-y-0.5">
                      {activePhoto.warnings.map((warn, i) => (
                        <li key={i}>{warn}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keywords */}
                {activePhoto.keywords && (
                  <div className="space-y-1.5 pt-2">
                    <h4 className="text-xs text-zinc-400 font-bold font-sans uppercase tracking-wider">키워드 태그</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activePhoto.keywords.split(/[\s,#]+/).filter(Boolean).map((kw, i) => (
                        <span key={i} className="text-[11px] font-sans text-[#8C6239] bg-[#8C6239]/5 border border-[#8C6239]/10 px-2 py-0.5 rounded-sm">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {activePhoto.attachmentUrl && (
                  <div className="pt-3 border-t border-zinc-150 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-sans">※ 참고자료 및 학생 제작물 파일이 포함되어 있습니다.</span>
                    <a
                      href={activePhoto.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-slate-150 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold rounded-sm flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>첨부파일 및 제작물 보기</span>
                    </a>
                  </div>
                )}

                {/* Admin controls */}
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
                      <span>삭제</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE MODAL CONTAINER */}
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
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center pb-3 border-b border-[#EADFCB]/50">
                  <h4 className="text-xl font-bold font-serif text-[#1A1A1A] flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-[#8C6239]" />
                    <span>새 활동 등록 (NEW POST)</span>
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
                  {/* Activity Type is locked based on page */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">활동 구분 (자동 설정)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-stone-100 border border-[#EADFCB] rounded-sm text-xs outline-none text-zinc-600"
                      value={activityType}
                      disabled
                    />
                  </div>

                  {/* Maker Stage */}
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

                  {/* Learning Area select */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">학습 영역 선택</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                      value={newHeritageSelect}
                      onChange={(e) => setNewHeritageSelect(e.target.value)}
                    >
                      {learningAreas.filter(la => la !== '전체').map(la => (
                        <option key={la} value={la}>{la}</option>
                      ))}
                      <option value="기타">직접 입력...</option>
                    </select>
                  </div>

                  {newHeritageSelect === '기타' && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-bold tracking-wider">학습 영역 직접 입력</label>
                      <input
                        type="text"
                        className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                        placeholder="학습 영역 또는 주제 입력"
                        value={newCustomHeritage}
                        onChange={(e) => setNewCustomHeritage(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {/* Category select (ONLY show basic levels for basic learning page) */}
                  {activityType === '기초학습' ? (
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-bold tracking-wider">구분 (게시판 카테고리)</label>
                      <select
                        className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      >
                        <option value="기본1 (기초)">기본1</option>
                        <option value="기본2(중급)">기본2</option>
                        <option value="기본3(고급)">기본3</option>
                        <option value="미분류(기타)">미분류(기타)</option>
                      </select>
                    </div>
                  ) : activityType === '수준별 심화학습' ? (
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-bold tracking-wider">구분 (게시판 카테고리)</label>
                      <select
                        className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      >
                        <option value="심화학습">심화학습</option>
                        <option value="미분류(기타)">미분류(기타)</option>
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-bold tracking-wider">구분 (게시판 카테고리)</label>
                      <select
                        className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      >
                        <option value="학생동아리">학생동아리</option>
                        <option value="미분류(기타)">미분류(기타)</option>
                      </select>
                    </div>
                  )}

                  {/* Detailed Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">활동 상세 제목 (선택사항)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="예: 크롬 배경화면 바꾸기"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>

                  {/* Date labels */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-bold tracking-wider">날짜 표시 (예: 05.13)</label>
                      <input
                        type="text"
                        className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                        placeholder="05.13"
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-bold tracking-wider">등록 일자 선택</label>
                      <input
                        type="date"
                        className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                        value={newDisplayDate}
                        onChange={(e) => setNewDisplayDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Author selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">소속 / 제작팀 선택</label>
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
                      {authorOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                      <option value="custom">직접 입력...</option>
                    </select>
                  </div>

                  {authorSelectType === 'custom' && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-bold tracking-wider">제작팀/작성자 직접 입력</label>
                      <input
                        type="text"
                        className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                        placeholder="소속 학과 또는 동아리명"
                        value={newCustomAuthor}
                        onChange={(e) => setNewCustomAuthor(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {/* Image uploading */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">대표 이미지 첨부</label>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#EADFCB] hover:border-[#8C6239] bg-white rounded-sm cursor-pointer transition-colors p-4">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                            <ImageIcon className="w-8 h-8 text-zinc-400 mb-2" />
                            <p className="text-[11px] text-zinc-500"><span className="font-semibold">클릭하여 이미지 업로드</span> 또는 드래그 앤 드롭</p>
                            <p className="text-[9px] text-zinc-400 mt-1">PNG, JPG, JPEG (최대 800KB)</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setImageFile(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                      {imageFile && (
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>선택된 파일: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)</span>
                        </p>
                      )}
                      <div className="text-center text-[10px] text-zinc-400">또는</div>
                      <input
                        type="text"
                        className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                        placeholder="외부 이미지 URL 링크 주소 입력"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Attachment URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">참고자료 / 첨부파일 드라이브 링크 (선택사항)</label>
                    <input
                      type="url"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="https://drive.google.com/..."
                      value={newAttachmentUrl}
                      onChange={(e) => setNewAttachmentUrl(e.target.value)}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">상세 활동 설명 기록</label>
                    <textarea
                      rows={4}
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] resize-none"
                      placeholder="학생들의 세부 활동 내용 및 관찰 기록을 줄바꿈하여 자세하게 작성해 주세요."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      required
                    />
                  </div>

                  {/* Summary */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">한 줄 요약 (선택사항)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="카드 목록에 간략히 노출될 요약 문장"
                      value={newSummary}
                      onChange={(e) => setNewSummary(e.target.value)}
                    />
                  </div>

                  {/* Keywords */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">키워드 태그 (예: 크롬, 배경화면, 소양)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="쉼표 또는 띄어쓰기로 태그 구분"
                      value={newKeywords}
                      onChange={(e) => setNewKeywords(e.target.value)}
                    />
                  </div>

                  {/* Actions buttons */}
                  <div className="flex justify-end pt-4 border-t border-[#EADFCB]/50 space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2 border border-zinc-200 text-zinc-500 hover:text-zinc-700 hover:bg-stone-50 rounded-sm cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={uploadProgress}
                      className="px-5 py-2 bg-[#8C6239] hover:bg-[#704e2d] text-white font-bold rounded-sm disabled:opacity-50 cursor-pointer"
                    >
                      {uploadProgress ? '저장 중...' : '활동 사진 등록 완료'}
                    </button>
                  </div>

                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL CONTAINER */}
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
              <div className="space-y-6 text-left">
                <div className="flex justify-between items-center pb-3 border-b border-[#EADFCB]/50">
                  <h4 className="text-xl font-bold font-serif text-[#1A1A1A] flex items-center space-x-2">
                    <Edit className="w-5 h-5 text-[#8C6239]" />
                    <span>활동 결과물 수정하기</span>
                  </h4>
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="p-1 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleEditSave} className="space-y-4 font-serif text-xs">
                  {/* [10. 기존 게시물 처리] - Admin can directly select activityType! */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">활동 구분 (수정)</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                      value={editActivityType}
                      onChange={(e) => setEditActivityType(e.target.value as any)}
                    >
                      <option value="기초학습">기초학습</option>
                      <option value="수준별 심화학습">수준별 심화학습</option>
                      <option value="학생동아리 활동">학생동아리 활동</option>
                      <option value="미분류">미분류</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">제목</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">M.A.K.E.R 단계</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                      value={editMakerStage}
                      onChange={(e) => setEditMakerStage(e.target.value)}
                    >
                      <option value="">없음</option>
                      <option value="M:만남">M:만남</option>
                      <option value="A:질문">A:질문</option>
                      <option value="K:이해">K:이해</option>
                      <option value="E:표현">E:표현</option>
                      <option value="R:연결">R:연결</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">학습 영역 / 과정명</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      value={editHeritage}
                      onChange={(e) => setEditHeritage(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">구분 카테고리</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-bold tracking-wider">날짜 표시 (예: 05.13)</label>
                      <input
                        type="text"
                        className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                        value={editEventDate}
                        onChange={(e) => setEditEventDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-zinc-500 font-bold tracking-wider">등록 일자</label>
                      <input
                        type="date"
                        className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                        value={editDisplayDate}
                        onChange={(e) => setEditDisplayDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">작성자 / 소속</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      value={editAuthor}
                      onChange={(e) => setEditAuthor(e.target.value)}
                      required
                    />
                  </div>

                  {/* Image edit */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">이미지 수정</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[#EADFCB] hover:border-[#8C6239] bg-white rounded-sm cursor-pointer p-4">
                          <div className="flex flex-col items-center justify-center text-center">
                            <ImageIcon className="w-6 h-6 text-zinc-400 mb-1" />
                            <p className="text-[10px] text-zinc-500">새 이미지 업로드하기</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setEditImageFile(e.target.files[0]);
                              }
                            }}
                          />
                        </label>
                      </div>
                      {editImageFile && (
                        <p className="text-[10px] text-emerald-600 font-bold">선택됨: {editImageFile.name}</p>
                      )}
                      <input
                        type="text"
                        className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                        placeholder="이미지 URL 주소 직접 입력"
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">참고자료 첨부파일 링크</label>
                    <input
                      type="url"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      value={editAttachmentUrl}
                      onChange={(e) => setEditAttachmentUrl(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">상세 활동 설명</label>
                    <textarea
                      rows={4}
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] resize-none"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">한 줄 요약</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      value={editSummary}
                      onChange={(e) => setEditSummary(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">키워드 태그</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      value={editKeywords}
                      onChange={(e) => setEditKeywords(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-[#EADFCB]/50 space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPost(null)}
                      className="px-4 py-2 border border-zinc-200 text-zinc-500 hover:text-zinc-700 hover:bg-stone-50 rounded-sm cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={uploadProgress}
                      className="px-5 py-2 bg-[#8C6239] hover:bg-[#704e2d] text-white font-bold rounded-sm disabled:opacity-50 cursor-pointer"
                    >
                      {uploadProgress ? '수정 중...' : '변경 내용 저장'}
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
