import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ChevronRight, 
  ArrowDown, 
  MapPin, 
  Sparkles, 
  BookOpen, 
  PenTool, 
  Share2, 
  Code, 
  Rocket,
  Award,
  Calendar,
  FileText,
  Clock,
  Phone,
  Layout,
  MessageSquare,
  Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminUpload from '../components/AdminUpload';
import saenggeumHeroImg from '../assets/images/saenggeumjib_heritage_hero_1780207752002.png';

const categories = [
  { name: '호조벌', img: 'https://picsum.photos/seed/hozo/600/400' },
  { name: '관곡지', img: 'https://picsum.photos/seed/gwangok/600/400' },
  { name: '오이도 패총', img: 'https://picsum.photos/seed/oido/600/400' },
  { name: '군자봉성황제', img: 'https://picsum.photos/seed/gunja/600/400' },
  { name: '능곡선사유적지', img: 'https://picsum.photos/seed/neunggok/600/400' },
  { name: '갯골·염전', img: 'https://picsum.photos/seed/salt/600/400' },
  { name: '생금집', img: 'https://picsum.photos/seed/saenggeum/600/400' },
];

const GALLERY_WORKS = [
  {
    title: '황금 닭의 마당',
    author: '김지민 (초등 4학년)',
    tech: 'DALL-E 3',
    desc: '옛 김씨 가문 집 마당에 비치는 아침 햇살과 눈부신 황금빛 깃털의 전설 속 황금 닭을 신비롭게 재해석했습니다.',
    image: 'https://picsum.photos/seed/chicken_garden/400/300'
  },
  {
    title: '연꽃 향기 흐르는 관곡지',
    author: '정다은 (중등 1학년)',
    tech: 'Midjourney v6',
    desc: '강희맹 선조가 가져온 귀한 전당홍 백련의 은은함을 수묵 정물화 풍의 붓터치와 AI 수채 기법으로 녹여낸 예술품.',
    image: 'https://picsum.photos/seed/lotus_classic/400/300'
  },
  {
    title: '호조벌의 노란 미래',
    author: '최현우 (고등 2학년)',
    tech: 'Stable Diffusion',
    desc: '황금빛 들녘 호조벌의 곡식이 사이버네틱 미래 가상 테크놀로지와 호흡하는 환상적인 현대 농경 풍경화.',
    image: 'https://picsum.photos/seed/field_future/400/300'
  }
];

