import { motion } from 'motion/react';
import { BookOpen, Video, FileText, Download, ExternalLink, Presentation, Users, Sparkles } from 'lucide-react';

const staffResources = [
  {
    id: 'ai-training',
    title: 'AI 활용 연수',
    description: '교실에서 바로 활용 가능한 생성형 AI 기초 및 심화 연수 자료입니다.',
    icon: <Presentation className="w-10 h-10 text-gold-600" />,
    items: [
      { name: '챗GPT와 함께하는 수업 설계 기초', type: 'PDF', date: '2024.03.15' },
      { name: '이미지 생성 AI를 활용한 창작 수업', type: 'Video', date: '2024.03.20' },
      { name: '교사를 위한 AI 윤리 교육 가이드', type: 'PDF', date: '2024.04.05' },
    ]
  },
  {
    id: 'digital-case',
    title: '디지털 수업 사례',
    description: '디지털 도구를 활용한 교과별 혁신 수업 사례 모음집입니다.',
    icon: <FileText className="w-10 h-10 text-gold-600" />,
    items: [
      { name: '사회과: 메타버스 지역문화 탐방', type: 'Doc', date: '2024.04.10' },
      { name: '국어과: AI 작문 도구 활용 글쓰기', type: 'Doc', date: '2024.04.15' },
      { name: '과학과: 데이터 시각화 실험 보고서', type: 'Link', date: '2024.04.22' },
    ]
  },
  {
    id: 'ai-experience',
    title: 'AI 체험 프로그램',
    description: '학생들이 쉽고 재미있게 참여할 수 있는 AI 체험 활동 구성안입니다.',
    icon: <Sparkles className="w-10 h-10 text-gold-600" />,
    items: [
      { name: '나만의 AI 챗봇 만들기 워크숍', type: 'Activity', date: '2024.05.02' },
      { name: 'AI를 활용한 지역 유산 포스터 제작', type: 'Activity', date: '2024.05.08' },
      { name: '인공지능 음악 작곡 챌린지', type: 'Activity', date: '2024.05.12' },
    ]
  },
  {
    id: 'project-data',
    title: '프로젝트 운영 자료',
    description: '프로젝트 기반 학습(PBL) 운영을 위한 행정 및 지도 자료입니다.',
    icon: <Users className="w-10 h-10 text-gold-600" />,
    items: [
      { name: '학생 프로젝트 평가 루브릭 양식', type: 'Excel', date: '2024.05.18' },
      { name: '프로젝트 결과 보고서 표준 템플릿', type: 'Doc', date: '2024.05.20' },
      { name: '지역사회 연계 프로젝트 협력 가이드', type: 'PDF', date: '2024.05.25' },
    ]
  }
];

export default function StaffPage() {
  return (
    <div className="min-h-screen bg-hanji-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-16">
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="text-gold-600 font-serif uppercase tracking-[0.3em] text-sm">Staff Professional Development</span>
            <h1 className="text-5xl md:text-6xl font-serif text-ink-900 leading-tight">교직원 연수 · 운영 자료</h1>
            <p className="max-w-2xl mx-auto text-ink-800/60 font-serif text-lg">
              시흥문화유산 M.A.K.E.R 프로젝트의 성공적인 운영과 교사의 전문성 향상을 위한 지원 공간입니다.
            </p>
          </motion.div>
        </header>

        {/* Quick Section Nav */}
        <div className="sticky top-[112px] z-30 bg-hanji-100/95 backdrop-blur-md border-b border-gold-500/10 py-4 mb-16 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-center space-x-8 px-4">
            {staffResources.map((section) => (
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

        <div className="space-y-24">
          {staffResources.map((section, idx) => (
            <section key={section.id} id={section.id} className="scroll-mt-32">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={`space-y-6 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="inline-flex p-4 bg-gold-500/10 rounded-2xl">
                    {section.icon}
                  </div>
                  <h2 className="text-3xl font-serif text-ink-900">{section.title}</h2>
                  <p className="text-ink-800/70 leading-relaxed font-serif text-lg">
                    {section.description}
                  </p>
                  <button className="flex items-center space-x-2 text-gold-600 font-serif border-b border-gold-500/30 pb-1 hover:border-gold-600 transition-all group">
                    <span>전체 자료 보기</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>

                <div className={`bg-white/80 backdrop-blur-sm border border-gold-500/10 rounded-3xl p-8 shadow-xl shadow-gold-900/5 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="space-y-4">
                    {section.items.map((item, i) => (
                      <div 
                        key={i}
                        className="flex items-center justify-between p-4 hover:bg-hanji-100/50 rounded-xl transition-all group border border-transparent hover:border-gold-500/20"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-hanji-100 flex items-center justify-center rounded-lg group-hover:bg-gold-500/20">
                            {item.type === 'Video' ? <Video className="w-5 h-5 text-gold-600" /> : <FileText className="w-5 h-5 text-gold-600" />}
                          </div>
                          <div>
                            <h4 className="text-ink-900 font-serif">{item.name}</h4>
                            <p className="text-[10px] text-ink-800/40 uppercase tracking-widest">{item.type} • {item.date}</p>
                          </div>
                        </div>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-hanji-100 text-ink-800 opacity-40 group-hover:bg-gold-500 group-hover:text-white group-hover:opacity-100 transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
