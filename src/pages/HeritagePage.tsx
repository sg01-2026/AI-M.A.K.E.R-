import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { heritageData } from '../data/heritage';
import {
  MapPin,
  MessageSquare,
  BookOpen,
  PenTool,
  Share2,
  ChevronRight,
  Image as ImageIcon,
  FileText,
  Play,
  ExternalLink,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import AdminUpload from '../components/AdminUpload';

// ✅ 생금집 한옥 이미지 import
// 실제 파일 위치: src/assets/images/M.png
import saenggeumHouseImage from '../assets/images/M.png';

interface Resource {
  id: string;
  title: string;
  type: 'image' | 'pdf';
  fileUrl: string;
  description: string;
}

const tabs = [
  { id: 'meet', label: 'Meet', desc: '문화유산 만나기', icon: <MapPin className="w-4 h-4" /> },
  { id: 'ask', label: 'Ask', desc: '질문하고 탐구하기', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'know', label: 'Know', desc: '역사와 의미 이해하기', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'express', label: 'Express', desc: '학년별 프로젝트 표현', icon: <PenTool className="w-4 h-4" /> },
  { id: 'relate', label: 'Relate', desc: '현재와 미래 연결하기', icon: <Share2 className="w-4 h-4" /> },
];

export default function HeritagePage() {
  const { name } = useParams<{ name: string }>();
  const [activeTab, setActiveTab] = useState('meet');
  const [resources, setResources] = useState<Resource[]>([]);

  const data = heritageData[name || ''] || heritageData['생금집'];

  // ✅ 생금집 페이지에서는 실제 M.png 사용
  // 다른 문화유산 페이지는 기존 picsum 임시 이미지 유지
  const heroImageSrc =
    data.name === '생금집'
      ? saenggeumHouseImage
      : `https://picsum.photos/seed/${data.id}/1920/1080`;

  useEffect(() => {
    if (!data.name) return;

    const q = query(
      collection(db, 'resources'),
      where('category', '==', data.name),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Resource[];

      setResources(fetched);
    });

    return () => unsubscribe();
  }, [data.name]);

  return (
    <div className="min-h-screen bg-hanji-50 pb-20">
      {/* Hero Header */}
      <section className="relative h-[45vh] flex items-end">
        <div className="absolute inset-0 bg-ink-900 overflow-hidden">
          <img
            src={heroImageSrc}
            alt={`${data.name} 한옥 전경`}
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-hanji-50 via-transparent to-transparent" />
        </div>

        {/* Category Navigation (Siblings) */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-ink-900/40 backdrop-blur-sm border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center space-x-8 h-10">
              {Object.keys(heritageData).map((hName) => (
                <Link
                  key={hName}
                  to={`/project/${hName}`}
                  className={`text-[10px] font-serif uppercase tracking-widest whitespace-nowrap transition-colors ${
                    hName === data.name
                      ? 'text-gold-500 font-bold'
                      : 'text-white/40 hover:text-white'
                  }`}
                >
                  {hName}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full pb-12 space-y-4">
          <Link
            to="/"
            className="text-gold-600 flex items-center space-x-1 text-xs font-serif hover:translate-x-[-4px] transition-transform opacity-60"
          >
            <span>← 시흥문화유산 HOME</span>
          </Link>

          <h1 className="text-5xl md:text-7xl font-serif text-ink-900 tracking-tight">
            {data.name}
          </h1>

          <div className="flex items-center space-x-4 text-ink-800/60 font-serif">
            <MapPin className="w-4 h-4 text-gold-600" />
            <span>{data.meet.location}</span>
          </div>
        </div>
      </section>

      {/* M.A.K.E.R Navigation */}
      <section className="sticky top-[112px] z-30 bg-hanji-100/80 backdrop-blur-md border-y border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-8 py-5 flex items-center space-x-2 border-b-2 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-gold-500 text-gold-600'
                    : 'border-transparent text-ink-800/40 hover:text-ink-800'
                }`}
              >
                <span className="font-serif text-xs uppercase tracking-widest">{tab.label}</span>
                <span className="hidden md:block font-serif text-sm">{tab.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-7xl mx-auto px-4 py-20 min-h-[60vh]">
        {activeTab === 'meet' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16"
          >
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-3xl font-serif text-ink-900 pb-2 border-b border-gold-500/20">
                  문화유산 만나기
                </h2>

                <p className="text-lg text-ink-800/70 font-serif leading-relaxed italic border-l-4 border-gold-500/30 pl-6">
                  "{data.meet.intro}"
                </p>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-serif text-gold-600 flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>옛 사진과 기록</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {data.meet.records.map((r, i) => (
                    <div
                      key={i}
                      className="aspect-video bg-white overflow-hidden border border-gold-500/10 group cursor-pointer"
                    >
                      <img
                        src={`https://picsum.photos/seed/${data.id}-${i}/400/300`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        alt="record"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-2 text-[10px] uppercase font-serif text-ink-800/50">
                        {r}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-xl font-serif text-gold-600 flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>지역 이야기 살펴보기</span>
                </h3>

                <div className="space-y-4">
                  {data.meet.stories.map((s, i) => (
                    <div
                      key={i}
                      className="p-6 bg-white border border-gold-500/5 hover:border-gold-500/20 transition-all font-serif"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Resources from Admin */}
              {resources.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-serif text-gold-600 flex items-center space-x-2">
                    <Share2 className="w-5 h-5" />
                    <span>추가 학습 아카이브</span>
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {resources.map((res) => (
                      <a
                        key={res.id}
                        href={res.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-6 bg-white border border-gold-500/10 hover:border-gold-500/40 transition-all group"
                      >
                        <div className="flex items-center space-x-4">
                          {res.type === 'image' ? (
                            <ImageIcon className="w-5 h-5 text-gold-600" />
                          ) : (
                            <FileText className="w-5 h-5 text-gold-600" />
                          )}

                          <div>
                            <h4 className="font-serif text-ink-900">{res.title}</h4>
                            <p className="text-xs text-ink-800/40">
                              {res.type === 'image' ? '이미지 파일' : 'PDF 문서'}
                            </p>
                          </div>
                        </div>

                        <ExternalLink className="w-4 h-4 text-ink-800/20 group-hover:text-gold-600 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'ask' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: '중요성', val: data.ask.importance },
                { label: '인물', val: data.ask.people },
                { label: '연결', val: data.ask.connections },
              ].map((item, i) => (
                <div key={i} className="p-10 bg-white border border-gold-500/10 space-y-4 font-serif">
                  <div className="text-xs text-gold-600/50 uppercase tracking-widest">
                    {item.label}
                  </div>
                  <p className="text-lg text-ink-900 leading-relaxed">{item.val}</p>
                </div>
              ))}
            </div>

            <div className="space-y-8 max-w-2xl mx-auto">
              <h2 className="text-3xl font-serif text-center text-ink-900">
                학생들의 열린 질문
              </h2>

              <div className="space-y-4">
                {data.ask.studentQuestions.map((q, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-4 p-6 bg-gold-500/5 rounded-full px-12 border border-gold-500/10"
                  >
                    <MessageSquare className="w-5 h-5 text-gold-600 mt-1 flex-shrink-0" />
                    <span className="text-lg font-serif italic text-ink-900">"{q}"</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'know' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-16"
          >
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-xl font-serif text-gold-600">지역N문화 자료 탐색</h3>

                <div className="space-y-2">
                  {data.know.resources.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-white border-b border-gold-500/10"
                    >
                      <span className="font-serif">{r}</span>
                      <ChevronRight className="w-4 h-4 opacity-30" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-serif text-gold-600">공공기관 자료 조사</h3>

                <div className="space-y-2">
                  {data.know.publicData.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-white border-b border-gold-500/10"
                    >
                      <span className="font-serif">{d}</span>
                      <FileText className="w-4 h-4 opacity-30" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="p-12 bg-ink-900 text-hanji-200 font-serif space-y-8">
                <div className="space-y-4">
                  <h4 className="text-gold-500 uppercase tracking-widest text-xs">Lifestyle</h4>
                  <h3 className="text-2xl">{data.know.lifestyle}</h3>
                </div>

                <div className="space-y-4">
                  <h4 className="text-gold-500 uppercase tracking-widest text-xs">Changes</h4>
                  <h3 className="text-2xl">{data.know.changes}</h3>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'express' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-serif text-ink-900">학년별 프로젝트 창작물</h2>
              <p className="text-ink-800/60 font-serif">
                학생들이 AI와 함께 표현한 {data.name}의 새로운 이야기들입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((grade) => (
                <div
                  key={grade}
                  className="flex flex-col bg-white border border-gold-500/10 overflow-hidden group hover:border-gold-500/40 transition-all"
                >
                  <div className="p-4 border-b border-gold-500/10 flex justify-between items-center bg-hanji-50">
                    <span className="text-xs font-serif uppercase tracking-widest text-gold-600 font-bold">
                      {grade}학년
                    </span>
                    <PenTool className="w-3 h-3 text-gold-600 opacity-50" />
                  </div>

                  <div className="aspect-[4/3] bg-hanji-100 overflow-hidden relative">
                    <img
                      src={`https://picsum.photos/seed/${data.id}-grade-${grade}/600/450`}
                      className="w-full h-full object-cover opacity-80"
                      alt="work"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-ink-900/10 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full border border-gold-500/20">
                      <Play className="w-4 h-4 text-gold-600 fill-gold-600" />
                    </div>
                  </div>

                  <div className="p-8 space-y-4">
                    <h3 className="text-xl font-serif text-ink-900 group-hover:text-gold-600 transition-colors">
                      {data.express[grade as keyof typeof data.express]}
                    </h3>

                    <button className="text-xs font-serif text-ink-800/40 uppercase tracking-widest hover:text-gold-600 transition-colors flex items-center space-x-1">
                      <span>작품 자세히 보기</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'relate' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="p-12 border-2 border-gold-500/20 bg-white font-serif space-y-6">
                <h3 className="text-2xl text-gold-600">우리 동네 이야기 나누기</h3>
                <p className="text-ink-800/70 leading-relaxed">
                  마을 주민들과 학생들이 함께 나누는 {data.name}의 추억과 미래.
                </p>
                <button className="px-6 py-3 bg-gold-500 text-ink-900 text-sm hover:bg-gold-600 transition-colors">
                  참여 기록 보기
                </button>
              </div>

              <div className="p-12 border-2 border-gold-500/20 bg-white font-serif space-y-6">
                <h3 className="text-2xl text-gold-600">미래 시흥 이야기 이어가기</h3>
                <p className="text-ink-800/70 leading-relaxed">
                  100년 후의 {data.name}은 어떤 모습일까? AI가 그린 미래 청사진.
                </p>
                <button className="px-6 py-3 bg-ink-900 text-hanji-100 text-sm hover:bg-ink-800 transition-colors">
                  미래 아카이브
                </button>
              </div>
            </div>

            <div className="py-20 text-center">
              <div className="inline-block p-1 bg-gold-500/20 rounded-full mb-8">
                <div className="bg-white px-8 py-2 rounded-full text-xs font-serif text-gold-600 tracking-widest uppercase font-bold">
                  Connected World
                </div>
              </div>

              <h2 className="text-4xl font-serif text-ink-900 mb-8">
                역사의 이야기는{' '}
                <span className="italic underline decoration-gold-500/40">지금</span> 시작됩니다.
              </h2>

              <Link
                to="/"
                className="text-ink-800/40 hover:text-gold-600 font-serif border-b border-dotted border-ink-800/20 pb-1 italic transition-all"
              >
                시흥문화유산 M.A.K.E.R 가기
              </Link>
            </div>
          </motion.div>
        )}
      </section>

      <AdminUpload initialCategory={data.name} />
    </div>
  );
}
