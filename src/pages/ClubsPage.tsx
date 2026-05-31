import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, PenTool, Sparkles, Image as ImageIcon, FileText, Code, Rocket, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import AdminUpload from '../components/AdminUpload';

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
}

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
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedMakerStage, setSelectedMakerStage] = useState<string>('전체');
  const [selectedHeritage, setSelectedHeritage] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
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

  const filteredResources = resources.filter(res => {
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
        <div className="space-y-12">
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
             
             <div className="flex w-full md:w-auto items-stretch shadow-sm">
                <div className="flex-1 md:w-80 relative">
                  <input 
                    type="text" 
                    placeholder="검색어를 입력하세요."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-12 py-3.5 bg-white border border-ink-900/10 focus:border-gold-500/40 outline-none font-serif text-sm transition-all text-ink-900"
                  />
                  <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/40" />
                </div>
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

          <div className="bg-white border border-ink-900/5 overflow-hidden shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-ink-900/[0.03] border-b border-ink-900/10">
                  <th className="px-6 py-5 text-center font-serif text-xs uppercase tracking-widest font-bold text-ink-900/40 w-24">번호</th>
                  <th className="px-6 py-5 text-left font-serif text-xs uppercase tracking-widest font-bold text-ink-900/40">제목</th>
                  <th className="px-6 py-5 text-center font-serif text-xs uppercase tracking-widest font-bold text-ink-900/40 w-32">등록일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5">
                 {filteredResources.length > 0 ? (
                   filteredResources.map((res, idx) => (
                     <tr key={res.id} className="hover:bg-gold-500/[0.01] transition-colors group cursor-pointer">
                       <td className="px-6 py-5 text-center font-serif text-sm text-ink-800/20">
                         {filteredResources.length - idx}
                       </td>
                       <td className="px-6 py-5">
                         <a 
                           href={res.fileUrl}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center space-x-3 group-hover:text-gold-600 transition-colors"
                         >
                           {res.type === 'image' ? <ImageIcon className="w-4 h-4 text-gold-500/20" /> : <FileText className="w-4 h-4 text-gold-500/20" />}
                           <span className="font-serif text-sm text-ink-900 group-hover:underline underline-offset-4 decoration-gold-500/30 line-clamp-1">{res.title}</span>
                         </a>
                       </td>
                       <td className="px-6 py-5 text-center font-serif text-sm text-ink-800/20">
                         {res.displayDate 
                           ? res.displayDate.replace(/-/g, '.')
                           : (res.createdAt 
                               ? new Date(res.createdAt.seconds * 1000).toLocaleDateString('ko-KR').replace(/ /g, '').slice(0, -1)
                               : '2024.05.18'
                             )
                         }
                       </td>
                     </tr>
                   ))
                 ) : (
                   <tr>
                     <td colSpan={3} className="px-6 py-24 text-center text-ink-800/20 font-serif italic text-sm">
                       작성된 게시글이 없습니다.
                     </td>
                   </tr>
                 )}
              </tbody>
            </table>
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

      <AdminUpload initialCategory={level} />
    </div>
  );
}
