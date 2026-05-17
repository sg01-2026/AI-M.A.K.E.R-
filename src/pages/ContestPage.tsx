import { motion } from 'motion/react';
import { Award, Send, Trophy, LayoutGrid, ExternalLink, Calendar, Users, Info } from 'lucide-react';

const contestSections = [
  {
    id: 'info',
    title: '대회 안내',
    description: '제1회 시흥문화유산 AI 창작 경진대회 요강 및 심사 기준입니다.',
    icon: <Info className="w-8 h-8 text-gold-600" />,
    details: {
      theme: '시흥의 100년, AI로 그리다',
      period: '2024.09.01 - 2024.10.15',
      target: '시흥시 관내 초·중·고등학생',
      criteria: ['창의성 (40)', '기술 활용도 (30)', '문화적 가치 (30)']
    }
  },
  {
    id: 'submit',
    title: '작품 제출',
    description: '여러분의 창의적인 AI 작품을 이곳에 제출해 주세요.',
    icon: <Send className="w-8 h-8 text-gold-600" />,
    action: '제출 하기',
    formInfo: '프로젝트 설명서(PDF)와 결과물 파일(JPG/MP4/Link)을 함께 첨부해야 합니다.'
  },
  {
    id: 'winners',
    title: '우수작 발표',
    description: '미래의 디지털 아티스트를 소개합니다. 선정된 우수작들입니다.',
    icon: <Trophy className="w-8 h-8 text-gold-600" />,
    list: [
      { rank: '대상', title: '호조벌의 사계: 생성형 AI로 구현한 입체 화첩', school: '시흥초등학교 6학년' },
      { rank: '최우수상', title: '오이도 패총 역사 탐험 VR 게임', school: '능곡중학교 2학년' },
      { rank: '우수상', title: '군자봉 황제 애니메이션 뮤직비디오', school: '군자고등학교 1학년' },
    ]
  },
  {
    id: 'exhibit',
    title: '수상작 전시',
    description: '수상작들의 상세 내용과 제작 과정을 가상 갤러리에서 만나보세요.',
    icon: <LayoutGrid className="w-8 h-8 text-gold-600" />,
    galleries: [
      { title: '메타버스 전시관 A (초등부)', count: 12 },
      { title: '메타버스 전시관 B (중등부)', count: 8 },
      { title: '메타버스 전시관 C (고등부)', count: 5 },
    ]
  }
];

