import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, Code, Rocket, ChevronRight, PenTool, Sparkles, Image as ImageIcon, FileText, ExternalLink } from 'lucide-react';
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
}

const clubLevels = {
  '기본1 (기초)': {
    title: '학생동아리 - 기본1 (기초)',
    level: 'Beginner',
    desc: 'AI 프로젝트의 기초를 다지고 문화유산과 처음 만나는 단계입니다.',
    topics: ['생성형 AI의 기본 이해', '시흥 문화유산 탐색하기', '간단한 AI 프롬프트 작성법', '문화유산 굿즈 기획'],
    icon: <PenTool className="w-12 h-12 text-gold-500" />
  },
  '기본2 (중급)': {
    title: '학생동아리 - 기본2 (중급)',
    level: 'Intermediate',
    desc: 'AI 도구를 활용해 시흥의 이야기를 창의적으로 재구성하는 단계입니다.',
    topics: ['이미지 생성 AI 심화 활용', '지역 스토리텔링 동화 제작', '디지털 드로잉과 AI 협업', '인터랙티브 콘텐츠 기초'],
    icon: <Code className="w-12 h-12 text-gold-500" />
  },
  '기본3 (심화)': {
    title: '학생동아리 - 기본3 (심화)',
    level: 'Advanced',
    desc: '복합적인 AI 기술을 통해 고도화된 지역 문화 아카이브를 제작하는 단계입니다.',
    topics: ['AI 뮤직비디오 및 OST 제작', '3D 가상 유적지 복원 프로젝트', '웹툰 및 인터랙션 디자인', '지역 사회 공유 및 전시'],
    icon: <Rocket className="w-12 h-12 text-gold-500" />
  }
};

export default function ClubsPage() {
  const { level } = useParams<{ level: string }>();
  const [resources, setResources] = useState<Resource[]>([]);
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

  return (
    <div className="min-h-screen bg-hanji-50 pb-20">
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
              <span className="text-gold-500 font-serif tracking-[0.3em] text-xs uppercase">{currentLevel.level} Course</span>
              <h1 className="text-4xl md:text-5xl font-serif">{currentLevel.title}</h1>
            </div>
            <p className="text-hanji-200/60 font-serif max-w-2xl mx-auto leading-relaxed italic">
              "{currentLevel.desc}"
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h2 className="text-2xl font-serif text-ink-900 border-b border-gold-500/20 pb-4">핵심 학습 주제</h2>
            <div className="space-y-3">
              {currentLevel.topics.map((topic, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center space-x-4 p-5 bg-white border border-gold-500/5 hover:border-gold-500/20 transition-all font-serif"
                >
                  <Sparkles className="w-4 h-4 text-gold-500" />
                  <span className="text-ink-800">{topic}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 border border-gold-500/10 space-y-8 flex flex-col justify-center">
             <div className="space-y-4">
                <h3 className="text-xl font-serif text-gold-600">학생 활동 아카이브</h3>
                <p className="text-sm text-ink-800/60 leading-relaxed font-serif">
                   학생들이 직접 참여하고 기록한 활동 사진과 소감문이 이곳에 누적됩니다.
                </p>
             </div>
             
             <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {resources.length > 0 ? (
                  resources.map(res => (
                    <a 
                      key={res.id}
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-hanji-100 border border-gold-500/10 hover:border-gold-500/40 transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        {res.type === 'image' ? <ImageIcon className="w-4 h-4 text-gold-600" /> : <FileText className="w-4 h-4 text-gold-600" />}
                        <span className="text-sm font-serif text-ink-900">{res.title}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-ink-800/20 group-hover:text-gold-600" />
                    </a>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gold-500/10 text-ink-800/40 font-serif italic text-sm">
                    아직 등록된 활동 자료가 없습니다.
                  </div>
                )}
             </div>

             <button className="w-full py-4 bg-ink-900 text-gold-500 font-serif text-sm flex items-center justify-center space-x-2 hover:bg-ink-800 transition-colors">
                <span>우수 활동 사례 보기</span>
                <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="mt-20 p-12 bg-gold-500/5 border border-gold-500/10 text-center space-y-6">
           <h3 className="text-2xl font-serif text-ink-900">다른 단계의 동아리 살펴보기</h3>
           <div className="flex flex-wrap justify-center gap-4">
              {['기본1 (기초)', '기본2 (중급)', '기본3 (심화)'].filter(lvl => lvl !== level).map(lvl => (
                <Link 
                  key={lvl}
                  to={`/clubs/${lvl}`}
                  className="px-6 py-2 bg-white border border-gold-500/20 text-ink-800 font-serif hover:border-gold-500 transition-all"
                >
                  {lvl}
                </Link>
              ))}
           </div>
        </div>
      </section>

      <AdminUpload initialCategory={level} />
    </div>
  );
}
