import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  GraduationCap, 
  Compass, 
  FileText, 
  Laptop, 
  Globe 
} from 'lucide-react';

interface HeritageCardItem {
  name: string;
  urlName: string;
  image: string;
  desc: string;
}

interface ActivityCardItem {
  name: string;
  hash: string;
  desc: string;
  icon: React.ReactNode;
}

const HERITAGES: HeritageCardItem[] = [
  {
    name: '능곡선사유적',
    urlName: '능곡선사유적지',
    image: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?auto=format&fit=crop&q=80&w=600',
    desc: '신석기 시대 움집 유적과 선조의 지혜가 담긴 주거 흔적'
  },
  {
    name: '오이도 패총',
    urlName: '오이도 패총',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
    desc: '서해안 최대 규모의 신석기 야외 패총이자 선사시대 박물관'
  },
  {
    name: '생금집',
    urlName: '생금집',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600',
    desc: '황금 닭의 따스한 전설과 숨결이 보존된 죽율동의 전통 가옥'
  },
  {
    name: '군자봉 성황제',
    urlName: '군자봉성황제',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600',
    desc: '천 년 동안 이어져 내려온 민속 의례이자 마을의 안녕 기원제'
  },
  {
    name: '호조벌',
    urlName: '호조벌',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600',
    desc: '백성들을 구휼하기 위해 축조한 시흥 간척의 대표 역사 유산'
  },
  {
    name: '갯골·염전',
    urlName: '갯골·염전',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
    desc: '구불구불한 내만 갯골과 근대 문화의 유산인 천일염 소금창고'
  },
  {
    name: '관곡지',
    urlName: '관곡지',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=600',
    desc: '성리학자 강희맹 선생이 백련을 전파한 조선 전기 연못'
  },
  {
    name: '기타',
    urlName: '기타',
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=600',
    desc: '그 외 시흥이 소장하고 있는 다양한 문화 자산과 숨은 일화들'
  }
];

const ACTIVITIES: ActivityCardItem[] = [
  {
    name: '수업지도',
    hash: 'lesson',
    desc: '문화유산 탐구의 체계성을 높여주는 교사용 정밀 수업지도 자료',
    icon: <GraduationCap className="w-5 h-5 text-gold-600" />
  },
  {
    name: 'P(프로젝트)활동',
    hash: 'project-res',
    desc: '모둠별 과제 활동, 학습지 및 단계별 프로젝트 템플릿 활동 자료',
    icon: <FileText className="w-5 h-5 text-gold-600" />
  },
  {
    name: 'AI활용가이드',
    hash: 'guide',
    desc: '생성형 인공지능 도구(Gemini)를 교실 수업에 적극 접목하기 위한 실용 가이드',
    icon: <Laptop className="w-5 h-5 text-gold-600" />
  }
];

