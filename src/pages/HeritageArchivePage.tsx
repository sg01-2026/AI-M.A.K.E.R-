import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, Plus, Trash2, Edit, X, User, Clock, Calendar, Eye, Download, BookOpen, FileText } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import AdminUpload from '../components/AdminUpload';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

const cleanActivityTitle = (title: string) => {
  let clean = title.replace(/^\[[^\]]+\]\s*/, '');
  if (clean.includes(' - ')) {
    const parts = clean.split(' - ');
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
  author?: string;
}

const DEFAULT_HERITAGE_RESOURCES: Resource[] = [
  {
    id: 'seed-h1',
    title: '[E:표현] 오이도 패총 선사시대 생활상 3D 복원',
    type: 'image',
    fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800',
    description: '인공지능 3D 모델링 기법을 학습하고 오이도 패총의 신석기 시대 생활상을 모둠별로 기획하여 3D 가상 아카이브로 표현하였습니다. 움집의 내부 전경, 빗살무늬 토기의 쓰임새, 조개무지의 층위 구조를 학생들이 직접 설계하여 디지털 공간에 상호작용 가능한 형태로 이식했습니다. 이 과정을 통해 당시 사람들의 생활 도구와 조리 환경을 입체적으로 이해할 수 있었습니다.',
    displayDate: '2026.05.20',
    makerStage: 'E:표현',
    heritage: '오이도 패총',
    category: '문화유산',
    author: '3모둠 (선사 탐험대)'
  },
  {
    id: 'seed-h2',
    title: '[E:표현] 생금집 황금 닭의 사랑 음악극 (OST) 제작',
    type: 'image',
    fileUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    description: '생화 가옥인 생금집의 구전 전설을 바탕으로 AI 뮤직 생성 도구를 활용하여 가사를 작사하고 생금집의 따뜻한 사운드 트랙 음악극과 가상 MV를 완성하였습니다. 가사 속에는 짚풀 향기 가득한 마당, 정겨운 처마 밑의 풍경, 깃털을 나누어 준 황금 닭의 신비로운 마음이 학생들의 참신한 시선으로 투영되어 있습니다. 오케스트라 사운드와 합창이 조화를 이루는 창작곡입니다.',
    displayDate: '2026.05.15',
    makerStage: 'E:표현',
    heritage: '생금집',
    category: '문화유산',
    author: '생금멜로디 (5학년 2반)'
  },
  {
    id: 'seed-h3',
    title: '[K:이해] 호조벌 물길 지도 설계 및 미래 농업 상상하기',
    type: 'image',
    fileUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    description: '간척의 역사인 호조벌 주변 친환경 수로를 탐구하고 농작물에 가장 적합한 물길 지도를 제작하는 한편 미래형 스마트 팜의 형태를 설계하였습니다. 학생들은 친환경 수질 측정을 바탕으로 호조벌 생태계가 간직한 역사를 수조 모형으로 축조하고, 최첨단 수경 재배 인공지능 제어 장치의 개념을 흐름도(Flowchart) 형태로 조명하여 아카이브에 기고했습니다.',
    displayDate: '2026.05.10',
    makerStage: 'K:이해',
    heritage: '호조벌',
    category: '문화유산',
    author: '그린메이커 (6학년 1반)'
  },
  {
    id: 'seed-h4',
    title: '[E:표현] 관곡지 백련 향기 시 테라피 도서',
    type: 'image',
    fileUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=800',
    description: '조선 전기 문신 강희맹 선생이 명나라에서 들여온 연꽃 씨앗으로 조성된 관곡지 백련의 연혁과 연관된 일화를 시화집 형태로 풀어냈습니다. AI 이미지 보조 도구를 사용해 학생들이 지은 자작시의 분위기에 어울리는 단아한 한국식 수묵 묘사를 생성하여 본문에 도열하였습니다. 연화의 개화 과정과 군자의 성품을 서정적인 문장으로 찬미하고 있습니다.',
    displayDate: '2026.05.05',
    makerStage: 'E:표현',
    heritage: '관곡지',
    category: '문화유산',
    author: '홍길동 (5학년)'
  },
  {
    id: 'seed-h5',
    title: '[A:질문] 능곡 선사 유적지 신석기 주거 문화 질문 탐구',
    type: 'image',
    fileUrl: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?auto=format&fit=crop&q=80&w=800',
    description: '능곡동 움집 유적에서 당시 선조들이 사용하던 화석 흔적과 바닥 단면의 점토 공법에 대해 품었던 흥미로운 질문들을 정리하고 이를 고고학적 근거와 연동해 탐색했습니다. 솟대 신앙과 움집의 방위각 배치가 지닌 수수께끼를 해결하기 위해 학생들은 시흥 향토사학 전문가에게 보낸 이메일 질문과 세세한 답변 내용을 기록 카드로 등재했습니다.',
    displayDate: '2026.05.02',
    makerStage: 'A:질문',
    heritage: '능곡선사유적',
    category: '문화유산',
    author: '역사소년단 (6학년 3반)'
  },
  {
    id: 'seed-h6',
    title: '[R:연결] 군자봉 성황제 디지털 다큐멘터리 제작',
    type: 'image',
    fileUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800',
    description: '시흥 군자봉 성황제의 역사와 당제의 전통 전개 양상을 조망하는 동영상 시나리오와 스틸컷 다큐멘터리를 기고했습니다. 전래 과정 중 가가호호 성황 주를 모시던 민속 문화의 사회공헌적 성격을 재발견하고, 세대 간 정서적 통합과 마을 평화 수호를 외치는 주민들의 실제 소감을 결합하여 한 편의 흐름 있는 아날로그 스크랩북 게시글로 시각화했습니다.',
    displayDate: '2026.04.28',
    makerStage: 'R:연결',
    heritage: '군자봉 성황제',
    category: '문화유산',
    author: '미디어크루 (6학년)'
  }
];

