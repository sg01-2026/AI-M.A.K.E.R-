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

  useEffect(() => {
    // Fetch AI 활용 가이드
    const qGuide = query(
      collection(db, 'resources'),
      where('category', '==', 'AI 활용 가이드'),
      orderBy('createdAt', 'desc')
    );
    const unsubGuide = onSnapshot(qGuide, (snap) => {
      setGuideResources(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Resource[]);
    });

    // Fetch 프롬프트 예시
    const qPrompt = query(
      collection(db, 'resources'),
      where('category', '==', '프롬프트 예시'),
      orderBy('createdAt', 'desc')
    );
    const unsubPrompt = onSnapshot(qPrompt, (snap) => {
      setPromptResources(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Resource[]);
    });

    return () => {
      unsubGuide();
      unsubPrompt();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-20">
       <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-serif text-ink-900">AI 활용 가이드</h1>
          <p className="text-ink-800/60 font-serif max-w-2xl mx-auto">
             시흥문화유산을 더 깊게 탐구하고 창의적으로 표현하기 위한 AI 활용 방법과 프롬프트 예시를 공유합니다.
          </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
             <h2 className="text-2xl font-serif text-gold-600 flex items-center space-x-2">
                <Lightbulb className="w-6 h-6" />
                <span>AI 활용 핵심 팁</span>
             </h2>
             <div className="space-y-4">
                {[
                  { title: '구체적인 맥락 제공', desc: '문화유산의 이름뿐만 아니라 그 속에 담긴 역사적 사실이나 설화를 프롬프트에 포함하세요.' },
                  { title: '스타일 지정', desc: '한국 전통의 느낌을 살리기 위해 "한지 질감", "수묵화 스타일", "서정적" 같은 단어를 사용해보세요.' },
                  { title: '학생의 시각 유지', desc: '아이들의 눈높이에서 궁금해할 법한 질문들을 AI에게 던져보세요.' },
                ].map((tip, i) => (
                  <div key={i} className="p-6 bg-white border border-gold-500/10 hover:border-gold-500/40 transition-colors">
                     <h4 className="font-serif font-bold mb-2">{tip.title}</h4>
                     <p className="text-sm text-ink-800/60 font-serif">{tip.desc}</p>
                  </div>
                ))}
             </div>

             {guideResources.length > 0 && (
               <div className="space-y-4 mt-8 pt-8 border-t border-gold-500/10">
                 <h3 className="text-lg font-serif text-ink-900">추가 가이드 자료</h3>
                 {guideResources.map(res => (
                   <a 
                     key={res.id}
                     href={res.fileUrl}
                     target="_blank"
                     className="flex items-center justify-between p-4 bg-hanji-100 border border-gold-500/10 hover:border-gold-500/40 transition-all rounded-sm"
                   >
                     <div className="flex items-center space-x-3">
                       {res.type === 'image' ? <ImageIcon className="w-4 h-4 text-gold-600" /> : <FileText className="w-4 h-4 text-gold-600" />}
                       <span className="text-sm font-serif text-ink-900">{res.title}</span>
                     </div>
                     <ExternalLink className="w-3.5 h-3.5 text-gold-600" />
                   </a>
                 ))}
               </div>
             )}
          </div>

          <div className="space-y-8">
             <h2 className="text-2xl font-serif text-gold-600 flex items-center space-x-2">
                <Code className="w-6 h-6" />
                <span>프롬프트 예시 (M.A.K.E.R)</span>
             </h2>
             <div className="space-y-6">
                {promptExamples.map((ex, i) => (
                   <motion.div 
                     key={i} 
                     whileHover={{ x: 5 }}
                     className="p-8 bg-ink-900 text-hanji-100 rounded-sm space-y-4 relative overflow-hidden"
                   >
                      <div className="flex justify-between items-start">
                         <span className="text-xs text-gold-500 uppercase tracking-widest font-serif">{ex.app}</span>
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
                     className="p-6 bg-white border border-gold-500/20 text-ink-900 rounded-sm space-y-3"
                   >
                      <div className="flex items-center justify-between">
                         <h4 className="font-serif font-bold">{res.title}</h4>
                         <a href={res.fileUrl} target="_blank" className="text-gold-600"><ExternalLink className="w-4 h-4" /></a>
                      </div>
                      <div className="text-xs text-ink-800/40 font-serif flex items-center space-x-2">
                         {res.type === 'image' ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                         <span>추가 예시 {res.type === 'image' ? '이미지' : '문서'}</span>
                      </div>
                   </motion.div>
                ))}
             </div>
          </div>
       </div>

       <AdminUpload initialCategory="AI 활용 가이드" />
    </div>
  );
}
