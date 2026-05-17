import { motion } from 'motion/react';
import { Lightbulb, Code, Book, Sparkles, MessageSquare, Image as ImageIcon, FileText, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import AdminUpload from '../components/AdminUpload';

interface Resource {
  id: string;
  title: string;
  type: 'image' | 'pdf';
  fileUrl: string;
}

const promptExamples = [
  {
    target: '생금집 동화 생성',
    prompt: '시흥 죽율동의 전통가옥 생금집과 황금 닭의 전설을 배경으로, 현대의 어린이가 타임슬립하여 과거의 김씨 가문 아이들과 어울려 노는 따뜻한 분위기의 동화 스토리를 구성해줘.',
    app: 'Gemini / ChatGPT'
  },
  {
    target: '관곡지 이미지 생성',
    prompt: '조선 시대 선비 강희맹이 인도에서 가져온 전당홍 연꽃을 심었을 때의 관곡지 풍경을 수묵담채화 스타일로 그려줘. 은은한 새벽 안개와 연꽃 향기가 느껴지는 분위기.',
    app: 'DALL-E / Midjourney'
  },
  {
    target: '오이도 패총 OST 가사',
    prompt: '서해안 오이도의 파도 소리와 선사 시대 사람들의 삶을 주제로 한 서정적인 어쿠스틱 발라드 가사를 써줘. "시간의 켜"라는 키워드를 후렴구에 넣어줘.',
    app: 'Suno / Udio'
  }
];

export default function ResourcesPage() {
  const [guideResources, setGuideResources] = useState<Resource[]>([]);
  const [promptResources, setPromptResources] = useState<Resource[]>([]);
  const [lessonResources, setLessonResources] = useState<Resource[]>([]);
  const [activityResources, setActivityResources] = useState<Resource[]>([]);
  const [projectResources, setProjectResources] = useState<Resource[]>([]);

  useEffect(() => {
    const setupCategory = (category: string, setter: (res: Resource[]) => void) => {
      const q = query(
        collection(db, 'resources'),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      return onSnapshot(q, (snap) => {
        setter(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Resource[]);
      });
    };

    const unsubGuide = setupCategory('AI 활용 가이드', setGuideResources);
    const unsubPrompt = setupCategory('프롬프트 예시', setPromptResources);
    const unsubLesson = setupCategory('수업 지도안', setLessonResources);
    const unsubActivity = setupCategory('활동지', setActivityResources);
    const unsubProjectRes = setupCategory('프로젝트 활동 자료', setProjectResources);

    return () => {
      unsubGuide();
      unsubPrompt();
      unsubLesson();
      unsubActivity();
      unsubProjectRes();
    };
  }, []);

  const renderResourceList = (title: string, resources: Resource[], id?: string) => {
    if (resources.length === 0) return null;
    return (
      <div id={id} className="space-y-4 scroll-mt-24">
        <h3 className="text-lg font-serif text-ink-900 border-b border-gold-500/10 pb-2">{title}</h3>
        <div className="grid grid-cols-1 gap-3">
          {resources.map(res => (
            <a 
              key={res.id}
              href={res.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-hanji-100/50 border border-gold-500/10 hover:border-gold-500/40 transition-all rounded-sm group"
            >
              <div className="flex items-center space-x-3">
                {res.type === 'image' ? (
                  <ImageIcon className="w-4 h-4 text-gold-600" />
                ) : (
                  <FileText className="w-4 h-4 text-gold-600" />
                )}
                <span className="text-sm font-serif text-ink-900 group-hover:text-gold-600 transition-colors">{res.title}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gold-600 opacity-30 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-20">
       <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-serif text-ink-900 tracking-tight">지도안 · 학습지 아카이브</h1>
          <p className="text-ink-800/60 font-serif max-w-2xl mx-auto">
             시흥문화유산 프로젝트 수업을 위한 다양한 교육 자료와 AI 활용 가이드를 제공합니다.
          </p>
       </div>

       {/* Quick Section Nav */}
       <div className="sticky top-[112px] z-30 bg-hanji-100/95 backdrop-blur-md border-b border-gold-500/10 py-4 -mt-10 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-center space-x-8 px-4">
             {[
               { id: 'lesson', label: '수업 지도안' },
               { id: 'activity', label: '활동지' },
               { id: 'project-res', label: '프로젝트 활동 자료' },
               { id: 'guide', label: 'AI 활용 가이드' },
               { id: 'prompt', label: '프롬프트 예시' },
             ].map((section) => (
               <a 
                 key={section.id} 
                 href={`#${section.id}`}
                 className="text-[11px] font-serif uppercase tracking-widest text-ink-800/60 hover:text-gold-600 transition-colors whitespace-nowrap"
               >
                 {section.label}
               </a>
             ))}
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {renderResourceList('수업 지도안', lessonResources, 'lesson')}
                {renderResourceList('활동지', activityResources, 'activity')}
                {renderResourceList('프로젝트 활동 자료', projectResources, 'project-res')}
                {renderResourceList('AI 활용 가이드', guideResources, 'guide')}
             </div>

             <div className="space-y-8 pt-12 border-t border-gold-500/10">
                <h2 className="text-2xl font-serif text-gold-600 flex items-center space-x-2">
                   <Lightbulb className="w-6 h-6" />
                   <span>AI 활용 핵심 팁</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {[
                     { title: '구체적인 맥락 제공', desc: '문화유산의 이름뿐만 아니라 그 속에 담긴 역사적 사실이나 설화를 프롬프트에 포함하세요.' },
                     { title: '스타일 지정', desc: '한국 전통의 느낌을 살리기 위해 "한지 질감", "수묵화 스타일", "서정적" 같은 단어를 사용해보세요.' },
                     { title: '학생의 시각 유지', desc: '아이들의 눈높이에서 궁금해할 법한 질문들을 AI에게 던져보세요.' },
                   ].map((tip, i) => (
                     <div key={i} className="p-6 bg-white border border-gold-500/5 hover:border-gold-500/20 shadow-sm transition-all">
                        <h4 className="font-serif font-bold mb-2 text-ink-900">{tip.title}</h4>
                        <p className="text-xs text-ink-800/60 font-serif leading-relaxed">{tip.desc}</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div id="prompt" className="space-y-8 scroll-mt-24">
             <h2 className="text-2xl font-serif text-gold-600 flex items-center space-x-2">
                <Code className="w-6 h-6" />
                <span>프롬프트 예시 (M.A.K.E.R)</span>
             </h2>
             <div className="space-y-6">
                {promptExamples.map((ex, i) => (
                   <motion.div 
                     key={i} 
                     whileHover={{ x: 5 }}
                     className="p-8 bg-ink-900 text-hanji-100 rounded-sm space-y-4 relative overflow-hidden shadow-xl"
                   >
                      <div className="flex justify-between items-start">
                         <span className="text-[10px] text-gold-500 uppercase tracking-widest font-serif">{ex.app}</span>
                         <Sparkles className="w-4 h-4 text-gold-500 opacity-30" />
                      </div>
                      <h4 className="text-lg font-serif">{ex.target}</h4>
                      <div className="p-4 bg-white/5 rounded text-sm font-serif italic text-hanji-200/80 leading-relaxed border-l-2 border-gold-500">
                         "{ex.prompt}"
                      </div>
                   </motion.div>
                ))}

                {promptResources.map(res => (
                   <motion.div 
                     key={res.id}
                     whileHover={{ x: 5 }}
                     className="p-6 bg-white border border-gold-500/20 text-ink-900 rounded-sm space-y-3 shadow-sm"
                   >
                      <div className="flex items-center justify-between">
                         <h4 className="font-serif font-bold text-sm">{res.title}</h4>
                         <a href={res.fileUrl} target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700"><ExternalLink className="w-4 h-4" /></a>
                      </div>
                      <div className="text-[10px] text-ink-800/40 font-serif flex items-center space-x-2 uppercase tracking-tight">
                         {res.type === 'image' ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                         <span>추가 예시 {res.type === 'image' ? '이미지' : '문서'}</span>
                      </div>
                   </motion.div>
                ))}
             </div>
          </div>
       </div>

       <div className="pt-20 border-t border-gold-500/10">
          <AdminUpload initialCategory="수업 지도안" />
       </div>
    </div>
  );
}
