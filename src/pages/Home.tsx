import { motion } from 'motion/react';
import { ChevronRight, ArrowDown, MapPin, Sparkles, BookOpen, PenTool, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminUpload from '../components/AdminUpload';

const categories = [
  { name: '호조벌', img: 'https://picsum.photos/seed/hozo/600/400' },
  { name: '관곡지', img: 'https://picsum.photos/seed/gwangok/600/400' },
  { name: '오이도 패총', img: 'https://picsum.photos/seed/oido/600/400' },
  { name: '군자봉황제', img: 'https://picsum.photos/seed/gunja/600/400' },
  { name: '능곡선사유적지', img: 'https://picsum.photos/seed/neunggok/600/400' },
  { name: '갯골·염전', img: 'https://picsum.photos/seed/salt/600/400' },
  { name: '생금집', img: 'https://picsum.photos/seed/saenggeum/600/400' },
];

export default function Home() {
  return (
    <div className="space-y-0 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 bg-ink-900 overflow-hidden">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay hanji-texture" />
          <img 
            src="/src/assets/images/hero_main_archival_1779032599489.png" 
            alt="Siheung Heritage Hero Illustration"
            className="w-full h-full object-cover opacity-95 scale-100 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-ink-900/50" />
          
          {/* Animated light particles (CSS only) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: Math.random() * 100 }}
                animate={{ 
                  opacity: [0, 0.5, 0], 
                  y: [0, -100, -200],
                  x: Math.random() * 50 - 25
                }}
                transition={{ 
                  duration: 5 + Math.random() * 5, 
                  repeat: Infinity, 
                  delay: Math.random() * 5 
                }}
                className="absolute w-1 h-1 bg-gold-500 rounded-full blur-[1px]"
                style={{ 
                  left: `${Math.random() * 100}%`, 
                  top: `${Math.random() * 100}%` 
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             className="space-y-4"
           >
             <div className="flex items-center justify-center space-x-4 mb-2">
               <div className="h-[1px] w-12 bg-gold-500/50" />
               <span className="text-gold-500 font-serif tracking-[0.4em] text-sm uppercase">Siheung Heritage M.A.K.E.R</span>
               <div className="h-[1px] w-12 bg-gold-500/50" />
             </div>
             <h1 className="text-5xl md:text-8xl text-hanji-100 font-serif leading-tight">
               과거를 읽고, <br/>
               <span className="text-gold-500 italic">오늘</span>을 쓰다.
             </h1>
             <p className="text-hanji-100/70 text-lg md:text-xl font-serif font-light max-w-2xl mx-auto leading-relaxed">
               학생들의 상상력과 AI 기술이 만나 <br/>
               시흥의 빛나는 조각들을 새롭게 기록합니다.
             </p>
           </motion.div>

           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.6, duration: 1 }}
             className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 pt-8"
           >
             <Link 
               to="/heritage"
               className="group relative px-8 py-4 bg-gold-500 text-ink-900 font-serif text-lg overflow-hidden flex items-center space-x-2"
             >
               <span className="relative z-10">프로젝트 시작하기</span>
               <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
               <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
             </Link>
             <button className="px-8 py-4 bg-transparent border border-hanji-100/30 text-hanji-100 font-serif text-lg hover:border-gold-500 hover:text-gold-500 transition-all duration-300 flex items-center space-x-2">
               <span>아카이브 영상보기</span>
               <Share2 className="w-5 h-5" />
             </button>
           </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold-500/50 flex flex-col items-center space-y-2 cursor-pointer"
        >
          <span className="text-[10px] uppercase tracking-widest font-serif">Scroll</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* M.A.K.E.R Section */}
      <section className="py-32 px-4 bg-hanji-100 relative overflow-hidden">
        <div className="hanji-texture absolute inset-0 opacity-10" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-4xl md:text-6xl font-serif text-ink-900">M.A.K.E.R</h2>
             <div className="h-1 w-24 bg-gold-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { char: 'M', word: 'Meet', desc: '문화유산 만나기', icon: <MapPin className="w-6 h-6 text-gold-600" /> },
              { char: 'A', word: 'Ask', desc: '질문하고 탐구하기', icon: <BookOpen className="w-6 h-6 text-gold-600" /> },
              { char: 'K', word: 'Know', desc: '역사와 의미 이해하기', icon: <Sparkles className="w-6 h-6 text-gold-600" /> },
              { char: 'E', word: 'Express', desc: '학년별 프로젝트 표현', icon: <PenTool className="w-6 h-6 text-gold-600" /> },
              { char: 'R', word: 'Relate', desc: '현재와 미래 연결하기', icon: <Share2 className="w-6 h-6 text-gold-600" /> },
            ].map((item, idx) => (
              <motion.div 
                key={item.char}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 bg-white/50 backdrop-blur-sm border border-gold-500/10 hover:border-gold-500/40 transition-all duration-500 hover:-translate-y-2"
              >
                <div className="text-5xl font-serif font-black text-gold-500/20 group-hover:text-gold-500/40 transition-colors mb-4">{item.char}</div>
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-serif text-ink-900 mb-2 group-hover:text-gold-600 transition-colors">{item.word}</h3>
                <p className="text-sm text-ink-800/60 font-serif leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Gallery Section */}
      <section className="py-32 px-4 bg-ink-900 text-hanji-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 space-y-6 md:space-y-0">
             <div className="space-y-4">
               <span className="text-gold-500 font-serif uppercase tracking-widest text-xs">Explore History</span>
               <h2 className="text-4xl md:text-5xl font-serif">시흥의 시간을 잇다</h2>
             </div>
             <Link to="/heritage" className="text-gold-500 flex items-center space-x-2 border-b border-gold-500/30 pb-1 hover:text-gold-400 transition-all">
               <span>전체 프로젝트 보기</span>
               <ChevronRight className="w-4 h-4" />
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {categories.map((item, idx) => (
               <Link
                 key={item.name}
                 to={`/project/${item.name}`}
                 className="block"
               >
                 <motion.div
                   initial={{ opacity: 0, scale: 0.95 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   transition={{ delay: idx * 0.05 }}
                   viewport={{ once: true }}
                   className="relative aspect-[3/4] overflow-hidden group cursor-pointer"
                 >
                   <img 
                     src={item.img} 
                     alt={item.name} 
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                     referrerPolicy="no-referrer"
                   />
                   <div className="absolute inset-0 bg-ink-900/40 group-hover:bg-ink-900/20 transition-colors duration-500" />
                   <div className="absolute inset-0 ink-gradient opacity-80" />
                   
                   <div className="absolute bottom-0 left-0 p-8 space-y-2">
                      <span className="text-xs text-gold-500/70 font-serif uppercase tracking-tighter">Heritage Site</span>
                      <h3 className="text-2xl font-serif text-white">{item.name}</h3>
                   </div>
                   
                   <div className="absolute inset-0 border border-gold-500/0 group-hover:border-gold-500/30 m-4 transition-all duration-500 pointer-events-none" />
                 </motion.div>
               </Link>
             ))}
          </div>
        </div>
      </section>

      {/* Living Archive / CTA */}
      <section className="py-32 px-4 bg-hanji-200 border-y border-gold-500/10">
         <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-6">
               <h2 className="text-3xl md:text-5xl font-serif text-ink-900 leading-tight">시흥의 이야기는 기록되어야 합니다.</h2>
               <p className="text-lg md:text-xl text-ink-800/80 font-serif leading-relaxed break-keep">
                  이곳은 단순한 플랫폼이 아닌, 학생들의 상상력과 지역의 역사가 숨쉬는 아카이브입니다.<br />
                  우리의 창작물들 시흥역사의 다음 페이지가 됩니다.
               </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               <div className="space-y-3 p-6 bg-white/30 backdrop-blur-sm rounded-sm border border-gold-500/5">
                  <div className="text-4xl md:text-5xl font-serif text-gold-600">120+</div>
                  <div className="text-[10px] text-ink-800 tracking-[0.2em] font-serif uppercase">참여 동아리</div>
               </div>
               <div className="space-y-3 p-6 bg-white/30 backdrop-blur-sm rounded-sm border border-gold-500/5">
                  <div className="text-4xl md:text-5xl font-serif text-gold-600">3,450</div>
                  <div className="text-[10px] text-ink-800 tracking-[0.2em] font-serif uppercase">아카이브 작품</div>
               </div>
               <div className="space-y-3 p-6 bg-white/30 backdrop-blur-sm rounded-sm border border-gold-500/5">
                  <div className="text-4xl md:text-5xl font-serif text-gold-600">45</div>
                  <div className="text-[10px] text-ink-800 tracking-[0.2em] font-serif uppercase">연계 기관</div>
               </div>
               <div className="space-y-3 p-6 bg-white/30 backdrop-blur-sm rounded-sm border border-gold-500/5">
                  <div className="text-4xl md:text-5xl font-serif text-gold-600">15,000</div>
                  <div className="text-[10px] text-ink-800 tracking-[0.2em] font-serif uppercase">기록된 질문</div>
               </div>
            </div>
         </div>
      </section>

      <AdminUpload />
    </div>
  );
}
