import { motion } from 'motion/react';
import { Image as ImageIcon, Newspaper, BookMarked, PlayCircle, ExternalLink, Calendar, Users } from 'lucide-react';

const promotionSections = [
  {
    id: 'gallery',
    title: '갤러리',
    description: '학생들의 활동 모습과 프로젝트 결과물을 이미지로 확인하세요.',
    icon: <ImageIcon className="w-8 h-8 text-gold-600" />,
    content: [
      { id: 1, title: '호조벌 현장 탐방', date: '2024.04.12', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800' },
      { id: 2, title: 'AI 페스티벌 작품 전시', date: '2024.05.20', image: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=800' },
      { id: 3, title: '지역문화유산 토론회', date: '2024.06.05', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800' },
    ]
  },
  {
    id: 'news',
    title: '프로젝트소식',
    description: 'M.A.K.E.R 프로젝트의 최신 소식과 언론 보도 내용입니다.',
    icon: <Newspaper className="w-8 h-8 text-gold-600" />,
    items: [
      { title: '시흥문화유산 AI 프로젝트 정규 교과 편성 확정', date: '2024.06.10', category: '보도자료' },
      { title: '제1회 AI 융합 역사 교육 컨퍼런스 개최 안내', date: '2024.06.15', category: '공지사항' },
      { title: '지역 유산과 기술의 만남: 학생 동아리 성과 분석', date: '2024.06.22', category: '소식' },
    ]
  },
  {
    id: 'textbook',
    title: '지역교과서탑재',
    description: '지역 교과서 및 교육 자료에 탑재된 프로젝트 우수 사례입니다.',
    icon: <BookMarked className="w-8 h-8 text-gold-600" />,
    content: '본 프로젝트의 소라산 탐방 코스와 AI 활용 학습법이 시흥시 지역 특성화 교과서 4학년 사회 영역에 정식 탑재되었습니다. 디지털 리터러시와 역사 교육의 혁신적인 융합 사례로 인정받아 전국 확산 모델로 선정되었습니다.'
  },
  {
    id: 'videos',
    title: '활동영상',
    description: '프로젝트 운영 과정과 학생들의 생동감 넘치는 활동 영상입니다.',
    icon: <PlayCircle className="w-8 h-8 text-gold-600" />,
    videos: [
      { title: '프로젝트 오프닝 필름: 미래를 짓는 시흥', length: '03:45', thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800' },
      { title: '학생 인터뷰: 내가 만든 AI 문화 유산 가이드', length: '05:12', thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800' },
    ]
  }
];

export default function PromotionPage() {
  return (
    <div className="min-h-screen bg-hanji-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="text-gold-600 font-serif uppercase tracking-[0.3em] text-sm">Promotion & Media</span>
            <h1 className="text-5xl md:text-6xl font-serif text-ink-900 leading-tight">프로젝트 홍보</h1>
            <p className="max-w-2xl mx-auto text-ink-800/60 font-serif text-lg">
              M.A.K.E.R 프로젝트가 세상과 소통하며 만들어가는 특별한 기록들을 소개합니다.
            </p>
          </motion.div>
        </header>

        {/* Quick Section Nav */}
        <div className="sticky top-[112px] z-30 bg-hanji-100/95 backdrop-blur-md border-b border-gold-500/10 py-4 mb-16 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-center space-x-8 px-4">
            {promotionSections.map((section) => (
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
          {/* Gallery Section */}
          <section id="gallery" className="scroll-mt-32">
            <div className="flex items-center space-x-4 mb-12">
              <div className="p-3 bg-gold-500/10 rounded-xl">
                {promotionSections[0].icon}
              </div>
              <div>
                <h2 className="text-3xl font-serif text-ink-900">{promotionSections[0].title}</h2>
                <p className="text-ink-800/60 font-serif">{promotionSections[0].description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.isArray(promotionSections[0].content) && promotionSections[0].content.map((item: any) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ y: -10 }}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-ink-900 shadow-2xl"
                >
                  <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-gold-500 text-[10px] uppercase tracking-widest block mb-2">{item.date}</span>
                    <h4 className="text-white font-serif text-xl">{item.title}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* News Section */}
          <section id="news" className="scroll-mt-32">
            <div className="bg-white/80 backdrop-blur-sm border border-gold-500/10 rounded-3xl p-8 md:p-12 shadow-xl shadow-gold-900/5">
              <div className="flex items-center space-x-4 mb-12">
                <div className="p-3 bg-gold-500/10 rounded-xl">
                  {promotionSections[1].icon}
                </div>
                <div>
                  <h2 className="text-3xl font-serif text-ink-900">{promotionSections[1].title}</h2>
                  <p className="text-ink-800/60 font-serif">{promotionSections[1].description}</p>
                </div>
              </div>
              <div className="space-y-6">
                {promotionSections[1].items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 hover:bg-hanji-100/50 rounded-2xl transition-all border border-transparent hover:border-gold-500/20 group">
                    <div className="flex items-center space-x-6">
                      <div className="flex flex-col items-center">
                        <span className="text-gold-600 font-serif text-xs uppercase tracking-widest">{item.category}</span>
                        <div className="w-1 h-1 bg-gold-500/30 rounded-full mt-2" />
                      </div>
                      <h4 className="text-ink-900 font-serif text-xl group-hover:text-gold-600 transition-colors uppercase">{item.title}</h4>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-ink-800/40 font-serif text-sm">{item.date}</span>
                      <ExternalLink className="w-4 h-4 text-ink-800/20 group-hover:text-gold-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Textbook Section */}
          <section id="textbook" className="scroll-mt-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex p-4 bg-gold-500/10 rounded-2xl">
                  {promotionSections[2].icon}
                </div>
                <h2 className="text-4xl font-serif text-ink-900 leading-tight">지역을 넘어 전국으로,<br />미래 교육의 표준이 되다</h2>
                <p className="text-ink-800/70 font-serif text-lg leading-relaxed">
                  {promotionSections[2].content as string}
                </p>
                <div className="flex items-center space-x-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gold-500/20">
                      <Calendar className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-ink-800/40 uppercase tracking-widest">일자</p>
                      <p className="font-serif text-ink-900">2024년 정기 개편</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gold-500/20">
                      <Users className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-ink-800/40 uppercase tracking-widest">대상</p>
                      <p className="font-serif text-ink-900">도내 초등학교 전 학급</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gold-500/10 rounded-[3rem] blur-2xl opacity-50" />
                <div className="relative bg-white p-4 rounded-[2rem] shadow-2xl border border-gold-500/10 rotate-2">
                  <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800" alt="Textbook" className="rounded-2xl" />
                </div>
              </div>
            </div>
          </section>

          {/* Video Section */}
          <section id="videos" className="scroll-mt-32">
             <div className="flex items-center space-x-4 mb-12">
                <div className="p-3 bg-gold-500/10 rounded-xl">
                  {promotionSections[3].icon}
                </div>
                <div>
                  <h2 className="text-3xl font-serif text-ink-900">{promotionSections[3].title}</h2>
                  <p className="text-ink-800/60 font-serif">{promotionSections[3].description}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {promotionSections[3].videos?.map((video, i) => (
                  <div key={i} className="group relative">
                    <div className="relative aspect-video overflow-hidden rounded-3xl shadow-xl">
                      <img src={video.thumbnail} alt={video.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-ink-900/40 group-hover:bg-ink-900/20 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-gold-500 group-hover:border-gold-400 transition-all shadow-2xl">
                          <PlayCircle className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-ink-900/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-1 rounded">
                        {video.length}
                      </div>
                    </div>
                    <div className="mt-6 space-y-2">
                      <h4 className="text-2xl font-serif text-ink-900">{video.title}</h4>
                      <p className="text-ink-800/40 font-serif text-sm">Published in Promotion Archive • 2024</p>
                    </div>
                  </div>
                ))}
              </div>
          </section>
        </div>
      </div>
    </div>
  );
}