export default function ContestPage() {
  return (
    <div className="min-h-screen bg-hanji-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="text-gold-600 font-serif uppercase tracking-[0.3em] text-sm">AI Creative Contest</span>
            <h1 className="text-5xl md:text-6xl font-serif text-ink-900 leading-tight">AI 경진대회</h1>
            <p className="max-w-2xl mx-auto text-ink-800/60 font-serif text-lg">
              디지털 기술로 시흥의 역사를 새롭게 해석하는 창의적 도전에 함께하세요.
            </p>
          </motion.div>
        </header>

        {/* Quick Section Nav */}
        <div className="sticky top-[112px] z-30 bg-hanji-100/95 backdrop-blur-md border-b border-gold-500/10 py-4 mb-16 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-center space-x-8 px-4">
            {contestSections.map((section) => (
              <a 
                key={section.id} 
                href={`#${section.id}`}
                className="text-[11px] font-serif uppercase tracking-widest text-ink-800/60 hover:text-gold-600 transition-colors whitespace-nowrap"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-32">
          {/* Info Section */}
          <section id="info" className="scroll-mt-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex p-4 bg-gold-500/10 rounded-2xl">
                  {contestSections[0].icon}
                </div>
                <h2 className="text-4xl font-serif text-ink-900 leading-tight">{contestSections[0].title}</h2>
                <div className="space-y-4">
                  <div className="p-6 bg-white/60 border border-gold-500/10 rounded-2xl">
                    <p className="text-sm uppercase tracking-widest text-gold-600 mb-1">대회 주제</p>
                    <p className="text-xl font-serif text-ink-900">{contestSections[0].details?.theme}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white/60 border border-gold-500/10 rounded-2xl">
                      <p className="text-sm uppercase tracking-widest text-gold-600 mb-1">접수 기간</p>
                      <p className="font-serif text-ink-900">{contestSections[0].details?.period}</p>
                    </div>
                    <div className="p-6 bg-white/60 border border-gold-500/10 rounded-2xl">
                      <p className="text-sm uppercase tracking-widest text-gold-600 mb-1">참가 대상</p>
                      <p className="font-serif text-ink-900">{contestSections[0].details?.target}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-ink-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500 opacity-10 rounded-full -mr-16 -mt-16" />
                <h3 className="text-2xl font-serif mb-8 text-gold-400">심사 기준</h3>
                <div className="space-y-6">
                  {contestSections[0].details?.criteria.map((c, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="font-serif text-lg">{c.split(' (')[0]}</span>
                      <span className="font-mono text-gold-500">{c.split(' (')[1].replace(')', '')} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Submit Section */}
          <section id="submit" className="scroll-mt-32">
            <div className="bg-white/80 backdrop-blur-sm border border-gold-500/10 rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto shadow-xl shadow-gold-900/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
              <div className="inline-flex p-5 bg-gold-500/10 rounded-full mb-8">
                {contestSections[1].icon}
              </div>
              <h2 className="text-3xl font-serif text-ink-900 mb-4">{contestSections[1].title}</h2>
              <p className="text-ink-800/60 font-serif mb-12 leading-relaxed">
                {contestSections[1].formInfo}
              </p>
              <button className="px-12 py-5 bg-ink-900 hover:bg-gold-600 text-white rounded-full font-serif text-xl transition-all shadow-xl hover:shadow-gold-500/20 active:scale-95 group">
                {contestSections[1].action}
                <ExternalLink className="inline-block ml-2 w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </section>

          {/* Winners Section */}
          <section id="winners" className="scroll-mt-32">
             <div className="flex items-center justify-center space-x-4 mb-16">
                <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-600">
                  <Award className="w-6 h-6" />
                </div>
                <h2 className="text-4xl font-serif text-ink-900">영예의 수상작</h2>
             </div>
             <div className="grid grid-cols-1 gap-6 max-w-5xl mx-auto">
                {contestSections[2].list?.map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="flex flex-col md:flex-row items-center justify-between p-8 bg-white border border-gold-500/20 rounded-2xl shadow-lg relative"
                  >
                    <div className="flex flex-col md:flex-row items-center space-x-0 md:space-x-8 text-center md:text-left mb-6 md:mb-0">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold font-serif text-xl ${
                        item.rank === '대상' ? 'bg-gold-500 text-ink-900' : 'bg-hanji-100 text-ink-800'
                      }`}>
                        {item.rank[0]}
                      </div>
                      <div>
                        <span className="text-gold-600 text-xs font-serif uppercase tracking-widest">{item.rank}</span>
                        <h4 className="text-2xl font-serif text-ink-900 mt-1">{item.title}</h4>
                      </div>
                    </div>
                    <div className="text-ink-800/40 font-serif border-l-0 md:border-l border-gold-500/10 pl-0 md:pl-8">
                       {item.school}
                    </div>
                  </motion.div>
                ))}
             </div>
          </section>

          {/* Exhibit Section */}
          <section id="exhibit" className="scroll-mt-32">
            <div className="bg-gold-500/5 border border-gold-500/10 rounded-[3rem] p-12 lg:p-20">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                    <h2 className="text-4xl font-serif text-ink-900 leading-tight">가상 현실에서 체험하는<br />수상작 갤러리</h2>
                    <p className="text-ink-800/60 font-serif text-lg">
                      {contestSections[3].description} 온라인 메타버스 전시 플랫폼에서 학생들의 모든 작품을 360도로 관람할 수 있습니다.
                    </p>
                    <div className="space-y-4">
                      {contestSections[3].galleries?.map((gallery, i) => (
                        <div key={i} className="flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-gold-500/10 hover:border-gold-500 transition-colors group cursor-pointer">
                          <span className="font-serif text-ink-900 group-hover:text-gold-600 transition-colors">{gallery.title}</span>
                          <span className="text-[10px] text-ink-800/40 uppercase tracking-widest">{gallery.count} Works</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-gold-500/20 to-ink-900/10 rounded-full animate-pulse absolute -inset-8" />
                    <div className="relative bg-ink-900 aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl flex items-center justify-center group cursor-pointer">
                       <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800" alt="Exhibition" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                       <div className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 text-white">
                          <LayoutGrid className="w-10 h-10" />
                       </div>
                       <div className="absolute bottom-6 left-6 right-6">
                          <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">Launching Soon</p>
                          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                             <div className="h-full bg-gold-500 w-[75%]" />
                          </div>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
