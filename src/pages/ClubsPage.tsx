import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, PenTool, Sparkles, Image as ImageIcon, FileText, Code, Rocket, ExternalLink, Calendar, User, Eye, CheckCircle2, X, Clock, Trash2, Edit } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import AdminUpload from '../components/AdminUpload';
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

interface Resource {
  id: string;
  title: string;
  type: 'image' | 'pdf';
  fileUrl: string;
  description: string;
  createdAt?: any;
  displayDate?: string;
  makerStage?: string;
  heritage?: string;
  category?: string;
}

interface ActivityPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  eventDate: string;
  author: string;
  viewCount: number;
  createdAt?: any;
  displayDate?: string;
  makerStage?: string;
  heritage?: string;
}

const DEFAULT_ACTIVITY_PHOTOS: ActivityPhoto[] = [
  {
    id: 'seed-1',
    title: '2026 스승의 날',
    eventDate: '05.11',
    description: '스승의 날을 맞이하여 교수님들께 감사한 마음을 전하는 시간을 가졌습니다. 유아교육과 학우들은 스승의 사랑에 작게나마 보답하기 위하여 따스한 카네이션과 마음이 깃든 메세지를 준비했습니다.',
    category: '기본1 (기초)',
    author: '유아교육과',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    viewCount: 106,
  },
  {
    id: 'seed-2',
    title: '2026 유아교육과 엠티',
    eventDate: '04.10~04.11',
    description: '4월 10일부터 11일까지 1박 2일 동안 대자연과 고풍스러운 문화 가옥이 어우러진 공간에서 유아교육과 연합 엠티를 진행하였습니다. 유아교육과 교수님과 선후배 학우들이 만나 따뜻한 소통의 물결을 이루었습니다.',
    category: '기본2(중급)',
    author: '유아교육과',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    viewCount: 225,
  },
  {
    id: 'seed-3',
    title: '2026 학생회 간담회',
    eventDate: '03.20',
    description: '2026년, 제45대 유아교육과 학생회 \'청아\'가 새롭게 출범하였습니다. 이에 2026학년도 1차 간담회를 통해 다채로운 학생 주도 탐구 활동과 학술 아카이브 활성화 방안에 대해 논의를 다졌습니다.',
    category: '기본3(고급)',
    author: '유아교육과',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    viewCount: 256,
  }
];

const clubLevels = {
  '기본1 (기초)': {
    title: '학생동아리 - 기본1 (기초)',
    level: 'Beginner',
    desc: 'AI 프로젝트의 기초를 다지고 문화유산과 처음 만나는 단계입니다.',
    topics: ['생성형 AI의 기본 이해', '시흥 문화유산 탐색하기', '간단한 AI 프롬프트 작성법', '문화유산 굿즈 기획'],
    icon: <PenTool className="w-12 h-12 text-gold-500" />
  },
  '기본2(중급)': {
    title: '학생동아리 - 기본2(중급)',
    level: 'Intermediate',
    desc: 'AI 도구를 활용해 시흥의 이야기를 창의적으로 재구성하는 단계입니다.',
    topics: ['이미지 생성 AI 심화 활용', '지역 스토리텔링 동화 제작', '디지털 드로잉과 AI 협업', '인터랙티브 콘텐츠 기초'],
    icon: <Code className="w-12 h-12 text-gold-500" />
  },
  '기본3(고급)': {
    title: '학생동아리 - 기본3(고급)',
    level: 'Advanced',
    desc: '복합적인 AI 기술을 통해 고도화된 지역 문화 아카이브를 제작하는 단계입니다.',
    topics: ['AI 뮤직비디오 및 OST 제작', '3D 가상 유적지 복원 프로젝트', '웹툰 및 인터랙션 디자인', '지역 사회 공유 및 전시'],
    icon: <Rocket className="w-12 h-12 text-gold-500" />
  }
};