export default function HeritageArchivePage() {
  const { user, isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedMakerStage, setSelectedMakerStage] = useState<string>('전체');
  
  const getNormalizedHeritage = (val: string | null): string => {
    if (!val) return '전체';
    const trimmed = val.trim();
    if (trimmed === '군자봉성황제' || trimmed === '군자봉 성황제') return '군자봉 성황제';
    if (trimmed === '능곡선사유적지' || trimmed === '능곡선사유적') return '능곡선사유적';
    if (trimmed === '오이도패총' || trimmed === '오이도 패총') return '오이도 패총';
    if (trimmed === '갯골염전' || trimmed === '갯골·염전' || trimmed === '갯골생태공원' || trimmed.includes('갯골')) return '갯골·염전';
    return trimmed;
  };

  const initialHeritage = getNormalizedHeritage(searchParams.get('heritage'));
  const [selectedHeritage, setSelectedHeritage] = useState<string>(initialHeritage);

  useEffect(() => {
    const param = searchParams.get('heritage');
    if (param) {
      setSelectedHeritage(getNormalizedHeritage(param));
    }
  }, [searchParams]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePhoto, setActivePhoto] = useState<Resource | null>(null);

  // States to persist deleted posts and edited edits locally for instant feedback
  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('deleted_heritage_post_ids');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [editedPosts, setEditedPosts] = useState<Record<string, Partial<Resource>>>(() => {
    try {
      const stored = localStorage.getItem('edited_heritage_post_data');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  // State to manage the editing modal inside the archive
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'resources'),
      where('category', '==', '문화유산'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];
      setResources(fetched);
    }, (error) => {
      console.warn("Real-time snapshot error or permission-denied. Using local additions:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (e: React.MouseEvent, res: Resource) => {
    e.stopPropagation();
    if (!window.confirm("정말 이 활동을 삭제하시겠습니까?")) {
      return;
    }

    try {
      if (!res.id) {
        alert("유효한 아카이브 ID를 찾을 수 없습니다.");
        return;
      }

      // Add to deletedIds local list so it disappears instantly
      const updatedDeleted = [...deletedIds, res.id];
      setDeletedIds(updatedDeleted);
      localStorage.setItem('deleted_heritage_post_ids', JSON.stringify(updatedDeleted));

      // Delete Firebase Storage associated file if exists
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
        await deleteDoc(doc(db, 'resources', res.id));
      }

      alert("성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleOpenEditModal = (e: React.MouseEvent, res: Resource) => {
    e.stopPropagation();
    setEditingResource(res);
  };

  // Combine database resources and default fallback seed materials
  const combinedAllResources = [
    ...resources,
    ...DEFAULT_HERITAGE_RESOURCES.filter(ds => !resources.some(dbRes => dbRes.title.includes(ds.title) || dbRes.description.includes(ds.description.substring(0, 10))))
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

  // Filter out deleted items
  const activeResources = finalResources.filter(res => !deletedIds.includes(res.id));

  // Sort them dynamically by default
  const sortedCombinedResources = [...activeResources].sort((a, b) => {
    const getMs = (item: any) => {
      if (item.createdAt?.seconds) return item.createdAt.seconds * 1000;
      if (item.createdAt instanceof Date) return item.createdAt.getTime();
      return 0;
    };
    return getMs(b) - getMs(a);
  });

  const checkHeritageMatch = (itemHeritage: string | undefined, selected: string) => {
    if (!itemHeritage) return false;
    const clean = (s: string) => s.replace(/\s+/g, '').replace('지', '');
    return clean(itemHeritage).includes(clean(selected)) || clean(selected).includes(clean(itemHeritage));
  };

  // Filter the unified resources array exactly like design logic
  const filteredResources = sortedCombinedResources.filter(res => {
    // 1. Maker Stage Filter
    const stageMatch = 
      selectedMakerStage === '전체' ||
      res.makerStage === selectedMakerStage ||
      res.title.includes(`[${selectedMakerStage}]`) ||
      (selectedMakerStage && res.title.startsWith(`[${selectedMakerStage.split(':')[0]}`)) ||
      res.title.includes(selectedMakerStage.split(':')[0]) ||
      (selectedMakerStage.includes(':') && res.title.includes(selectedMakerStage.split(':')[1]));

    // 2. Heritage Filter with smart matching
    let hSelected = selectedHeritage;
    if (selectedHeritage === '능곡선사유적') hSelected = '능곡선사유적지';
    if (selectedHeritage === '군자봉 성황제') hSelected = '군자봉성황제';

    const heritageMatch = 
      selectedHeritage === '전체' ||
      res.heritage === selectedHeritage ||
      res.heritage === hSelected ||
      (res.heritage && checkHeritageMatch(res.heritage, selectedHeritage)) ||
      res.title.includes(selectedHeritage) ||
      res.title.includes(hSelected) ||
      (selectedHeritage === '기타' && !['능곡선사유적', '능곡선사유적지', '오이도 패총', '생금집', '군자봉 성황제', '군자봉성황제', '호조벌', '갯골·염전', '관곡지'].some(h => 
        res.title.includes(h) || res.heritage === h || checkHeritageMatch(res.heritage, h)
      ));

    // 3. Search Query Filter mapping multiple fields
    const queryStr = searchQuery.toLowerCase().trim();
    const searchMatch = 
      queryStr === '' ||
      res.title.toLowerCase().includes(queryStr) ||
      (res.description && res.description.toLowerCase().includes(queryStr)) ||
      (res.heritage && res.heritage.toLowerCase().includes(queryStr)) ||
      (res.author && res.author.toLowerCase().includes(queryStr)) ||
      (res.makerStage && res.makerStage.toLowerCase().includes(queryStr));

    return stageMatch && heritageMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-hanji-50 pb-20 font-serif">
      {/* Hero Section Banner */}
      <section className="relative py-24 bg-ink-900 text-hanji-100 overflow-hidden">
        <div className="hanji-texture absolute inset-0 opacity-10" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-gold-500/10 rounded-full border border-gold-500/20"
            >
              <BookOpen className="w-12 h-12 text-gold-500" />
            </motion.div>
            <div className="space-y-2">
              <span className="text-gold-500 font-serif tracking-[0.3em] text-[10px] uppercase font-bold">Student Archive</span>
              <h1 className="text-4xl md:text-5xl font-serif">지역문화유산 탐구 아카이브</h1>
            </div>
            <p className="text-hanji-200/60 font-serif max-w-2xl mx-auto leading-relaxed italic text-sm md:text-base">
              "시흥의 역사적 맥락과 가치를 발견하고, 창의적인 아이디어와 인공지능 기술로 기록한 학생들의 배움 결과물입니다."
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Board Search with Filter Header */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-ink-900/10 pb-8">
            <div className="space-y-3 text-left">
              <h3 className="text-3xl font-serif text-ink-900">지역문화유산 학생 아카이브</h3>
              <p className="text-ink-800/50 font-serif text-sm">
                만남(M), 질문(A), 이해(K), 표현(E), 연결(R)의 여정 속에서 탄생한 시흥 문화유산 포트폴리오를 둘러보세요.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-3">
              <div className="relative md:w-80 shadow-xs flex-1">
                <input 
                  type="text" 
                  placeholder="검색어 (제목, 문화유산, 학생이름, 내용)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3.5 bg-white border border-ink-900/10 focus:border-gold-500/40 outline-none font-sans text-sm transition-all text-ink-900 placeholder-zinc-400"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/40" />
              </div>

              {isAdmin && (
                <button
                  onClick={() => {
                    const btn = document.querySelector('.fixed.bottom-8.right-8 button') as HTMLButtonElement;
                    if (btn) {
                      btn.click();
                    } else {
                      const uploadTrigger = document.querySelector('[class*="fixed bottom-"]') as HTMLElement;
                      if (uploadTrigger) uploadTrigger.click();
                    }
                  }}
                  className="px-5 py-3.5 bg-gold-500 hover:bg-gold-600 active:scale-[0.98] text-ink-900 font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center justify-center space-x-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>활동 아카이브 등록</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Dual Filters Bar - Matched with exact user specification style */}
          <div className="bg-white border border-gold-500/10 p-6 space-y-5 shadow-xs text-left">
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

            {/* Cultural Heritage Selectors (Exact User Specified Order) */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 pt-4 border-t border-gold-500/10">
              <span className="text-xs font-bold text-ink-800/60 uppercase tracking-widest min-w-[120px] font-sans">
                문화유산 분류
              </span>
              <div className="flex flex-wrap gap-2">
                {['전체', '능곡선사유적', '오이도 패총', '생금집', '군자봉 성황제', '호조벌', '갯골·염전', '관곡지', '기타'].map(heritage => {
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

          {/* Main Grid Card Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredResources.length > 0 ? (
              filteredResources.map((res, index) => {
                const imageUrl = res.fileUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800';
                const stage = res.makerStage || (res.title.match(/^\[(.*?)\]/) ? res.title.match(/^\[(.*?)\]/)![1] : 'E:표현');
                const heritageItem = res.heritage || ['능곡선사유적', '오이도 패총', '생금집', '군자봉 성황제', '호조벌', '갯골·염전', '관곡지'].find(h => res.title.includes(h)) || '기타';
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
                    onClick={() => setActivePhoto(res)}
                  >
                    {/* Representative Image or Uploaded Result Image */}
                    <div className="relative aspect-[16/10] bg-stone-50 overflow-hidden">
                      <img 
                        src={imageUrl} 
                        alt={cleanTitle}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      {/* Badge Row Overlay */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 font-sans">
                        <span className="bg-ink-900/80 backdrop-blur-md text-gold-500 text-[9px] font-bold px-2 py-0.5 rounded-sm border border-gold-500/20">
                          {stage}
                        </span>
                        <span className="bg-gold-500/90 backdrop-blur-md text-ink-900 text-[9px] font-bold px-2 py-0.5 rounded-sm">
                          {heritageItem}
                        </span>
                      </div>

                      {/* Admin Controls on Image Card */}
                      {isAdmin && (
                        <div 
                          className="absolute top-3 right-3 flex items-center space-x-1.5 z-30 pointer-events-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleOpenEditModal(e, res);
                            }}
                            className="p-1.5 bg-white hover:bg-zinc-100 text-[#8C6239] rounded-full shadow-md hover:scale-105 active:scale-[95] transition-all cursor-pointer pointer-events-auto relative z-30 flex items-center justify-center border border-zinc-200/50"
                            title="수정"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleDelete(e, res);
                            }}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white hover:text-white rounded-full shadow-md hover:scale-105 active:scale-[95] transition-all cursor-pointer pointer-events-auto relative z-30 flex items-center justify-center border border-red-700/20"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Meta/Text Info Grid Area */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2 text-left">
                        <h4 className="text-[15px] font-bold text-ink-900 group-hover:text-gold-600 font-serif transition-colors leading-snug break-keep line-clamp-2">
                          {cleanTitle}
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-sans line-clamp-2 break-all text-left">
                          {res.description}
                        </p>
                      </div>

                      {/* Info Row block */}
                      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-[11px] font-sans text-zinc-400 select-none">
                        <div className="flex items-center text-zinc-600 text-left font-semibold">
                          <User className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
                          <span>{res.author || 'M.A.K.E.R단'}</span>
                        </div>
                        <div className="flex items-center text-zinc-400 text-right">
                          <Clock className="w-3.5 h-3.5 text-zinc-300 mr-1" />
                          <span>{displayDateString}</span>
                        </div>
                      </div>

                      {/* Custom "자세히 보기" Button styled properly */}
                      <div className="pt-2">
                        <span className="w-full inline-flex items-center justify-center py-2 bg-hanji-100 hover:bg-gold-500/10 text-ink-900 border border-gold-500/20 text-xs font-medium font-serif rounded-xs transition-all duration-200">
                          자세히 보기
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-24 text-center text-zinc-400 font-sans border-2 border-dashed border-zinc-100 rounded-sm">
                <p>조건에 부합하는 학생 활동 아카이브 자료가 발견되지 않았습니다.</p>
                <p className="text-xs text-zinc-400/70 mt-1">다른 탐색 키워드를 입력해보세요.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pop-up Card Detailed Modal exactly matching requirements */}
      <AnimatePresence>
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setActivePhoto(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-hanji-50 border border-gold-500/20 rounded-sm p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="hanji-texture absolute inset-0 opacity-10 pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Header Information block */}
                <div className="flex justify-between items-start gap-4 pb-4 border-b border-zinc-200">
                  <div className="space-y-1.5 text-left">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[9px] text-[#8C6239] font-bold font-sans uppercase tracking-widest bg-[#8C6239]/5 px-2.5 py-0.5 rounded-sm border border-[#8C6239]/20">
                        {activePhoto.makerStage || 'E:표현'}
                      </span>
                      <span className="text-[9px] text-ink-900 font-bold font-sans uppercase tracking-widest bg-gold-500/10 px-2.5 py-0.5 rounded-sm border border-gold-500/20">
                        {activePhoto.heritage || '기타'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold font-serif text-[#1A1A1A] mt-2 leading-snug break-keep">
                      {cleanActivityTitle(activePhoto.title)}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActivePhoto(null)}
                    className="p-1 px-1.5 border border-zinc-200 text-zinc-400 hover:text-zinc-600 rounded-sm hover:bg-stone-50 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Image View */}
                <div className="aspect-[16/10] bg-black rounded-xs overflow-hidden shadow-inner relative border border-gold-500/10">
                  <img 
                    src={activePhoto.fileUrl} 
                    alt={activePhoto.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Detailed metadata list block */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 px-4 bg-white border border-gold-500/10 rounded-sm text-xs text-zinc-600 font-sans text-left">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="font-bold text-zinc-800">학생/모둠 이름</p>
                      <p className="text-zinc-500">{activePhoto.author || 'M.A.K.E.R단'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 border-t sm:border-t-0 sm:border-l border-zinc-100 pt-2 sm:pt-0 sm:pl-4">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <div>
                      <p className="font-bold text-zinc-800">등록일</p>
                      <p className="text-zinc-500">
                        {activePhoto.displayDate 
                          ? activePhoto.displayDate.replace(/-/g, '.')
                          : '2026.05.31'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 border-t sm:border-t-0 sm:border-l border-zinc-100 pt-2 sm:pt-0 sm:pl-4">
                    <Eye className="w-4 h-4 text-[#8C6239]" />
                    <div>
                      <p className="font-bold text-zinc-800">이동 링크 / 종류</p>
                      <p className="text-zinc-500 truncate">{activePhoto.type === 'pdf' ? 'PDF 연동자료' : '이미지 아카이빙'}</p>
                    </div>
                  </div>
                </div>

                {/* Subsections: Description, Process, Attachments */}
                <div className="space-y-4 text-left font-serif">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-[#8C6239] uppercase tracking-wider font-sans">활동 상세 소개</h4>
                    <p className="text-sm text-zinc-700 leading-relaxed font-serif whitespace-pre-wrap py-2 border-t border-zinc-100">
                      {activePhoto.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <h4 className="text-xs font-bold text-[#8C6239] uppercase tracking-wider font-sans">M.A.K.E.R 탐구 학습 과정</h4>
                    <div className="p-4 bg-zinc-50 border border-zinc-100 text-xs text-zinc-600 rounded-sm font-sans space-y-2">
                      <p className="font-bold text-zinc-800">▶ 활동 구분: {[activePhoto.makerStage || '탐구 표현'].join(' ')} 단계</p>
                      <p className="leading-relaxed">
                        본 활동은 학생들이 시흥 {activePhoto.heritage || '문화유산'}의 가치를 규명하는 과정에서 인공지능 기반 디지털 자극제를 입수하고, 가설 검증과 협력적 소통을 통해 산출물을 설계 및 제작하기 위해 기획된 탐구 수업의 결과물입니다.
                      </p>
                    </div>
                  </div>

                  {/* Attachment button if available (PDF or download file URL) */}
                  {activePhoto.fileUrl && (
                    <div className="pt-2 flex justify-start">
                      <a 
                        href={activePhoto.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-[#8C6239] hover:bg-[#6D4926] text-white text-xs font-bold font-sans rounded-xs transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>첨부 자료 및 고화질 원본 다운로드</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invisible Floating Admin Upload helper - matches layout style perfectly */}
      <AdminUpload 
        initialCategory="문화유산" 
        editingResource={editingResource}
        onCancelEdit={() => setEditingResource(null)}
        onUploadSuccess={() => {}}
        onEditSuccess={(id, updatedFields) => {
          const newEditedPosts = {
            ...editedPosts,
            [id]: updatedFields
          };
          setEditedPosts(newEditedPosts);
          localStorage.setItem('edited_heritage_post_data', JSON.stringify(newEditedPosts));
          setEditingResource(null);
        }}
      />
    </div>
  );
}
