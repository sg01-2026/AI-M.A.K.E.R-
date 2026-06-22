import { motion } from 'motion/react';
import { Target, Heart, Palette, BookOpen, Compass, Award } from 'lucide-react';

export default function PurposePage() {
  const objectives = [
    {
      icon: <Compass className="w-8 h-8 text-[#8C6239]" />,
      title: '주도적인 배움의 확장 (Meet & Ask)',
      desc: '학생들이 지역 문화유산과 능동적으로 조우하여 주체적인 비판과 창의적 질문을 제기하는 역량을 키웁니다.',
    },
    {
      icon: <Palette className="w-8 h-8 text-[#8C6239]" />,
      title: '디지털 미래 리터러시 완성 (Know & Express)',
      desc: '생성형 AI 기술을 활용한 융합 예술 창색 과정을 거쳐 미래 시대를 전도할 디지털 드로잉 및 협업 역량을 육성합니다.',
    },
    {
      icon: <Award className="w-8 h-8 text-[#8C6239]" />,
      title: '지역 정신과 디지털 자산 육성 (Relate)',
      desc: '우리가 수놓은 시흥문화유산 아카이브를 영구 보존하여, 시흥 특색 디지털 교과 및 지역 교육 생태계와 상생 연결합니다.',
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 text-left">
      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-[#8C6239] via-[#C5A880] to-[#1A1A1A] w-full" />

      {/* Hero Banner Section */}
      <div className="relative py-24 px-4 bg-[#FCFAF5] border-b border-[#EADFCB]/30 overflow-hidden">
        <div className="hanji-texture absolute inset-0 opacity-15 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-xs text-[#8C6239] font-serif uppercase tracking-[0.3em] font-bold block">
            VISION & CORE VALUE
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] font-bold tracking-tight">
            1. 필요성 및 목적
          </h1>
          <div className="h-0.5 w-16 bg-[#8C6239]/40 mx-auto" />
          <p className="max-w-2xl mx-auto text-zinc-650 font-serif leading-relaxed text-sm md:text-base">
            과거를 읽고, 오늘을 쓰며, 내일로 잇는 시흥문화유산 M.A.K.E.R.<br />
            전통적 가치와 미래 신기술이 융합된 혁신적 교육 모델의 출발선입니다.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-16 space-y-16">
        
        {/* Section 1: 필요성 */}
        <section className="bg-white border border-[#EADFCB]/45 rounded-sm p-8 md:p-12 shadow-sm relative overflow-hidden">
          <div className="hanji-texture absolute inset-0 opacity-5 pointer-events-none" />
          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-3 pb-3 border-b border-zinc-100">
              <span className="w-2 h-2 bg-[#8C6239] rotate-45 shrink-0" />
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1A1A1A]">
                프로젝트의 필요성
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-zinc-700 font-sans leading-relaxed">
              <div className="space-y-4">
                <div className="bg-[#FAF8F5] p-5 border-l-4 border-[#8C6239]/80 rounded-r-xs">
                  <h4 className="font-serif font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-[#8C6239]" />
                    지역 정체성 교육의 새로운 전환
                  </h4>
                  <p className="text-xs text-zinc-650">
                    단순한 암기나 주입식 역사 수업에서 벗어나, 학생이 직접 고향의 문화 자산을 발굴하고 체험하는 과정 중심의 지역화 교육 패러다임이 절실히 요구됩니다.
                  </p>
                </div>
                <p className="break-keep text-xs">
                  디지털 대전환 시대의 미래 인재들에게 고정관념을 뛰어넘어 역사를 탐색하는 과정은 단순 학습이 아닌 정서적 유대와 공존을 익히는 토대로 작용합니다.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-[#FAF8F5] p-5 border-l-4 border-zinc-700 rounded-r-xs">
                  <h4 className="font-serif font-bold text-[#1A1A1A] mb-1.5 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-zinc-700" />
                    인공지능(AI)과 인문 가치의 유기적 융합
                  </h4>
                  <p className="text-xs text-zinc-650">
                    인공지능은 이제 단순 기술을 넘어 창조와 표현의 매체입니다. 학생의 창의적 상상력을 물리적 경계 없이 구현하기 위해 인문 자산과 디지털 도구의 창색 융합이 필요합니다.
                  </p>
                </div>
                <p className="break-keep text-xs">
                  다양한 시각·청각 생성 AI 가이드와 가상 증강 체험 인터페이스를 주도적으로 다루어 보며 창작물이 지역 아카이브에 기여하는 공동체 의식을 함양합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: 목적 */}
        <section className="space-y-8">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#EADFCB]/30">
            <span className="w-2 h-2 bg-[#8C6239] rotate-45 shrink-0" />
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1A1A1A]">
              운영 목적 (Objectives)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {objectives.map((obj, idx) => (
              <div
                key={idx}
                className="bg-white border border-zinc-200/80 p-6 rounded-sm shadow-xs flex flex-col justify-between hover:border-[#8C6239]/30 transition-all text-left"
              >
                <div className="space-y-4">
                  <div className="inline-flex p-3 bg-[#FAF8F5] border border-[#EADFCB]/30 rounded-full">
                    {obj.icon}
                  </div>
                  <h3 className="text-sm font-serif font-bold text-[#1A1A1A] leading-snug">
                    {idx + 1}. {obj.title}
                  </h3>
                  <p className="text-xs text-zinc-650 font-sans leading-relaxed break-keep">
                    {obj.desc}
                  </p>
                </div>
                <div className="pt-4 text-[10px] text-[#8C6239] font-serif tracking-wider font-bold">
                  ■ VALUE 0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: 기대 효과 */}
        <section className="bg-[#FAF8F5]/50 border border-[#EADFCB]/30 rounded-sm p-8 md:p-10">
          <div className="space-y-6">
            <h3 className="text-lg font-bold font-serif text-[#1A1A1A] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#8C6239]" />
              <span>우리가 기대하는 교육적 결실</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-zinc-700 font-sans">
              <div className="flex items-start space-x-3">
                <span className="text-[#8C6239] font-bold shrink-0 mt-0.5">✔</span>
                <p className="break-keep">
                  <strong>수요자 배움 모델 확립:</strong> 시생 생금집 역사와 드로잉 원리를 깨우치는 과정을 기록으로 축적, 타 가옥 및 공간으로 연계되어 공공 역사자료 대중화 기틀을 공여합니다.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#8C6239] font-bold shrink-0 mt-0.5">✔</span>
                <p className="break-keep">
                  <strong>교정간 소통 강화:</strong> 교사연수 연계 및 우수 지도안 공유를 활성화하여 동료 장학을 실현하고, 공립 초중등학교 정규 교육에 특수 자산으로 상용 배포됩니다.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#8C6239] font-bold shrink-0 mt-0.5">✔</span>
                <p className="break-keep">
                  <strong>지역 인재와 브랜드 구축:</strong> 학부모 및 가족 지혜 참여의 문을 열어 3대가 이어가는 시흥 백년 유산 아카이브로서 지역 브랜드 가치를 배가시킵니다.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-[#8C6239] font-bold shrink-0 mt-0.5">✔</span>
                <p className="break-keep">
                  <strong>공개 저작 혁신:</strong> 학생들이 구축한 풍성한 산물과 AI 창작물들이 지역 교과서 탑재 성과로 도약하여, 경기도 차원의 선도형 프로젝트 전수 모범이 됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
