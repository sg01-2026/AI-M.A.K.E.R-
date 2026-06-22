import { motion } from 'motion/react';
import { Compass, Sparkles, Cpu, Palette, Route as RouteIcon, HelpCircle } from 'lucide-react';

export default function MakerModelPage() {
  const steps = [
    {
      letter: 'M',
      title: '만남 (Meet)',
      desc: '시흥의 대표 문화유산과 첨단 디지털 신기술의 대면',
      icon: <Compass className="w-6 h-6 text-[#8C6239]" />,
      details: [
        '지역 역사 탐방 및 가옥 구조물 탐색',
        '생성형 AI 기초 드로잉 환경 및 체험 세션 연계',
        '시간을 초월하는 아카이브를 향한 첫 걸음'
      ],
      color: 'border-amber-300 bg-amber-50/20'
    },
    {
      letter: 'A',
      title: '질문 (Ask)',
      desc: '의미론적 역사 해석과 인공지능이 그리는 이미지의 불일치에서 던지는 탐구적 질문',
      icon: <HelpCircle className="w-6 h-6 text-indigo-600" />,
      details: [
        '공동 질문 설계: "AI는 우리 문화자산의 전설을 왜 다르게 이해할까?"',
        '인식의 갭 해결을 위한 핵심 어휘 및 프롬프트 가설 탐구',
        '역사적 고증과 디지털 표현 한계 간 창작의 틀 구축'
      ],
      color: 'border-indigo-200 bg-indigo-50/10'
    },
    {
      letter: 'K',
      title: '이해 (Know)',
      desc: '원활한 창작을 돕는 가이드라인 이해와 최적 프롬프트 구조화 설계',
      icon: <Cpu className="w-6 h-6 text-teal-600" />,
      details: [
        '인풋 텍스트와 아웃풋 시각 레이어 간 변환 메커니즘 학습',
        '역사 고증(주제•색채•질감•한지구조 등)을 담은 프롬프트 문법 규칙 인지',
        '소통 윤리, 개인정보 유출 방지 및 저작 불법 도달 방지'
      ],
      color: 'border-teal-200 bg-teal-50/10'
    },
    {
      letter: 'E',
      title: '표현 (Express)',
      desc: '다각적 생성 모델을 총 동원하여 나만의 디지털 예술품 구현',
      icon: <Palette className="w-6 h-6 text-rose-500" />,
      details: [
        '기초: 황금닭 드로잉 굿즈 디자인 시제품 창색',
        '중급: 스토리가 일관된 문예 역사 자서전 및 동화책 연출',
        '고급: 실감형 3D 가상 복원 유적지 큐레이션 및 AI 음원 비디오 제작'
      ],
      color: 'border-rose-200 bg-rose-50/10'
    },
    {
      letter: 'R',
      title: '연결 (Relate)',
      desc: '온라인 아카이브 수록, 동료 검토 및 지역 교학 보전',
      icon: <RouteIcon className="w-6 h-6 text-emerald-600" />,
      details: [
        '나만의 산출물을 [안전 보관소] 아카이브 플랫폼에 실시간 등재',
        '공공 도슨트로 활용하여 지역 도화 전시에 실재 기여',
        '지역 주민, 학부모, 선생님들과 찬란한 역사를 공감하고 연대함'
      ],
      color: 'border-emerald-200 bg-emerald-50/10'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 text-left">
      {/* Top Banner Accent */}
      <div className="h-1 bg-gradient-to-r from-[#8C6239] via-[#C5A880] to-[#1A1A1A] w-full" />

      {/* Main Hero Header */}
      <div className="relative py-24 px-4 bg-[#FCFAF5] border-b border-[#EADFCB]/30 overflow-hidden">
        <div className="hanji-texture absolute inset-0 opacity-15 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-xs text-[#8C6239] font-serif uppercase tracking-[0.3em] font-bold block">
            PEDAGOGICAL FRAMEWORK
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] font-bold tracking-tight">
            3-1. M.A.K.E.R 수업모형
          </h1>
          <div className="h-0.5 w-16 bg-[#8C6239]/40 mx-auto" />
          <p className="max-w-2xl mx-auto text-zinc-650 font-serif leading-relaxed text-sm md:text-base">
            시흥문화유산 탐구와 AI 기술 협업을 체계화한 saenggeum 만의 특색 창작 수업 흐름입니다.<br />
            5단계 단계를 통해 단순 관찰자에서 능동형 전통문화 크리에이터로 도약합니다.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-16 space-y-16">
        
        {/* Core Model Diagram Description */}
        <section className="bg-white border border-[#EADFCB]/40 rounded-sm p-8 md:p-12 shadow-xs">
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1A1A1A] border-b border-zinc-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#8C6239]" />
              <span>M.A.K.E.R 교수학습 전략이란?</span>
            </h2>
            <p className="text-sm text-zinc-700 leading-relaxed font-sans break-keep">
              시흥 내 초밀착 지역 역사 터전에서 학생들이 유산에 내재된 사백년 가치를 공감하고, 생성 기술을 통시적으로 결부하여 디지털 화첩, 메타버스 공간, 실감 영상 등 <strong>새로운 역사의 기록(Route)</strong>을 보존하는 유기 순환식 수업 전략 모델을 대변합니다.
            </p>
          </div>
        </section>

        {/* Vertical/Horizontal Flow Step Cards */}
        <section className="space-y-8">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#EADFCB]/30">
            <span className="w-2 h-2 bg-[#8C6239] rotate-45 shrink-0" />
            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1A1A1A]">
              5대 실행 단계 (Step-by-Step Flow)
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={step.letter}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`border-l-4 p-6 md:p-8 rounded-r-xs shadow-xs text-left flex flex-col md:flex-row items-start md:items-center gap-6 ${step.color}`}
              >
                {/* Visual Step Emblem block */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-16 h-16 bg-[#8C6239] text-white flex items-center justify-center rounded-sm shadow-md font-serif text-3xl font-bold relative">
                    {step.letter}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white border border-[#8C6239] rotate-45 flex items-center justify-center text-[7px] text-[#8C6239] font-bold">
                      0{idx + 1}
                    </div>
                  </div>
                  <div className="md:hidden">
                    <h3 className="text-lg font-bold font-serif text-[#1A1A1A]">
                      {step.title}
                    </h3>
                    <p className="text-xs text-zinc-500 font-serif italic">
                      Step {idx + 1} of M.A.K.E.R
                    </p>
                  </div>
                </div>

                {/* Step Info Content */}
                <div className="flex-1 space-y-4">
                  <div className="hidden md:block space-y-0.5">
                    <h3 className="text-lg font-bold font-serif text-[#1A1A1A] flex items-center gap-2">
                      {step.icon}
                      <span>{step.title}</span>
                    </h3>
                  </div>
                  <p className="text-sm font-sans font-semibold text-zinc-800 break-keep">
                    {step.desc}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-sans text-zinc-650 bg-white/65 p-4 border border-zinc-100/90 rounded-sm">
                    {step.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start space-x-1.5">
                        <span className="text-[#8C6239] font-bold shrink-0 mt-0.5">·</span>
                        <span className="break-all">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 4: 통합 가치 순환 체계 */}
        <section className="bg-gradient-to-br from-[#1A1A1A] to-zinc-900 text-white rounded-sm p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 hanji-texture pointer-events-none" />
          <div className="max-w-2xl mx-auto space-y-4 z-10 relative">
            <h3 className="text-lg md:text-xl font-serif text-[#C5A880] font-bold tracking-widest">
              ■ 통합 가치 순환 체계 (Relational Cycle)
            </h3>
            <p className="text-xs font-sans text-zinc-350 leading-relaxed break-keep">
              가옥의 유래(만남)에서 형성된 생각의 씨앗은, AI에게 질문을 건네고 도출해 보며(질문과 이해), 마침내 아름다운 미디어 작품으로 번져나간 후(표현), 학년 경계를 수직 연결하고 지역 주민과 디지털 사회로 온전히 분출(연결)되는 거대 순환 기틀을 달성할 것입니다.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
