import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronRight, 
  ArrowDown, 
  BookOpen, 
  Award,
  FileText,
  Layout,
  Compass,
  ArrowRight,
  Laptop,
  Cpu,
  Sparkles,
  Layers,
  ArrowRightLeft,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminUpload from '../components/AdminUpload';
import saenggeumHeroImg from '../assets/images/saenggeumjib_heritage_hero_1780207752002.png';

export default function Home() {
  return (
    <div className="space-y-0 overflow-hidden bg-[#FAF8F5]">
      {/* Decorative Traditional Border Top */}
      <div className="h-1 bg-gradient-to-r from-[#8C6239] via-[#C5A880] to-[#1A1A1A] w-full" />

      {/* Redesigned Hero Section (Split Screen & Magazine Calligraphy Style) */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] flex flex-col md:flex-row border-b border-[#EADFCB]/40 bg-[#FCFAF5]">
        <div className="hanji-texture absolute inset-0 opacity-15 pointer-events-none" />

        {/* Left Side: Calligraphy & Elegant Title Block */}
        <div className="w-full md:w-[40%] p-8 md:p-16 flex flex-col justify-between relative border-r border-[#EADFCB]/30 min-h-[450px] md:min-h-0">
          <div className="absolute inset-0 pointer-events-none" />
          
          {/* Subtle orientation marker */}
          <div className="flex items-center space-x-2 text-[10px] text-[#8C6239] font-serif uppercase tracking-widest mb-6 md:mb-0">
            <span className="w-1.5 h-1.5 bg-[#8C6239] rotate-45" />
            <span>Siheung History M.A.K.E.R</span>
          </div>

          {/* Vertical Calligraphic Main Layout */}
          <div className="my-auto flex flex-row items-start justify-center md:justify-start gap-8 md:gap-12 py-10">
            {/* Elegant vertical heading '시흥생금집' */}
            <div className="vertical-text font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-[#1A1A1A] tracking-[0.2em] leading-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
              시흥생금집
            </div>

            {/* Vertical Explanation Tag with Classic Border */}
            <div className="vertical-text font-serif text-[11px] md:text-xs lg:text-sm text-ink-800/80 tracking-[0.35em] text-center py-10 px-3 border-r border-l border-[#8C6239]/20 bg-white/40 backdrop-blur-xs shadow-[0_4px_12px_rgba(140,98,57,0.02)] rounded-xs">
              시흥 지역 중농의 전형적인 전통 가옥
            </div>
          </div>

          {/* Horizontal Descriptive Paragraph at Bottom */}
          <div className="space-y-4">
            <p className="text-sm md:text-md text-ink-800/75 font-serif leading-relaxed font-light break-keep">
              전통 가구의 멋이 깃든 공간 속 전설을 바탕으로, 어린이들의 영감과 AI 기술을 융합하여 미래의 시흥을 그려나갑니다.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link 
                to="/heritage"
                className="px-5 py-2.5 bg-[#8C6239] text-white font-serif text-xs uppercase tracking-widest hover:bg-[#6D4926] shadow-md transition-all flex items-center space-x-1.5 rounded-sm"
              >
                <span>가옥 둘러보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <a 
                href="#maker-overview"
                className="px-5 py-2.5 bg-white border border-[#EADFCB]/60 text-[#1A1A1A] font-serif text-xs uppercase tracking-widest hover:bg-[#F2EFE7] hover:border-[#8C6239]/40 transition-all rounded-sm shadow-sm"
              >
                <span>프로젝트 소개</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Traditional Hanok Frame Layout */}
        <div className="w-full md:w-[60%] relative overflow-hidden bg-[#1A1A1A] flex items-center">
          <img 
            src={saenggeumHeroImg} 
            alt="Siheung Heritage Saenggeumjib Hero"
            className="w-full h-full object-cover opacity-90 scale-100 filter brightness-95"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/30 via-transparent to-black/20" />
          
          {/* Historical site seal overlay */}
          <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/10 text-[9px] text-white/90 font-serif tracking-widest rounded-sm">
            시흥시 향토유적 제14호
          </div>

          {/* Slider controls styled like split brown buttons */}
          <div className="absolute bottom-6 left-6 flex space-x-0.5 z-20">
            <Link 
              to="/heritage"
              className="px-4 py-2 bg-[#8C6239]/90 hover:bg-[#8C6239] text-white font-serif text-[10px] tracking-widest uppercase transition-all rounded-l-sm"
            >
              이전
            </Link>
            <Link 
              to="/activity-photos"
              className="px-4 py-2 bg-[#553F2E]/90 hover:bg-[#553F2E] text-white font-serif text-[10px] tracking-widest uppercase transition-all rounded-r-sm"
            >
              다음
            </Link>
          </div>

          {/* Downward Scroll indicator */}
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="absolute bottom-6 right-8 text-white/50 flex items-center space-x-1.5 cursor-pointer text-[10px] font-serif uppercase tracking-widest"
          >
            <span>아래로</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </motion.div>
        </div>
      </section>

      {/* ① 문화유산 M.A.K.E.R 프로젝트 개요 */}
      <section id="maker-overview" className="relative py-20 px-4 bg-white border-b border-[#EADFCB]/30 scroll-mt-20">
        <div className="hanji-texture absolute inset-0 opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="text-xs text-[#8C6239] font-serif uppercase tracking-[0.25em] font-bold block">
            OVERVIEW
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#1A1A1A] font-bold tracking-tight">
            문화유산 M.A.K.E.R 프로젝트
          </h2>
          <div className="h-0.5 w-16 bg-[#8C6239]/40 mx-auto" />
          <p className="text-sm md:text-base text-zinc-700 max-w-2xl mx-auto leading-relaxed font-sans break-keep whitespace-pre-line">
            시흥의 지역문화유산을 탐구하고, 디지털 도구와 AI를 활용하여 새로운 방식으로 표현하는 프로젝트입니다.
            {"\n\n"}
            학생들은 디지털 기초 역량을 익힌 후 지역문화유산을 조사하고, 다양한 디지털 콘텐츠를 제작하며 지역의 가치와 의미를 공유합니다.
          </p>
        </div>
      </section>

      {/* ② 전체 학습 흐름 */}
      <section className="relative py-20 px-4 bg-[#FCFAF5] border-b border-[#EADFCB]/30">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-3">
            <span className="text-xs text-[#8C6239] font-serif uppercase tracking-[0.25em] font-bold">LEARNING FLOW</span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#1A1A1A] font-bold">전체 학습 흐름</h2>
            <div className="h-0.5 w-12 bg-[#8C6239]/30 mx-auto" />
          </div>

          {/* Flow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: '01', title: '디지털 기초학습', desc: '디지털 및 협업 기초 도구 활용 능력 함양' },
              { step: '02', title: '수준별 심화학습', desc: '생성형 AI와 멀티미디어를 접목한 심화 학습' },
              { step: '03', title: '지역문화유산 탐구', desc: '시흥 7대 향토 유산의 사료 및 전설 탐색' },
              { step: '04', title: 'M.A.K.E.R 프로젝트', desc: '만남, 질문, 이해, 표현, 연결의 실천 수업' },
              { step: '05', title: '학생 결과물 공유', desc: '디지털 콘텐츠 발행 및 피드백 나눔' },
            ].map((flow, idx) => (
              <div key={flow.step} className="flex flex-col items-center md:items-stretch relative">
                {/* Flow Card Body */}
                <div className="w-full bg-white border border-[#EADFCB]/40 rounded-sm p-6 text-center space-y-3 shadow-xs relative hover:shadow-md transition-shadow">
                  <div className="text-xs font-bold text-[#8C6239] font-serif">{flow.step}</div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] font-serif">{flow.title}</h3>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-sans break-keep">{flow.desc}</p>
                </div>

                {/* Connector Arrow for Large Screens */}
                {idx < 4 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-[#C5A880]">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                )}
                {/* Connector Arrow for Mobile */}
                {idx < 4 && (
                  <div className="flex md:hidden my-2 text-[#C5A880]">
                    <ArrowDown className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ③ 디딤발 활동 바로가기 */}
      <section className="relative py-20 px-4 bg-white border-b border-[#EADFCB]/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs text-[#8C6239] font-serif uppercase tracking-[0.25em] font-bold">PREPARATORY ACTIVITIES</span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#1A1A1A] font-bold">디딤발 활동 바로가기</h2>
            <div className="h-0.5 w-12 bg-[#8C6239]/30 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: 2-1. 기초학습 */}
            <div className="bg-[#FAF8F5] border border-[#EADFCB]/30 p-8 rounded-sm hover:shadow-md transition-all flex flex-col justify-between text-left space-y-6">
              <div className="space-y-4">
                <div className="p-3 bg-white border border-[#EADFCB]/30 rounded-sm inline-block text-[#8C6239]">
                  <Laptop className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#1A1A1A] font-serif">2-1. 기초학습</h3>
                  <p className="text-xs text-[#8C6239] font-sans tracking-wider uppercase font-semibold">Step 01 - Basics</p>
                </div>
                <p className="text-xs text-zinc-650 leading-relaxed font-sans break-keep">
                  디지털 기기와 소프트웨어를 다루고 협업 도구를 사용하는 기초적인 디지털 역량을 함양하는 배움터입니다.
                </p>
              </div>
              <Link
                to="/basics"
                className="w-full text-center py-2.5 bg-[#8C6239] hover:bg-[#6D4926] text-white font-serif text-xs uppercase tracking-widest transition-colors rounded-sm shadow-xs inline-flex items-center justify-center space-x-1"
              >
                <span>학습방 이동</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: 2-2. 수준별 심화학습 */}
            <div className="bg-[#FAF8F5] border border-[#EADFCB]/30 p-8 rounded-sm hover:shadow-md transition-all flex flex-col justify-between text-left space-y-6">
              <div className="space-y-4">
                <div className="p-3 bg-white border border-[#EADFCB]/30 rounded-sm inline-block text-[#8C6239]">
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#1A1A1A] font-serif">2-2. 수준별 심화학습</h3>
                  <p className="text-xs text-[#8C6239] font-sans tracking-wider uppercase font-semibold">Step 02 - Intensive</p>
                </div>
                <p className="text-xs text-zinc-650 leading-relaxed font-sans break-keep">
                  생성형 AI 기술을 활용하여 수준별 심화 활동과 다채로운 융복합적 창작 활동을 수행하고 발전시킵니다.
                </p>
              </div>
              <Link
                to="/advanced"
                className="w-full text-center py-2.5 bg-[#8C6239] hover:bg-[#6D4926] text-white font-serif text-xs uppercase tracking-widest transition-colors rounded-sm shadow-xs inline-flex items-center justify-center space-x-1"
              >
                <span>학습방 이동</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: 2-3. 학생동아리 활동 */}
            <div className="bg-[#FAF8F5] border border-[#EADFCB]/30 p-8 rounded-sm hover:shadow-md transition-all flex flex-col justify-between text-left space-y-6">
              <div className="space-y-4">
                <div className="p-3 bg-white border border-[#EADFCB]/30 rounded-sm inline-block text-[#8C6239]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#1A1A1A] font-serif">2-3. 학생동아리 활동</h3>
                  <p className="text-xs text-[#8C6239] font-sans tracking-wider uppercase font-semibold">Step 03 - Clubs</p>
                </div>
                <p className="text-xs text-zinc-650 leading-relaxed font-sans break-keep">
                  디지털 기초 역량과 결합해 시흥의 고유한 지역 역사와 전통적 미를 탐구하고 공유하는 동아리 활동을 확인합니다.
                </p>
              </div>
              <Link
                to="/activity-photos"
                className="w-full text-center py-2.5 bg-[#8C6239] hover:bg-[#6D4926] text-white font-serif text-xs uppercase tracking-widest transition-colors rounded-sm shadow-xs inline-flex items-center justify-center space-x-1"
              >
                <span>동아리관 이동</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ④ M.A.K.E.R 수업의 실제 소개 */}
      <section className="relative py-20 px-4 bg-[#FCFAF5] border-b border-[#EADFCB]/30">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs text-[#8C6239] font-serif uppercase tracking-[0.25em] font-bold">M.A.K.E.R IN CLASSROOMS</span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#1A1A1A] font-bold">M.A.K.E.R 수업의 실제 소개</h2>
            <div className="h-0.5 w-12 bg-[#8C6239]/30 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="bg-white border border-[#EADFCB]/40 rounded-sm p-8 shadow-xs hover:shadow-md transition-shadow text-left flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-[#8C6239]/10 text-[#8C6239] rounded-sm">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A1A] font-serif">M.A.K.E.R 수업모형</h3>
                    <p className="text-[10px] text-zinc-400 font-sans tracking-widest uppercase">Classroom Pedagogical Framework</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed font-sans break-keep">
                  만남(Meet), 질문(Ask), 이해(Know), 표현(Express), 연결(Relate)의 단계로 구성된 프로젝트 수업모형을 확인합니다.
                </p>
              </div>
              <Link
                to="/maker-model"
                className="inline-flex items-center space-x-1.5 text-xs text-[#8C6239] font-bold font-serif hover:underline"
              >
                <span>3-1. 수업모형 알아보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-[#EADFCB]/40 rounded-sm p-8 shadow-xs hover:shadow-md transition-shadow text-left flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-[#8C6239]/10 text-[#8C6239] rounded-sm">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A1A] font-serif">지역문화유산 프로젝트 수업</h3>
                    <p className="text-[10px] text-zinc-400 font-sans tracking-widest uppercase">Local Heritage Project Classes</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed font-sans break-keep">
                  호조벌, 관곡지, 오이도 패총 등 시흥 지역문화유산을 활용한 실제 프로젝트 수업의 단계별 구성과 자료들을 확인합니다.
                </p>
              </div>
              <Link
                to="/heritage"
                className="inline-flex items-center space-x-1.5 text-xs text-[#8C6239] font-bold font-serif hover:underline"
              >
                <span>3-2. 실제 프로젝트 보러가기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ⑤ 활동 아카이브 */}
      <section className="relative py-20 px-4 bg-white border-b border-[#EADFCB]/30">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs text-[#8C6239] font-serif uppercase tracking-[0.25em] font-bold">DIGITAL ARCHIVES</span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#1A1A1A] font-bold">활동 아카이브</h2>
            <div className="h-0.5 w-12 bg-[#8C6239]/30 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Archive Card 1 */}
            <div className="border border-[#EADFCB]/40 hover:border-[#8C6239]/40 bg-[#FAF8F5] p-8 rounded-sm text-left flex flex-col justify-between space-y-6 hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#1A1A1A] font-serif">AI 디지털 소양 학생 활동 아카이브</h3>
                  <Laptop className="w-5 h-5 text-[#8C6239]" />
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed font-sans break-keep">
                  디지털 기초, AI 활용과 영상 편집 과정에서 제작한 학생 활동 결과물과 창작물들을 단계별로 편리하게 확인합니다.
                </p>
              </div>
              <Link
                to="/basics"
                className="px-6 py-3 bg-[#8C6239] hover:bg-[#6D4926] text-white font-serif text-xs font-bold uppercase tracking-widest transition-all rounded-xs text-center inline-flex items-center justify-center space-x-2"
              >
                <span>디지털 소양 아카이브 보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Archive Card 2 */}
            <div className="border border-[#EADFCB]/40 hover:border-[#8C6239]/40 bg-[#FAF8F5] p-8 rounded-sm text-left flex flex-col justify-between space-y-6 hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#1A1A1A] font-serif">지역문화유산 학생 활동 아카이브</h3>
                  <Compass className="w-5 h-5 text-[#8C6239]" />
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed font-sans break-keep">
                  지역문화유산을 면밀히 탐구하고 자신만의 개성을 담아 디지털 콘텐츠로 표현해 낸 학생 활동 결과물을 확인합니다.
                </p>
              </div>
              <Link
                to="/heritage-archive"
                className="px-6 py-3 bg-[#553F2E] hover:bg-[#402E21] text-white font-serif text-xs font-bold uppercase tracking-widest transition-all rounded-xs text-center inline-flex items-center justify-center space-x-2"
              >
                <span>지역문화유산 아카이브 보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AdminUpload />
    </div>
  );
}