export default function HeritageMainPage() {
  return (
    <div className="min-h-screen bg-hanji-50 pb-24 font-serif">
      {/* Hero Banner Section */}
      <section className="relative py-24 bg-ink-900 text-hanji-100 overflow-hidden">
        <div className="hanji-texture absolute inset-0 opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block p-3.5 bg-gold-500/10 rounded-full border border-gold-500/20 mb-2"
          >
            <BookOpen className="w-10 h-10 text-gold-500" />
          </motion.div>
          <div className="space-y-3">
            <span className="text-gold-500 font-sans tracking-[0.3em] text-xs font-bold uppercase block">
              Siheung Local Heritage Project
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              지역문화유산 프로젝트
            </h1>
          </div>
          <p className="text-hanji-200/70 font-sans max-w-2xl mx-auto leading-relaxed text-sm md:text-base break-keep">
            시흥의 지역문화유산을 살펴보고, 문화유산을 활용한 수업과 프로젝트 활동 자료를 확인할 수 있습니다.
          </p>
        </div>
      </section>

      {/* Main Sections Grid / Containers */}
      <main className="max-w-7xl mx-auto px-4 py-16 space-y-24">
        
        {/* Section 1: Cultural Heritage (문화유산) */}
        <section className="space-y-8">
          {/* Section Heading & Descriptive banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-ink-900/10 pb-6 text-left">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gold-600">
                <Compass className="w-5 h-5" />
                <span className="text-xs font-sans font-bold tracking-widest uppercase">SECTION 01</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-ink-900">지역 문화유산</h2>
              <p className="text-sm text-ink-800/60 font-sans break-keep">
                시흥의 주요 지역문화유산에 대한 소개와 관련 자료를 살펴볼 수 있습니다.
              </p>
            </div>
            
            <Link
              to="/heritage-archive"
              className="group inline-flex items-center space-x-1.5 px-4 py-2 border border-gold-500/20 bg-white hover:bg-gold-500/5 text-xs font-sans font-bold text-ink-900 rounded-xs transition-all duration-200 shadow-xs cursor-pointer whitespace-nowrap self-start md:self-end"
            >
              <span>학생 아카이브 전체보기</span>
              <ArrowRight className="w-3.5 h-3.5 text-gold-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Sublayout of Section 1: Hero illustration beside a card grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Visual Callout block (Desktop Column 4) */}
            <div className="lg:col-span-4 bg-white border border-gold-500/10 p-6 rounded-xs shadow-xs space-y-6 text-left">
              <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-gold-500/5">
                <img 
                  src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=500" 
                  alt="Cultural Heritage Callout"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-ink-900/10 mix-blend-overlay" />
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-ink-900 font-serif">동행하는 어제의 조언</h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans break-keep">
                  과거 시흥 조상인들이 자연과 공존하며 이룩한 선사문화, 간척의 일대기인 호조벌, 성화제와 황금 닭의 구전 전설을 현대 학생들의 감성적 필체와 인공지능 예술적 시야로 복각하였습니다.
                </p>
                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] font-sans text-gold-600 font-bold">
                  <span>시흥 향토 자원 수록</span>
                  <span>총 7대 명소 + 유물</span>
                </div>
              </div>
            </div>

            {/* Cultural Heritages Grid Cards (Desktop Column 8) */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {HERITAGES.map((item, idx) => {
                // If '기타', link to the student heritage archive with '기타' query
                const targetLink = item.urlName === '기타' 
                  ? '/heritage-archive?heritage=기타' 
                  : `/project/${encodeURIComponent(item.urlName)}`;

                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    viewport={{ once: true }}
                    className="group flex flex-col justify-between overflow-hidden bg-white hover:border-gold-500/30 border border-zinc-100 rounded-sm shadow-xs hover:shadow-md transition-all duration-300"
                  >
                    <Link to={targetLink} className="flex flex-col h-full">
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[16/11] bg-muted overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-ink-900/80 backdrop-blur-md border border-gold-500/10 text-[9px] text-gold-500 rounded-sm font-sans font-semibold">
                          {idx + 1}
                        </div>
                      </div>

                      {/* Content block */}
                      <div className="p-3.5 text-left flex-1 flex flex-col justify-between space-y-2">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-ink-900 group-hover:text-gold-600 transition-colors font-serif flex items-center justify-between">
                            <span>{item.name}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-gold-500 transition-colors" />
                          </h4>
                          <p className="text-[11px] text-zinc-500 font-sans line-clamp-2 leading-relaxed tracking-tight">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>

        {/* Section 2: Instructions & Classroom Activities (수업활동) */}
        <section className="space-y-8 pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-ink-900/10 pb-6 text-left">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gold-600">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-sans font-bold tracking-widest uppercase">SECTION 02</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-ink-900">수업 활동 자료</h2>
              <p className="text-sm text-ink-800/60 font-sans break-keep">
                지역문화유산을 활용할 수 있는 수업 자료, 프로젝트 활동 및 AI 활용 방법을 확인할 수 있습니다.
              </p>
            </div>

            <Link
              to="/resources"
              className="group inline-flex items-center space-x-1.5 px-4 py-2 border border-gold-500/20 bg-white hover:bg-gold-500/5 text-xs font-sans font-bold text-ink-900 rounded-xs transition-all duration-200 shadow-xs cursor-pointer whitespace-nowrap self-start md:self-end"
            >
              <span>자료 자료실 전체보기</span>
              <ArrowRight className="w-3.5 h-3.5 text-gold-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Activity Cards Horizontal / Grids Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ACTIVITIES.map((activity, idx) => {
              const targetUrl = `/resources#${activity.hash}`;

              return (
                <motion.div
                  key={activity.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  className="group relative bg-white border border-gold-500/10 p-6 rounded-xs hover:border-gold-500/30 transition-all duration-300 shadow-xs hover:shadow-md text-left flex flex-col justify-between space-y-6"
                >
                  <div className="absolute inset-0 hanji-texture opacity-5 pointer-events-none" />
                  
                  <div className="space-y-4 relative z-10">
                    <div className="p-3 bg-gold-500/5 border border-gold-500/10 rounded-sm inline-block">
                      {activity.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-ink-900 font-serif flex items-center space-x-1.5 group-hover:text-gold-600 transition-colors">
                        <span>{activity.name}</span>
                      </h3>
                      <p className="text-xs text-zinc-500 leading-relaxed font-sans break-keep">
                        {activity.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex justify-end relative z-10">
                    <Link
                      to={targetUrl}
                      onClick={() => {
                        // If we are already on resources, scroll on route hash shift
                        if (window.location.pathname === '/resources') {
                          setTimeout(() => {
                            const el = document.getElementById(activity.hash);
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }
                      }}
                      className="text-xs font-sans font-bold text-gold-600 group-hover:text-gold-700 flex items-center space-x-1"
                    >
                      <span>해당 게시판 가기</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}