export default function Home() {
  const [currentGalleryIdx, setCurrentGalleryIdx] = useState(0);
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
                href="#notice-board"
                className="px-5 py-2.5 bg-white border border-[#EADFCB]/60 text-[#1A1A1A] font-serif text-xs uppercase tracking-widest hover:bg-[#F2EFE7] hover:border-[#8C6239]/40 transition-all rounded-sm shadow-sm"
              >
                <span>안내사항 보기</span>
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
              to="/clubs"
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

      {/* Part 2: Quick Information Board & Embellished Bar (Matched to Benchmark exactly) */}
      <section id="notice-board" className="relative py-16 px-4 bg-white border-b border-[#EADFCB]/30">
        <div className="max-w-7xl mx-auto">
          {/* 3-Column Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            
            {/* Card 1: 공지사항 (Notice Panel) - 4 Cols */}
            <div className="lg:col-span-4 bg-[#FAF8F5] border border-[#EADFCB]/30 p-8 rounded-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#8C6239]/5 to-transparent pointer-events-none" />
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-[#EADFCB]/30 mb-5">
                  <h3 className="text-lg font-bold font-serif text-[#1A1A1A] tracking-wider flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-[#8C6239] rounded-full" />
                    <span>공지사항</span>
                  </h3>
                  <Link to="/resources" className="text-xs text-[#8C6239] hover:underline uppercase tracking-widest font-serif">+ 더보기</Link>
                </div>
                <div className="space-y-4">
                  {[
                    { date: '05.31', title: '시흥문화유산 아카이브 웹서비스 일체형 개편 오픈', isNew: true },
                    { date: '05.18', title: '2026학년도 학생동아리 시흥 역사탐구 계획 공고', isNew: false },
                    { date: '05.15', title: '초중등 연계 생금집 황금 닭 굿즈 제작 행사 일정 안내', isNew: false },
                    { date: '05.10', title: '생금집 아카이브 디지털 도화전시 참여 신청 마감', isNew: false },
                  ].map((notice, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-serif border-b border-[#EADFCB]/10 pb-2.5">
                      <div className="flex items-center space-x-2.5 truncate pr-4">
                        <span className="text-[#8C6239] font-bold text-[10px] bg-[#8C6239]/5 px-1.5 py-0.5 rounded-sm">{idx + 1}</span>
                        <span className="text-ink-900/80 hover:text-[#8C6239] transition-colors truncate cursor-pointer">{notice.title}</span>
                      </div>
                      <span className="text-ink-800/40 text-[10px] shrink-0">{notice.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: 학생 창작관 (Student Creation Hub) - 4 Cols */}
            <div className="lg:col-span-4 bg-[#8C6239] text-[#FAF8F5] p-8 rounded-sm hover:shadow-lg transition-all relative overflow-hidden flex flex-col justify-between">
              <div className="absolute inset-0 opacity-5 mix-blend-overlay hanji-texture" />
              <div className="space-y-6 relative z-10">
                <div className="pb-3 border-b border-white/20">
                  <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-[#EADFCB] border border-[#EADFCB]/30 px-2.5 py-0.5 bg-white/10 rounded-full mb-2">
                    M.A.K.E.R Center
                  </span>
                  <h4 className="text-2xl font-serif mt-1">학생 창작관</h4>
                </div>
                
                <p className="text-xs text-[#FAF8F5]/85 font-serif leading-relaxed font-light break-keep">
                  시흥의 오랜 역사와 전설에 인공지능 신기술을 불어넣어, 학생들이 스스로 미디어 아티스트가 되어 완성해가는 배움터입니다.
                </p>

                <div className="space-y-2 font-serif text-xs pt-1">
                  <Link 
                    to="/clubs/기본1 (기초)" 
                    className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xs transition-all duration-350 group/link"
                  >
                    <span className="text-white/95 font-medium">기본1·기초 단계 (탐색과 드로잉)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#EADFCB] group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link 
                    to="/clubs/기본2(중급)" 
                    className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xs transition-all duration-350 group/link"
                  >
                    <span className="text-white/95 font-medium">기본2·중급 단계 (AI 자서전 동화)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#EADFCB] group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link 
                    to="/clubs/기본3(고급)" 
                    className="flex items-center justify-between p-2.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xs transition-all duration-350 group/link"
                  >
                    <span className="text-white/95 font-medium">기본3·고급 단계 (가곡 창작&3D)</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#EADFCB] group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="text-[9px] font-serif text-[#EADFCB]/60 pt-4 border-t border-white/15 relative z-10 flex justify-between items-center">
                <span>* 각 과정별 창작 아카이브 상시 등재</span>
                <Link to="/clubs" className="hover:underline text-white font-bold text-xs">전체보기 &rarr;</Link>
              </div>
            </div>

            {/* Card 3: 학생 갤러리 (Student Gallery) - 4 Cols */}
            <div className="lg:col-span-4 bg-white border border-[#EADFCB]/50 p-8 rounded-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#8C6239]/5 to-transparent pointer-events-none" />
              
              <div className="space-y-4 w-full">
                <div className="flex justify-between items-center pb-4 border-b border-[#EADFCB]/30">
                  <h3 className="text-lg font-bold font-serif text-[#1A1A1A] tracking-wider flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-[#8C6239]" />
                    <span>학생 갤러리</span>
                  </h3>
                  <div className="flex space-x-1.5">
                    {GALLERY_WORKS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentGalleryIdx(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          currentGalleryIdx === idx ? 'bg-[#8C6239] w-3.5' : 'bg-[#EADFCB]/60 hover:bg-[#8C6239]/40'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Active Slide Display */}
                <div className="relative mt-4 group/slide">
                  <div className="overflow-hidden aspect-[4/3] bg-stone-100 rounded-xs mb-3 border border-[#EADFCB]/20 relative">
                    {GALLERY_WORKS.map((work, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: currentGalleryIdx === idx ? 1 : 0 }}
                        transition={{ duration: 0.4 }}
                        className={`absolute inset-0 ${currentGalleryIdx === idx ? 'pointer-events-auto' : 'pointer-events-none opacity-0'}`}
                      >
                        <img
                          src={work.image}
                          alt={work.title}
                          className="w-full h-full object-cover group-hover/slide:scale-105 duration-700 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex flex-col justify-end p-3.5">
                          <p className="text-[9px] text-[#C5A880] font-sans tracking-widest">{work.tech}</p>
                          <h5 className="text-[13px] font-bold text-white font-serif">{work.title}</h5>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Curated Author & Desc */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#8C6239] font-serif font-bold">창작자: {GALLERY_WORKS[currentGalleryIdx].author}</span>
                      <span className="text-[9px] text-zinc-400 font-serif">시흥 미래 크리에이터</span>
                    </div>
                    <p className="text-[11px] text-[#1A1A1A]/70 font-serif leading-relaxed line-clamp-2 min-h-[32px] break-keep font-light">
                      {GALLERY_WORKS[currentGalleryIdx].desc}
                    </p>
                  </div>
                </div>
              </div>

              <Link 
                to="/resources"
                className="w-full text-center py-2.5 bg-[#553F2E] hover:bg-[#8C6239] text-[#FAF8F5] font-serif text-[10px] uppercase tracking-widest transition-colors rounded-xs shadow-sm mt-4 inline-block"
              >
                전체 디지털 갤러리 감상
              </Link>
            </div>

          </div>

          {/* Row of Round Beige Menu Buttons (Directly benchmarking Chusa Memorial Hall) */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 border-t border-[#EADFCB]/30 pt-10">
            {[
              { label: '가옥 소개', desc: '소개서 및 건축물', icon: <Layout className="w-5 h-5 text-[#8C6239]" />, path: '/heritage' },
              { label: '동아리 탐구', desc: '학년별 동아리관', icon: <PenTool className="w-5 h-5 text-[#8C6239]" />, path: '/clubs' },
              { label: '아카이브실', desc: '연구자료 및 백과', icon: <FileText className="w-5 h-5 text-[#8C6239]" />, path: '/resources' },
              { label: '가상도슨트', desc: 'AI 스토리 톡', icon: <MessageSquare className="w-5 h-5 text-[#8C6239]" />, path: '/project/생금집' },
              { label: '창작아뜰리에', desc: '체험자료 제작', icon: <Sparkles className="w-5 h-5 text-[#8C6239]" />, path: '/heritage' },
              { label: '오시는 길', desc: '약도 및 길찾기', icon: <Compass className="w-5 h-5 text-[#8C6239]" />, path: '/heritage' },
            ].map((menuItem, idx) => (
              <Link 
                key={idx}
                to={menuItem.path}
                className="group flex flex-col items-center text-center p-4 hover:bg-[#FAF8F5] rounded-lg transition-all"
              >
                <div className="w-14 h-14 bg-[#FAF8F5] group-hover:bg-[#EADFCB]/30 border border-[#EADFCB]/50 rounded-full flex items-center justify-center shadow-xs transition-all duration-300 md:group-hover:scale-105">
                  {menuItem.icon}
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#8C6239] transition-colors">{menuItem.label}</p>
                  <p className="hidden md:block text-[9px] text-[#1A1A1A]/40 font-serif mt-0.5">{menuItem.desc}</p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Part 3: "시흥의 이야기를 만나다" Section (with Brush Pine sketch background and Asymmetric rounded cards) */}
      <section className="relative py-28 px-4 bg-[#F2ECE0]/30 min-h-[700px] overflow-hidden">
        <div className="hanji-texture absolute inset-0 opacity-10 pointer-events-none" />

        {/* Traditional Watercolor Brush Sketch Backdrop (Custom Hand-drawn Oriental Pine Silhouette in SVG) */}
        <div className="absolute right-0 bottom-0 top-0 w-[400px] opacity-10 md:opacity-[0.14] pointer-events-none select-none">
          <svg viewBox="0 0 400 800" className="w-full h-full text-[#1A1A1A]" fill="currentColor">
            {/* Trunk of the pine */}
            <path d="M380,800 C320,700 280,500 300,320 C310,210 240,165 210,140 C175,110 180,95 240,123 C280,145 320,180 340,240 C360,290 310,380 340,510 C360,610 395,730 380,800 Z" />
            {/* Branches Left 1 */}
            <path d="M250,210 C180,210 120,160 80,180 C40,200 65,220 95,215 C135,210 190,260 250,210 Z" />
            <path d="M120,175 C85,160 55,145 30,175 C10,195 20,205 50,190 C80,175 105,170 120,175 Z" />
            {/* Branches Right 2 */}
            <path d="M305,320 C365,300 410,240 430,280 C410,310 370,310 325,325 C315,328 308,324 305,320 Z" />
            {/* Brush Pine needle clusters */}
            <circle cx="85" cy="180" r="18" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
            <circle cx="65" cy="170" r="14" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
            <circle cx="105" cy="190" r="22" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
            <circle cx="45" cy="155" r="12" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
            
            <circle cx="340" cy="275" r="25" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <circle cx="380" cy="260" r="20" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            
            {/* Top Branch */}
            <path d="M210,140 C160,110 120,40 160,10 C180,45 220,100 240,123 Z" />
            <circle cx="150" cy="35" r="18" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
            <circle cx="170" cy="60" r="14" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
          </svg>
        </div>

        {/* Left Side decorative Calligraphy Sketch */}
        <div className="absolute left-[-50px] bottom-10 w-[250px] opacity-[0.06] pointer-events-none select-none hidden lg:block">
          <svg viewBox="0 0 200 400" className="w-full h-full text-[#8C6239]" fill="currentColor">
            <path d="M20,380 C40,320 80,180 30,50 C25,20 40,10 50,45 C70,110 100,220 70,340 C65,360 40,385 20,380 Z" />
            <path d="M25,180 C80,150 150,110 190,80 C180,105 130,155 70,195 C45,210 30,195 25,180 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs text-[#8C6239] font-serif uppercase tracking-[0.25em] font-bold">LEGENDS & STORIES</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] leading-tight flex items-center justify-center space-x-3">
              <span>시흥의 이야기를 만나다</span>
            </h2>
            <div className="h-0.5 w-16 bg-[#8C6239]/40 mx-auto" />
            <p className="text-xs font-serif text-ink-800/60 max-w-xl mx-auto leading-relaxed">
              사백 년의 시간을 담아 생금집 마루 밑에 스며있는 황금 닭의 전설과 죽율동 마을 터전에 깃든 생동감 가득한 이야기들을 즐겨보세요.
            </p>
          </div>

          {/* Asymmetric Rounded Cards (Benchmarking Chusa layout) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: 황금 닭의 전설 */}
            <div className="group bg-[#FAF8F5] border border-[#EADFCB]/30 hover:border-[#8C6239]/40 transition-all shadow-sm rounded-tr-[4rem] rounded-bl-[4rem] overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-[4/3] bg-[#1A1A1A] overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/goldchicken/600/400" 
                  alt="Legend of Golden Chicken"
                  className="w-full h-full object-cover grayscale opacity-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent" />
                <span className="absolute bottom-4 left-4 text-[10px] text-[#EADFCB] font-serif uppercase tracking-widest font-bold">Story 01</span>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between space-y-6 bg-white">
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-ink-900 group-hover:text-[#8C6239] transition-colors">생금집 황금 닭 전설</h3>
                  <p className="text-xs text-ink-800/60 font-serif leading-relaxed font-light break-keep">
                    돌아가신 부친이 나타나 일러준 닭 둥지 밑에서 황금 닭털이 나와 자손 대대로 부자가 되었다는 죽율동 김씨 가문의 황금 닭 소망화.
                  </p>
                </div>
                <Link 
                  to="/project/생금집"
                  className="text-[10px] text-[#8C6239] font-serif uppercase tracking-widest font-bold flex items-center space-x-1 hover:underline"
                >
                  <span>이야기 아카이브 해제</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: 전설의 재구성 및 전시안내 */}
            <div className="group bg-[#FAF8F5] border border-[#EADFCB]/40 hover:border-[#8C6239]/40 transition-all shadow-md rounded-tl-[4rem] rounded-br-[4rem] overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-[4/3] bg-[#1A1A1A] overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/hanokinside/600/400" 
                  alt="Heritage Inside Exhibition"
                  className="w-full h-full object-cover grayscale opacity-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent" />
                <span className="absolute bottom-4 left-4 text-[10px] text-[#EADFCB] font-serif uppercase tracking-widest font-bold">Story 02</span>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between space-y-6 bg-[#FAF8F5]">
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-ink-900 group-hover:text-[#8C6239] transition-colors">디지털 전설 화첩</h3>
                  <p className="text-xs text-ink-800/60 font-serif leading-relaxed font-light break-keep">
                    학생들의 감성적인 시선과 AI 동화 일러스트레이터 프로그램이 만나 재탄생시킨 시흥 생금집 황금닭 동화 구연과 3D 가상 그래픽관.
                  </p>
                </div>
                <Link 
                  to="/resources"
                  className="text-[10px] text-[#8C6239] font-serif uppercase tracking-widest font-bold flex items-center space-x-1 hover:underline"
                >
                  <span>전체 화첩 보기</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: 가상 도슨트 투어 */}
            <div className="group bg-[#FAF8F5] border border-[#EADFCB]/30 hover:border-[#8C6239]/40 transition-all shadow-sm rounded-tr-[4rem] rounded-bl-[4rem] overflow-hidden flex flex-col justify-between">
              <div className="relative aspect-[4/3] bg-[#1A1A1A] overflow-hidden">
                <img 
                  src="https://picsum.photos/seed/smartdigital/600/400" 
                  alt="Vite Digital Studio"
                  className="w-full h-full object-cover grayscale opacity-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 to-transparent" />
                <span className="absolute bottom-4 left-4 text-[10px] text-[#EADFCB] font-serif uppercase tracking-widest font-bold">Story 03</span>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between space-y-6 bg-white">
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-ink-900 group-hover:text-[#8C6239] transition-colors">AI 사이버 도슨트</h3>
                  <p className="text-xs text-ink-800/60 font-serif leading-relaxed font-light break-keep">
                    생금집의 역사를 꿰뚫고 있는 지능형 역사 대화체 챗봇과 소통하며, 전통 한옥 구조와 선조들의 생활 모습을 퀴즈형식으로 알아갑니다.
                  </p>
                </div>
                <Link 
                  to="/project/생금집"
                  className="text-[10px] text-[#8C6239] font-serif uppercase tracking-widest font-bold flex items-center space-x-1 hover:underline"
                >
                  <span>도슨트 대화하기</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Part 4: "배움에 꽃을 피우다" Section (with structured clubs layouts) */}
      <section className="py-28 px-4 bg-white relative overflow-hidden">
        {/* Subtle background branch elements */}
        <div className="absolute left-[-40px] top-0 w-[300px] opacity-[0.04] pointer-events-none text-ink-900">
          <svg viewBox="0 0 200 400" fill="currentColor">
            <path d="M200,50 C140,50 100,10 50,20 C8,28 15,35 45,32 C85,28 120,65 200,50 Z" />
            <path d="M120,32 C70,18 40,2 10,12 C-15,20 5,28 35,22 C65,16 95,30 120,32 Z" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-[#EADFCB]/30 pb-6">
            <div className="space-y-4">
              <span className="text-[#8C6239] text-xs font-serif uppercase tracking-[0.25em] font-bold">STUDENT EXPERIENCES</span>
              <h2 className="text-3xl md:text-5xl font-serif text-[#1A1A1A]">배움에 꽃을 피우다</h2>
              <p className="text-xs text-ink-800/50 font-serif font-light max-w-lg">
                학생들이 역사학자, 예술가, IT전문가가 되어 직접 완성해낸 문화 전수 협업 아틀리에관입니다.
              </p>
            </div>
            <Link 
              to="/clubs"
              className="text-xs font-serif text-[#8C6239] hover:text-[#6D4926] flex items-center space-x-1.5 mt-4 md:mt-0 uppercase tracking-widest border-b border-[#8C6239]/20 pb-0.5"
            >
              <span>전체 배움 보기</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Structured Club Cards mimicking the course board */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Club Card 1: 기본1 (기초) */}
            <div className="group bg-[#FAF8F5] border border-[#EADFCB]/30 p-8 flex flex-col justify-between space-y-8 rounded-sm hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-widest text-[#8C6239] uppercase bg-[#8C6239]/5 px-2 py-0.5 rounded-sm">Level 01 · Beginner</span>
                  <Award className="w-4 h-4 text-[#8C6239]/40 group-hover:text-[#8C6239] transition-colors" />
                </div>
                <h3 className="text-2xl font-serif text-ink-900 group-hover:text-[#8C6239] transition-colors">기본1 (기초)</h3>
                <p className="text-xs text-ink-800/60 font-serif leading-relaxed font-light break-keep">
                  AI 프로젝트의 가벼운 첫걸음. 복잡한 코딩 없이 시흥의 옛 이야기와 문화유산을 탐닉하고, 친숙한 인공지능 그리기 도구를 접하는 입문 프로젝트입니다.
                </p>
                <div className="bg-white p-4 border border-[#EADFCB]/20 text-[11px] text-ink-900/60 font-serif leading-relaxed">
                  <span className="font-bold text-[#8C6239] block mb-1">■ 주요 콘텐츠</span>
                  사료 수집하기, 황금 닭 굿즈 꾸미기 체험, 전통 한옥 구조 명칭 맞추기 퍼즐 교실
                </div>
              </div>
              <Link 
                to="/clubs"
                className="w-full text-center py-3 border border-[#EADFCB] hover:border-[#8C6239]/60 hover:bg-[#FAF8F5] text-[#8C6239] font-serif text-[11px] uppercase tracking-widest transition-all rounded-xs"
              >
                기본 과정 입장하기
              </Link>
            </div>

            {/* Club Card 2: 기본2 (중급) */}
            <div className="group bg-[#FAF8F5] border border-[#EADFCB]/30 p-8 flex flex-col justify-between space-y-8 rounded-sm hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-widest text-[#8C6239] uppercase bg-[#8C6239]/5 px-2 py-0.5 rounded-sm">Level 02 · Intermediate</span>
                  <Code className="w-4 h-4 text-[#8C6239]/40 group-hover:text-[#8C6239] transition-colors" />
                </div>
                <h3 className="text-2xl font-serif text-ink-900 group-hover:text-[#8C6239] transition-colors">기본2 (중급)</h3>
                <p className="text-xs text-ink-800/60 font-serif leading-relaxed font-light break-keep">
                  상상력을 풍부하게 살리는 단계. AI 문장 생성기, 이미지 생성 AI 등 복수 도구들을 교차로 가동하며 시흥생금집의 역사를 미려한 예술 형식으로 번역합니다.
                </p>
                <div className="bg-white p-4 border border-[#EADFCB]/20 text-[11px] text-ink-900/60 font-serif leading-relaxed">
                  <span className="font-bold text-[#8C6239] block mb-1">■ 주요 콘텐츠</span>
                  AI전설 동화 대본 작문, 가상 소통 대화체 코딩, 역사 신문 카드뉴스 디자인
                </div>
              </div>
              <Link 
                to="/clubs"
                className="w-full text-center py-3 border border-[#EADFCB] hover:border-[#8C6239]/60 hover:bg-[#FAF8F5] text-[#8C6239] font-serif text-[11px] uppercase tracking-widest transition-all rounded-xs"
              >
                중급 과정 입장하기
              </Link>
            </div>

            {/* Club Card 3: 기본3 (고급) */}
            <div className="group bg-[#FAF8F5] border border-[#EADFCB]/30 p-8 flex flex-col justify-between space-y-8 rounded-sm hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-widest text-[#8C6239] uppercase bg-[#8C6239]/5 px-2 py-0.5 rounded-sm">Level 03 · Advanced</span>
                  <Rocket className="w-4 h-4 text-[#8C6239]/40 group-hover:text-[#8C6239] transition-colors" />
                </div>
                <h3 className="text-2xl font-serif text-ink-900 group-hover:text-[#8C6239] transition-colors">기본3 (고급)</h3>
                <p className="text-xs text-ink-800/60 font-serif leading-relaxed font-light break-keep">
                  미디어 테크놀로지 연계 탐사. 인공지능 작사와 다성 음악 작곡, 혹은 3D 리얼리티 아카이브를 구축하여 시흥 역사를 전세계에 퍼부어 알리는 고도화 과정입니다.
                </p>
                <div className="bg-white p-4 border border-[#EADFCB]/20 text-[11px] text-ink-900/60 font-serif leading-relaxed">
                  <span className="font-bold text-[#8C6239] block mb-1">■ 주요 콘텐츠</span>
                  생금집 테마 가곡 작곡, 하이브리드 미디어 영상 창제, 시흥 타임머신 지도 코딩
                </div>
              </div>
              <Link 
                to="/clubs"
                className="w-full text-center py-3 border border-[#EADFCB] hover:border-[#8C6239]/60 hover:bg-[#FAF8F5] text-[#8C6239] font-serif text-[11px] uppercase tracking-widest transition-all rounded-xs"
              >
                고급 과정 입장하기
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Part 5: Decorative Heritage Banner (Horizontal Heritage Galleries Grid) */}
      <section className="py-24 px-4 bg-[#1A1A1A] text-white relative">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay hanji-texture pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12">
             <div className="space-y-3">
               <span className="text-[#C5A880] font-serif uppercase tracking-widest text-xs">ARCHIVAL LANDSCAPES</span>
               <h2 className="text-3xl md:text-4xl font-serif text-[#FAF8F5]">시흥문화유산 화첩</h2>
             </div>
             <Link 
               to="/heritage" 
               className="text-[#C5A880] flex items-center space-x-1.5 border-b border-[#C5A880]/30 pb-0.5 hover:text-[#FAF8F5] hover:border-[#FAF8F5] text-xs font-serif uppercase tracking-widest transition-all mt-4 md:mt-0"
             >
               <span>전체 유산 화첩</span>
               <ChevronRight className="w-4 h-4" />
             </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
             {categories.slice(0, 4).map((item, idx) => (
               <Link
                 key={item.name}
                 to={`/project/${item.name}`}
                 className="block group relative aspect-[4/3] md:aspect-[3/4] overflow-hidden rounded-sm cursor-pointer shadow-sm border border-white/5"
               >
                 <img 
                   src={item.img} 
                   alt={item.name} 
                   className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-[#1A1A1A]/50 group-hover:bg-[#1A1A1A]/30 transition-all" />
                 
                 <div className="absolute bottom-4 left-4 right-4 text-left">
                   <p className="text-[8px] text-[#C5A880] font-serif uppercase tracking-widest mb-1 font-bold">Heritage</p>
                   <h3 className="text-base font-serif text-[#FAF8F5] truncate">{item.name}</h3>
                 </div>
                 <div className="absolute inset-3 border border-[#C5A880]/0 group-hover:border-[#C5A880]/30 transition-all duration-500 pointer-events-none" />
               </Link>
             ))}
          </div>
        </div>
      </section>

      {/* Part 6: Living Statistics & Archival Records */}
      <section className="py-24 px-4 bg-[#FCFAF5] border-t border-[#EADFCB]/30 relative overflow-hidden">
         <div className="hanji-texture absolute inset-0 opacity-10 pointer-events-none" />
         <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
            <div className="space-y-4">
               <h2 className="text-2xl md:text-4xl font-serif text-ink-900 leading-tight">시흥문화아카이브 레코드</h2>
               <div className="h-0.5 w-12 bg-[#8C6239]/40 mx-auto" />
               <p className="text-xs md:text-sm text-ink-800/80 font-serif leading-relaxed max-w-lg mx-auto">
                  이곳은 선조들의 발자취가 박제된 박물관이 아닙니다.<br />
                  학생들이 인공지능과 교감하여 활력을 새겨가고 있는 현재진행형 역사기록소입니다.
               </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
               <div className="space-y-2 p-5 bg-[#FAF8F5]/80 border border-[#EADFCB]/30 rounded-xs shadow-xs">
                  <div className="text-3xl md:text-4xl font-serif text-[#8C6239] font-bold">120+</div>
                  <div className="text-[9px] text-[#1A1A1A]/60 tracking-[0.2em] font-serif uppercase font-bold">기록된 학급/동아리</div>
               </div>
               <div className="space-y-2 p-5 bg-[#FAF8F5]/80 border border-[#EADFCB]/30 rounded-xs shadow-xs">
                  <div className="text-3xl md:text-4xl font-serif text-[#8C6239] font-bold">3,450</div>
                  <div className="text-[9px] text-[#1A1A1A]/60 tracking-[0.2em] font-serif uppercase font-bold">누적 창작 작품수</div>
               </div>
               <div className="space-y-2 p-5 bg-[#FAF8F5]/80 border border-[#EADFCB]/30 rounded-xs shadow-xs">
                  <div className="text-3xl md:text-4xl font-serif text-[#FAF8F5] font-bold">45</div>
                  <div className="text-[9px] text-[#1A1A1A]/60 tracking-[0.2em] font-serif uppercase font-bold">연계 교육지원청</div>
               </div>
               <div className="space-y-2 p-5 bg-[#FAF8F5]/80 border border-[#EADFCB]/30 rounded-xs shadow-xs">
                  <div className="text-3xl md:text-4xl font-serif text-[#8C6239] font-bold">15,000</div>
                  <div className="text-[9px] text-[#1A1A1A]/60 tracking-[0.2em] font-serif uppercase font-bold">탐지 질문 데이터건</div>
               </div>
            </div>
         </div>
      </section>

      <AdminUpload />
    </div>
  );
}