export default function ClubsPage() {
  const { level } = useParams<{ level: string }>();
  const { isAdmin } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedMakerStage, setSelectedMakerStage] = useState<string>('전체');
  const [selectedHeritage, setSelectedHeritage] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activityPhotos, setActivityPhotos] = useState<ActivityPhoto[]>([]);
  const [activePhoto, setActivePhoto] = useState<ActivityPhoto | null>(null);

  // States to persist deleted posts and edited edits locally (for seamless instant deletion/updating of any item)
  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('deleted_post_ids');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [editedPosts, setEditedPosts] = useState<Record<string, Partial<Resource>>>(() => {
    try {
      const stored = localStorage.getItem('edited_post_data');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  // State to manage the editing modal
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  
  const currentLevel = clubLevels[level as keyof typeof clubLevels] || clubLevels['기본1 (기초)'];

  useEffect(() => {
    const q = query(
      collection(db, 'resources'),
      where('category', '==', level),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];
      setResources(fetched);
    });

    return () => unsubscribe();
  }, [level]);

  useEffect(() => {
    const q = query(
      collection(db, 'activity_photos'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setActivityPhotos(fetched);
    }, (error) => {
      console.error("Error loading activity photos in ClubsPage:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleViewDetails = async (photo: ActivityPhoto) => {
    setActivePhoto(photo);
    
    if (!photo.id.startsWith('seed-')) {
      try {
        const photoRef = doc(db, 'activity_photos', photo.id);
        await updateDoc(photoRef, {
          viewCount: (photo.viewCount || 0) + 1
        });
      } catch (e) {
        console.warn("Could not increment view count", e);
      }
    } else {
      setActivityPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, viewCount: (p.viewCount || 0) + 1 } : p));
    }
  };

  const handleDeleteResource = async (e: React.MouseEvent, res: Resource) => {
    e.stopPropagation(); // Prevent opening/clicking of card
    
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      return;
    }
    
    try {
      if (!res.id) {
        alert("유효한 게시글 ID를 찾을 수 없습니다.");
        return;
      }

      // Add to deletedIds local list so it disappears instantly from the screen
      const updatedDeleted = [...deletedIds, res.id];
      setDeletedIds(updatedDeleted);
      localStorage.setItem('deleted_post_ids', JSON.stringify(updatedDeleted));

      // Delete Firebase Storage associated file if exists and is stored on Firebase
      if (res.fileUrl && (res.fileUrl.includes('firebasestorage.googleapis.com') || res.fileUrl.startsWith('gs://'))) {
        try {
          const fileRef = ref(storage, res.fileUrl);
          await deleteObject(fileRef);
          console.log("Deleted associated Storage file successfully:", res.fileUrl);
        } catch (stErr) {
          console.warn("Storage file deletion skipped or failed:", stErr);
        }
      }

      const isSeed = res.id.startsWith('seed-');
      if (!isSeed) {
        // Try deletion directly on both collections in Firestore.
        try {
          await deleteDoc(doc(db, 'resources', res.id));
        } catch (dbErr) {
          try {
            await deleteDoc(doc(db, 'activity_photos', res.id));
          } catch (photoErr) {
            handleFirestoreError(dbErr, OperationType.DELETE, `resources/${res.id}`);
          }
        }
      }
      
      alert("성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleOpenEditModal = (e: React.MouseEvent, res: Resource) => {
    e.stopPropagation();
    setEditingResource(res);
  };



  const displayActivityPhotos = (() => {
    const matchingFromDb = activityPhotos.filter(photo => photo.category === level);
    const matchingFromDefaults = DEFAULT_ACTIVITY_PHOTOS.filter(photo => photo.category === level);
    // Combine them, avoiding duplicates by title
    return [
      ...matchingFromDb,
      ...matchingFromDefaults.filter(dp => !matchingFromDb.some(dbPhoto => dbPhoto.title.includes(dp.title) || dbPhoto.description.includes(dp.description.substring(0, 10))))
    ];
  })();

  // Map activity photos to resources so they can accumulate and stack in "학생 활동 아카이브"
  const activityPhotosAsResources: Resource[] = displayActivityPhotos.map(photo => {
    const stage = photo.makerStage || (photo.category === '기본3(고급)' || photo.category === '기본3 (고급)' ? 'K:이해' : (photo.category === '기본2(중급)' || photo.category === '기본2 (중급)' ? 'A:질문' : 'M:만남'));
    const heritageItem = photo.heritage || (photo.id === 'seed-1' ? '생금집' : (photo.id === 'seed-2' ? '호조벌' : '관곡지'));
    
    return {
      id: photo.id,
      title: photo.title.startsWith('[') ? photo.title : `[${stage}] ${photo.title}`,
      type: 'image' as const,
      fileUrl: photo.imageUrl,
      description: photo.description,
      createdAt: photo.createdAt || new Date(2026, 4, 31),
      displayDate: photo.displayDate || `2026.${photo.eventDate || '05.31'}`,
      makerStage: stage,
      heritage: heritageItem
    };
  });

  // Combine both sources
  const combinedAllResources = [
    ...resources,
    ...activityPhotosAsResources
  ];

  // Merge with locally edited values
  const finalResources = combinedAllResources.map(res => {
    if (editedPosts[res.id]) {
      return {
        ...res,
        ...editedPosts[res.id]
      };
    }
    return res;
  });

  // Filter out deleted posts
  const activeResources = finalResources.filter(res => !deletedIds.includes(res.id));

  // Sort them dynamically (Firestore timestamp, JS Date, or simple logic)
  const sortedCombinedResources = [...activeResources].sort((a, b) => {
    const getMs = (item: any) => {
      if (item.createdAt?.seconds) return item.createdAt.seconds * 1000;
      if (item.createdAt instanceof Date) return item.createdAt.getTime();
      return 0;
    };
    return getMs(b) - getMs(a);
  });

  // Filter the unified resources array exactly like resources
  const filteredResources = sortedCombinedResources.filter(res => {
    // 1. Maker Stage Filter
    const stageMatch = 
      selectedMakerStage === '전체' ||
      res.makerStage === selectedMakerStage ||
      res.title.includes(`[${selectedMakerStage}]`) ||
      (selectedMakerStage && res.title.startsWith(`[${selectedMakerStage.split(':')[0]}`)) ||
      res.title.includes(selectedMakerStage.split(':')[0]) ||
      (selectedMakerStage.includes(':') && res.title.includes(selectedMakerStage.split(':')[1]));

    // 2. Heritage Filter
    const heritageMatch = 
      selectedHeritage === '전체' ||
      res.heritage === selectedHeritage ||
      res.title.includes(selectedHeritage) ||
      (selectedHeritage === '기타' && !['호조벌', '관곡지', '오이도 패총', '군자봉성황제', '능곡선사유적지', '갯골·염전', '생금집'].some(h => res.title.includes(h) || res.heritage === h));

    // 3. Search Query Filter
    const searchMatch = 
      searchQuery.trim() === '' ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.description && res.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return stageMatch && heritageMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-hanji-50 pb-20 font-serif">
      {/* Hero Section */}
      <section className="relative py-24 bg-ink-900 text-hanji-100 overflow-hidden">
        <div className="hanji-texture absolute inset-0 opacity-10" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-gold-500/10 rounded-full border border-gold-500/20"
            >
              {currentLevel.icon}
            </motion.div>
            <div className="space-y-2">
              <span className="text-gold-500 font-serif tracking-[0.3em] text-[10px] uppercase font-bold">{currentLevel.level} Course</span>
              <h1 className="text-4xl md:text-5xl font-serif">{currentLevel.title}</h1>
            </div>
            <p className="text-hanji-200/60 font-serif max-w-2xl mx-auto leading-relaxed italic text-sm md:text-base">
              "{currentLevel.desc}"
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 space-y-32">
        {/* Curriculum Section */}
        <div className="space-y-12 font-sans">
          <div className="text-center space-y-4">
            <span className="text-gold-600 font-serif uppercase tracking-[0.3em] text-[10px] font-bold opacity-60">Learning Journey</span>
            <h2 className="text-3xl md:text-4xl font-serif text-ink-900">핵심 학습 주제</h2>
            <div className="h-0.5 w-16 bg-gold-500 mx-auto opacity-20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentLevel.topics.map((topic, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 bg-white border border-gold-500/10 hover:border-gold-500/30 transition-all duration-500 shadow-sm"
              >
                <div className="flex flex-col items-center text-center space-y-5">
                  <div className="w-12 h-12 rounded-full bg-gold-500/5 flex items-center justify-center text-gold-600 font-serif text-lg border border-gold-500/10 group-hover:bg-gold-500 group-hover:text-white transition-all duration-500">
                    {i + 1}
                  </div>
                  <span className="text-ink-800 font-serif leading-relaxed text-sm md:text-base px-2">{topic}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Board Archive Section */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-ink-900/10 pb-10">
             <div className="space-y-3 text-left">
               <h3 className="text-3xl md:text-4xl font-serif text-ink-900">학생 활동 아카이브</h3>
               <p className="text-ink-800/40 font-serif text-sm">
                 시흥의 문화유산을 탐구하며 기록한 학생들의 소장 활동들이 게시됩니다.
               </p>
             </div>
             
             <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-3">
                <div className="relative md:w-80 shadow-sm flex-1">
                  <input 
                    type="text" 
                    placeholder="검색어를 입력하세요."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-12 py-3.5 bg-white border border-ink-900/10 focus:border-gold-500/40 outline-none font-serif text-sm transition-all text-ink-900"
                  />
                  <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/40" />
                </div>

                {isAdmin && (
                  <button
                    onClick={() => {
                      const btn = document.querySelector('.fixed.bottom-8.right-8 button') as HTMLButtonElement;
                      if (btn) {
                        btn.click();
                      } else {
                        // Fallback UI helper
                        const uploadTrigger = document.querySelector('[class*="fixed bottom-"]') as HTMLElement;
                        if (uploadTrigger) uploadTrigger.click();
                      }
                    }}
                    className="px-5 py-3.5 bg-gold-500 hover:bg-gold-600 active:scale-[0.98] text-ink-900 font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center justify-center space-x-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <span>NEW POST</span>
                  </button>
                )}
             </div>
          </div>

          {/* Interactive Filters Bar */}
          <div className="bg-white border border-gold-500/10 p-6 space-y-5 shadow-xs">
            {/* MAKER Stage Selectors */}
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <span className="text-xs font-bold text-ink-800/60 uppercase tracking-widest min-w-[120px] font-sans">
                M.A.K.E.R 단계
              </span>
              <div className="flex flex-wrap gap-2">
                {['전체', 'M:만남', 'A:질문', 'K:이해', 'E:표현', 'R:연결'].map(stage => {
                  const isActive = selectedMakerStage === stage;
                  return (
                    <button
                      key={stage}
                      onClick={() => setSelectedMakerStage(stage)}
                      className={`px-4 py-2 text-xs font-serif transition-all duration-300 border cursor-pointer ${
                        isActive
                          ? 'bg-ink-900 text-gold-500 border-ink-900 shadow-md font-bold'
                          : 'bg-hanji-100/30 text-ink-800/70 border-gold-500/10 hover:border-gold-500/40'
                      }`}
                    >
                      {stage}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cultural Heritage Selectors */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 pt-4 border-t border-gold-500/10">
              <span className="text-xs font-bold text-ink-800/60 uppercase tracking-widest min-w-[120px] font-sans">
                문화유산 분류
              </span>
              <div className="flex flex-wrap gap-2">
                {['전체', '호조벌', '관곡지', '오이도 패총', '군자봉성황제', '능곡선사유적지', '갯골·염전', '생금집', '기타'].map(heritage => {
                  const isActive = selectedHeritage === heritage;
                  return (
                    <button
                      key={heritage}
                      onClick={() => setSelectedHeritage(heritage)}
                      className={`px-4 py-2 text-xs font-serif transition-all duration-300 border cursor-pointer ${
                        isActive
                          ? 'bg-gold-500 text-ink-900 border-gold-500 shadow-md font-bold'
                          : 'bg-hanji-100/30 text-ink-800/70 border-gold-500/10 hover:border-gold-500/40'
                      }`}
                    >
                      {heritage}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredResources.length > 0 ? (
              filteredResources.map((res, index) => {
                const imageUrl = res.imageUrl || (res as any).thumbnailUrl || (res.type === 'image' ? res.fileUrl : 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800');
                const stage = res.makerStage || (res.title.match(/^\[(.*?)\]/) ? res.title.match(/^\[(.*?)\]/)![1] : (level === '기본3(고급)' || level === '기본3 (고급)' ? 'K:이해' : (level === '기본2(중급)' || level === '기본2 (중급)' ? 'A:질문' : 'M:만남')));
                const heritageItem = res.heritage || ['호조벌', '관곡지', '오이도 패총', '군자봉성황제', '능곡선사유적지', '갯골·염전', '생금집'].find(h => res.title.includes(h)) || '생금집';
                const cleanTitle = cleanActivityTitle(res.title);
                const displayDateString = res.displayDate 
                  ? res.displayDate.replace(/-/g, '.')
                  : (res.createdAt 
                      ? (res.createdAt.seconds 
                          ? new Date(res.createdAt.seconds * 1000).toLocaleDateString('ko-KR').replace(/ /g, '').slice(0, -1)
                          : new Date(res.createdAt).toLocaleDateString('ko-KR').replace(/ /g, '').slice(0, -1)
                        )
                      : '2026.05.31'
                    );

                return (
                  <motion.div
                    key={res.id || index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer bg-white transition-all flex flex-col justify-between align-top border border-zinc-100/80 hover:border-gold-500/30 rounded-xs overflow-hidden shadow-xs hover:shadow-md"
                    onClick={() => {
                      if (res.fileUrl) {
                        window.open(res.fileUrl, '_blank', 'noopener,noreferrer');
                      }
                    }}
                  >
                    {/* Thumbnail Section */}
                    <div className="relative aspect-[16/10] bg-stone-50 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={cleanTitle}
                        className="w-full h-full object-cover group-hover:scale-102 duration-500 transition-transform"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800';
                        }}
                      />
                      {/* File type badge */}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-[#414141] text-[9px] font-sans font-bold text-[#FAF8F5] tracking-widest uppercase rounded-xs">
                        {res.type === 'pdf' ? 'PDF' : 'IMAGE'}
                      </div>
                      
                      {/* Admin Controls Box */}
                      {isAdmin && (
                        <div className="absolute top-3 right-3 flex items-center space-x-1.5 z-10">
                          {/* Edit Button */}
                          <button
                            onClick={(e) => handleOpenEditModal(e, res)}
                            className="bg-gold-500 text-ink-900 px-2.5 py-1.5 font-sans font-bold text-[10px] sm:text-xs rounded-sm shadow-md hover:bg-gold-600 hover:scale-105 active:scale-[95] transition-all flex items-center space-x-1 cursor-pointer border border-gold-500/20"
                            title="수정"
                          >
                            <Edit className="w-3 h-3" />
                            <span>수정</span>
                          </button>
                          
                          {/* Delete Button */}
                          <button
                            onClick={(e) => handleDeleteResource(e, res)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md hover:scale-105 active:scale-[95] transition-all cursor-pointer border border-red-700/20"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Metadata Detail Section */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                      <div className="space-y-2.5">
                        {/* Enlarged badges as requested */}
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <span className="font-sans font-bold text-amber-700 bg-amber-50 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-sm text-xs sm:text-[13px] border border-amber-500/15 leading-none shadow-2xs select-none">
                            {stage}
                          </span>
                          <span className="font-sans font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-sm text-xs sm:text-[13px] border border-emerald-500/15 leading-none shadow-2xs select-none">
                            {heritageItem}
                          </span>
                        </div>

                        {/* Title text hidden in Card UI but preserved in data as per user request */}
                        {/* <h3 className="text-[14px] font-bold text-zinc-950 group-hover:text-blue-600 transition-colors leading-snug break-keep text-left font-sans line-clamp-2">
                          {cleanTitle}
                        </h3> */}

                        <p className="text-[12.5px] text-zinc-650 leading-relaxed line-clamp-2 break-keep h-10 font-sans text-left mt-1">
                          {res.description || ''}
                        </p>
                      </div>

                      {/* Info Row Bottom */}
                      <div className="flex items-center space-x-3 text-[10.5px] font-sans text-zinc-400 font-medium leading-none pt-2.5 border-t border-zinc-100">
                        <div className="flex items-center text-zinc-500">
                          <User className="w-3.5 h-3.5 text-blue-500 mr-1" />
                          <span className="font-semibold text-zinc-600">{(res as any).author || '동아리 학생'}</span>
                        </div>

                        <div className="flex items-center select-none text-zinc-400">
                          <Clock className="w-3.5 h-3.5 text-zinc-300 mr-1" />
                          <span>{displayDateString}</span>
                        </div>

                        <div className="flex items-center text-zinc-400">
                          <Eye className="w-3.5 h-3.5 text-zinc-300 mr-1" />
                          <span>{(res as any).viewCount || 82}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-24 text-center text-zinc-400 font-sans italic text-sm">
                작성된 게시글이 없습니다.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center border-t border-ink-900/5 pt-12">
            <div className="flex items-center space-x-1">
               <button className="w-10 h-10 flex items-center justify-center border border-ink-900/10 text-ink-900 group hover:border-gold-500 transition-all">
                  <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
               </button>
               <button className="w-10 h-10 bg-ink-900 text-gold-500 font-serif font-bold text-sm">1</button>
               <button className="w-10 h-10 flex items-center justify-center border border-ink-900/10 text-ink-900 group hover:border-gold-500 transition-all">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
               </button>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-16 bg-gold-500/5 border border-gold-500/10 text-center space-y-8 relative overflow-hidden group">
           <div className="absolute inset-0 hanji-texture opacity-5 group-hover:scale-105 transition-transform duration-1000" />
           <div className="relative z-10 space-y-6">
              <h3 className="text-2xl md:text-3xl font-serif text-ink-900">다른 단계의 동아리 살펴보기</h3>
              <div className="flex flex-wrap justify-center gap-4">
                 {['기본1 (기초)', '기본2(중급)', '기본3(고급)'].filter(lvl => lvl !== level).map(lvl => (
                   <Link 
                     key={lvl}
                     to={`/clubs/${lvl}`}
                     className="px-10 py-3 bg-white border border-gold-500/20 text-ink-800 font-serif text-sm hover:border-gold-500 hover:text-gold-600 transition-all shadow-sm"
                   >
                     {lvl}
                   </Link>
                 ))}
              </div>
           </div>
        </div>
      </section>

      <AdminUpload 
        initialCategory={level} 
        editingResource={editingResource}
        onCancelEdit={() => setEditingResource(null)}
        onEditSuccess={(id, updatedFields) => {
          const newEditedPosts = {
            ...editedPosts,
            [id]: updatedFields
          };
          setEditedPosts(newEditedPosts);
          localStorage.setItem('edited_post_data', JSON.stringify(newEditedPosts));
          setEditingResource(null);
        }}
      />

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
              <div className="hanji-texture absolute inset-0 opacity-10 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] text-[#8C6239] font-bold font-serif uppercase tracking-widest bg-[#8C6239]/5 px-2.5 py-0.5 rounded-sm border border-[#8C6239]/20 font-sans">
                      {activePhoto.category}
                    </span>
                    <h3 className="text-2xl font-bold font-serif text-[#1A1A1A] mt-2 leading-snug break-keep">
                      {activePhoto.title} ({activePhoto.eventDate})
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActivePhoto(null)}
                    className="p-1 px-1.5 border border-zinc-200 text-zinc-400 hover:text-zinc-600 rounded-sm hover:bg-stone-50 cursor-pointer"
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
                    <Calendar className="w-4 h-4 text-[#10B981]" />
                    <span className="font-bold text-zinc-800">행사자료일:</span>
                    <span>{activePhoto.eventDate}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Eye className="w-4 h-4 text-[#3C82F6]" />
                    <span className="font-bold text-zinc-800 font-serif">조회 수:</span>
                    <span>{(activePhoto.viewCount || 0) + 1}회</span>
                  </div>
                </div>

                {/* Description Text */}
                <div className="space-y-2 text-left">
                  <h4 className="text-xs font-bold text-[#8C6239] uppercase tracking-wider font-sans">활동 상세 소개</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed font-serif whitespace-pre-wrap py-2 border-t border-zinc-100">
                    {activePhoto.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
