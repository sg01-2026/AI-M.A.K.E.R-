import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Compass, 
  MapPin, 
  HelpCircle, 
  Target, 
  ClipboardList, 
  FileText, 
  Sparkles, 
  ExternalLink, 
  ChevronRight, 
  GraduationCap,
  Award
} from 'lucide-react';

interface MakerActivityRow {
  phase: string;
  session: string;
  topic: string;
  detail: string;
}

interface HeritageClassDetail {
  id: string;
  name: string;
  image: string;
  overview: string;
  topic: string;
  objectives: string[];
  inquiryQuestions: string[];
  activities: MakerActivityRow[];
  studentOutputsDesc: string;
  studentOutputsLink: string;
  lessonMaterials: { title: string; link: string }[];
}

const HERITAGE_CLASS_DATA: HeritageClassDetail[] = [
  {
    id: 'hozobeol',
    name: '호조벌',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600',
    overview: '300여 년 전 백성들을 기근으로부터 구휼하기 위해 바다를 막아 논을 만든 시흥 조상들의 상생 정신과 과학적 간척 기술이 담긴 향토유산입니다.',
    topic: '호조벌의 역사적 가치와 간척 과학 원리 탐구 및 미래 생태 가치 나누기',
    objectives: [
      '호조벌의 형성 역사와 백성을 긍휼히 여긴 선조들의 상생 정신을 이해한다.',
      '조선 시대 조수간만의 차를 활용한 과학적 간척 기법을 파악한다.',
      '현대적 관점에서 호조벌의 생태계적 보전 가치를 찾아내고 디지털 매체로 제안할 수 있다.'
    ],
    inquiryQuestions: [
      '300년 전 선조들은 왜 이 드넓은 바다를 막아 논으로 바꿀 결심을 했을까?',
      '자연과 사람이 공존하는 생태 공간인 호조벌의 현재적 가치를 어떻게 다음 세대에 전할 수 있을까?'
    ],
    activities: [
      { phase: 'M (만남)', session: '1차시', topic: '호조벌과의 첫 만남', detail: '호조벌 고지도와 현대의 위성 사진을 비교하며 시흥 간척의 공간적 변화 탐색하기' },
      { phase: 'A (질문)', session: '2차시', topic: '질문과 호기심 디자인', detail: '간척 사업의 주도 인물과 건설 과정의 과학적 궁금증을 바탕으로 질문 목록 설계하기' },
      { phase: 'K (이해)', session: '3차시', topic: '역사와 과학적 원리 이해', detail: '밀물과 썰물의 압력 차이를 극복한 방조제 축조 과학 및 구휼 제도 이해하기' },
      { phase: 'E (표현)', session: '4-5차시', topic: '디지털 스토리북 제작', detail: '생성형 AI 및 클라우드 협업 편집 도구를 활용해 호조벌 배경 가상 동화 및 카드뉴스 창작하기' },
      { phase: 'R (연결)', session: '6차시', topic: '현재와 미래 생태 연결', detail: '호조벌 생태 보존 캠페인 홍보 카드를 학급 및 온·오프라인 채널에 공유하고 의견 나누기' }
    ],
    studentOutputsDesc: '학생들이 직접 호조벌의 생태와 역사를 탐색한 후, 생성형 AI 도구와 영상 편집기를 활용해 제작한 생태 보존 카드뉴스, 가상 스토리툰, 3D 가상 지도 등 다채로운 결과물입니다.',
    studentOutputsLink: '/heritage-archive?heritage=호조벌',
    lessonMaterials: [
      { title: '호조벌 역사 탐구 활동지', link: '/resources#activity' },
      { title: '조선 시대 간척 과학 PPT 자료', link: '/resources#lesson' },
      { title: '디지털 가상 스토리북 템플릿', link: '/resources#guide' }
    ]
  },
  {
    id: 'gwangokji',
    name: '관곡지',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=600',
    overview: '조선 전기의 학자이자 문신인 강희맹 선생이 명나라 남경에서 흰 연꽃(전당홍) 씨앗을 가져와 한국 최초로 시험 재배에 성공한 유서 깊은 연못입니다.',
    topic: '관곡지 전당홍의 전래 역사와 선비 정신의 상징적 의미 탐구',
    objectives: [
      '강희맹 선생의 행적과 백성들의 농업 발전을 위해 연꽃 씨앗을 가져온 실학 정신을 설명한다.',
      '진흙 속에서도 깨끗하게 피어나는 연꽃의 상징성과 문화적 가치를 파악한다.',
      'AI 디지털 디자인 도구를 조화롭게 활용해 관곡지 백련을 현대적 감성 시화로 재해석할 수 있다.'
    ],
    inquiryQuestions: [
      '작은 연꽃 씨앗 하나가 어떻게 시흥을 상징하는 대표적인 문화 역사유산이 되었을까?',
      '진흙 속에서도 청초하게 꽃피우는 연꽃의 모습 속에서 선조들은 어떤 삶의 태도를 본받고자 했을까?'
    ],
    activities: [
      { phase: 'M (만남)', session: '1차시', topic: '관곡지 연꽃 감상', detail: '관곡지의 백련 이미지와 전당홍 설화 텍스트를 읽고 시각적·감성적 느낌 공유하기' },
      { phase: 'A (질문)', session: '2차시', topic: '선비의 마음에 던지는 질문', detail: '강희맹 선생의 사행 길 여정과 연꽃 도입 동기에 대해 깊이 있는 의문 제기하기' },
      { phase: 'K (이해)', session: '3차시', topic: '농학과 인문학적 탐구', detail: '선조들의 연꽃 사랑과 정원 문화를 알아보고, 연꽃의 정화 능력 등 과학적 생태 원리 학습하기' },
      { phase: 'E (표현)', session: '4-5차시', topic: '디지털 시화첩 및 전시 기획', detail: '생성형 이미지 AI를 통해 백련 일러스트를 도출하고 디지털 협업 한옥 시화첩 완성하기' },
      { phase: 'R (연결)', session: '6차시', topic: '디지털 갤러리 연결', detail: '관곡지 가상 전시관 부스를 구축하여 주변 동료 및 학부모들과 온라인 피드백 주고받기' }
    ],
    studentOutputsDesc: '조선 시대 선비의 마음과 연꽃의 고귀함을 본받아 학생들이 AI 드로잉 및 협업 패널을 이용해 구상한 연꽃 일러스트 시화, 강희맹 비밀일기 타임라인 일지 등의 기록입니다.',
    studentOutputsLink: '/heritage-archive?heritage=관곡지',
    lessonMaterials: [
      { title: '관곡지 연꽃 생태 과학 학습지', link: '/resources#activity' },
      { title: '강희맹의 농학 업적 지도안', link: '/resources#lesson' },
      { title: '디지털 시화 캔버스 레이아웃', link: '/resources#guide' }
    ]
  },
  {
    id: 'oido',
    name: '오이도 패총',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600',
    overview: '서해안 최대 규모의 신석기 시대 야외 패총(조개껍데기 더미)으로, 한반도 중부 서해안의 선사 시대 환경과 생활 양식을 고스란히 간직한 국가 사적 유적지입니다.',
    topic: '신석기 시대 선조들의 삶의 흔적과 식탁 문화를 통한 생활상 복원',
    objectives: [
      '오이도 패총 유물이 지닌 고고학적 중요성과 역사적 보존 가치를 서술한다.',
      '신석기인들의 도구 제작 기법과 채집 및 식생활 양식을 유기적으로 파악한다.',
      '다양한 디지털 협업 툴과 스토리 보드를 가동하여 오이도의 선사 역사를 카드뉴스로 구현할 수 있다.'
    ],
    inquiryQuestions: [
      '수천 년 전 선조들이 먹고 남긴 조개껍데기 쓰레기 더미가 어떻게 오늘날 소중한 역사 보물이 되었을까?',
      '척박한 서해 섬 오이도에서 선조들은 바다 생태계를 어떻게 조화롭게 활용하며 살아갔을까?'
    ],
    activities: [
      { phase: 'M (만남)', session: '1차시', topic: '오이도 조개의 증언', detail: '오이도역사공원 소장 빗살무늬토기와 패총 발굴 전경을 감상하며 호기심 자극하기' },
      { phase: 'A (질문)', session: '2차시', topic: '신석기인의 일상 질문', detail: '선조들의 수렵 채집 기구 종류와 당시 바다 깊이에 관한 추측 질문 작성하기' },
      { phase: 'K (이해)', session: '3차시', topic: '고고학 과학 수사대', detail: '패총에 묻힌 탄화된 흔적 분석 방식을 조사하고 토기 무늬의 기하학적 양식 분석하기' },
      { phase: 'E (표현)', session: '4-5차시', topic: '신석기 하루 카드뉴스 제작', detail: '가상 인공지능 그래픽 도구를 이용해 오이도 소년의 하루를 그린 타임라인 카드뉴스 창작하기' },
      { phase: 'R (연결)', session: '6차시', topic: '가상 박물관 도슨트 피칭', detail: '작성한 디지털 유물 카드를 상호 교환 전시하고 퀴즈 게임을 통해 학급원과 소통하기' }
    ],
    studentOutputsDesc: '신석기 시대로 시공간을 초월해 날아간 학생들이 스스로 신석기 고고학자가 되어 창작한 ‘오이도 소년 오이의 모험’ 웹툰과 빗살무늬토기 3D 디자인 기획 결과물입니다.',
    studentOutputsLink: '/heritage-archive?heritage=오이도 패총',
    lessonMaterials: [
      { title: '오이도 패총 및 석기 제작 체험 활동지', link: '/resources#activity' },
      { title: '신석기 시대 기하학 무늬 탐구 PPT', link: '/resources#lesson' },
      { title: '역사 카드뉴스 디자인 편집 매뉴얼', link: '/resources#guide' }
    ]
  },
  {
    id: 'gunja',
    name: '군자봉 성황제',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=600',
    overview: '천 년의 유구한 세월 동안 계승된 시흥의 대표적 무형문화유산으로, 군자봉 정산의 서낭당에서 마을의 평안과 주민 상호 간의 안녕, 상생을 기원하던 공동체 축제입니다.',
    topic: '공동체 신앙과 향토 민속 축제에 담긴 상생과 협동 문화의 현대적 이해',
    objectives: [
      '군자봉 성황제의 역사적 유래와 공동체 무형 유산으로서의 가치를 설명한다.',
      '향토 역사 속 전설과 민속 신앙의 어울림 구조를 이해한다.',
      '현대 학생들이 공감하는 공동체 단합과 평화의 메시지를 가상 민속 콘텐츠로 발신할 수 있다.'
    ],
    inquiryQuestions: [
      '눈에 보이지 않는 마음의 소망과 화합을 선조들은 왜 성황제라는 의례를 통해 기록해 왔을까?',
      '점차 파편화되는 현대 다문화 도심 사회에서 조상들의 평화 기원 정신을 어떻게 적용할 수 있을까?'
    ],
    activities: [
      { phase: 'M (만남)', session: '1차시', topic: '민속 장단과의 조우', detail: '군자봉 성황제 길놀이 영상과 전통 농악 악기 연주음을 청취하며 신명 나는 문화 만나기' },
      { phase: 'A (질문)', session: '2차시', topic: '천 년의 나무 서낭 질문', detail: '축제가 지속된 원동력과 경순왕 전설의 기원에 관한 비판적 질문 설계하기' },
      { phase: 'K (이해)', session: '3차시', topic: '공동체 상생 문화 탐구', detail: '성황제가 지닌 화합의 순기능과 마을 단위 풍속, 사료 속 전승 전단 해독하기' },
      { phase: 'E (표현)', session: '4-5차시', topic: '디지털 민속 축제 디자인', detail: '가상 성황제 캐릭터를 구상하고 AI 작편곡 도구를 사용해 퓨전 국악 평화 기원 음악 제작하기' },
      { phase: 'R (연결)', session: '6차시', topic: '우리 학급 평화 기원 선언', detail: '소망 엽서와 가상 성황제 초대 포스터를 공유 채널에 올려 온·오프라인 소통 실천하기' }
    ],
    studentOutputsDesc: '마을 수호신과 경순왕 설화를 재해석하여 학생들이 팀 프로젝트로 완성한 현대식 성황제 캐릭터 스티커, 평화 기원 메시지 오디오 가곡, 축제 홍보 포스터 아카이브입니다.',
    studentOutputsLink: '/heritage-archive?heritage=군자봉성황제',
    lessonMaterials: [
      { title: '군자봉 설화 및 민속 신앙 탐구지', link: '/resources#activity' },
      { title: '한국의 무형문화재 보존 중요성 지도안', link: '/resources#lesson' },
      { title: '오디오 및 캐릭터 일러스트 가이드', link: '/resources#guide' }
    ]
  },
  {
    id: 'neunggok',
    name: '능곡 선사유적지',
    image: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?auto=format&fit=crop&q=80&w=600',
    overview: '시흥 능곡택지개발지구 조성 과정에서 대규모로 발굴된 청동기 시대 주거 유적지로, 아파트 단지 한가운데 보존되어 일상과 역사가 어우러진 특별한 상생 공원입니다.',
    topic: '청동기 주거 문화의 기술력과 도심 속 역사 유적 보존의 균형',
    objectives: [
      '능곡동 선사유적지 청동기 움집의 하부 구조와 독특한 배수 과학을 이해한다.',
      '신도시 주택 지구와 고대 움집 유적공원의 상생적 조화 방안을 토의한다.',
      '디지털 3D 가상 공간 렌더링 도구를 활용해 청동기 시대 마을 조감도를 복원해 낼 수 있다.'
    ],
    inquiryQuestions: [
      '선조들은 왜 수천 년 전 능곡동 구릉지에 모여 마을 공동체를 꾸리기 시작했을까?',
      '첨단 아파트 숲으로 가득 찬 신도시 한가운데 청동기 움집 터가 남겨진 진정한 가치는 무엇일까?'
    ],
    activities: [
      { phase: 'M (만남)', session: '1차시', topic: '도심 속의 과거 여행', detail: '능곡공원 한가운데 움집 주거 모형과 신도시 전경이 오버랩된 시청각 자료 분석하기' },
      { phase: 'A (질문)', session: '2차시', topic: '선사 주거 과학 질문', detail: '움집 지붕의 각도 설계와 내부 난방 배치에 관한 건축 공학적 질문 구상하기' },
      { phase: 'K (이해)', session: '3차시', topic: '청동기 농경과 정착 생활', detail: '반달돌칼을 활용한 수확 기법 및 움집 터 기둥 배치를 통한 공간 분할 원리 이해하기' },
      { phase: 'E (표현)', session: '4-5차시', topic: '3D 가상 움집 조감도', detail: '생성형 조감 기법이나 가상 그래픽 툴을 조율해 고대 능곡 선사마을 상상 3D 복원도 그리기' },
      { phase: 'R (연결)', session: '6차시', topic: '미래 상생 정주 도시 기획', detail: '‘역사가 숨 쉬는 스마트 도시’ 콘셉트 제안서를 발표하고 상호 피드백 수렴하기' }
    ],
    studentOutputsDesc: '도심 속 역사 공원을 관찰하며 학생들이 가상 3D 공간 디자이너가 되어 협업 디자인한 능곡 청동기 스마트 선사마을 조감도와 움집 가상 도슨트 가이드 팸플릿입니다.',
    studentOutputsLink: '/heritage-archive?heritage=능곡선사유적지',
    lessonMaterials: [
      { title: '청동기 주거 과학과 단열 원리 활동지', link: '/resources#activity' },
      { title: '도심 역사유적 보존 조례 탐구 교재', link: '/resources#lesson' },
      { title: '3D 가상 디자인 도구 실무 매뉴얼', link: '/resources#guide' }
    ]
  },
  {
    id: 'gaetgol',
    name: '갯골·염전',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
    overview: '내륙 깊숙이 들어오는 세계적으로 희귀한 사행성 내만 갯벌과 근대 소금 산업의 산실인 소래염전 소금창고가 보존된 시흥 최고의 생태 및 산업 헤리티지 공간입니다.',
    topic: '바람과 햇빛이 만드는 천일염과 갯벌 생태 환경 보존',
    objectives: [
      '내만 갯골의 조수 지형적 특징과 생태 다양성의 가치를 체계적으로 기술한다.',
      '증발식 천일염 생산의 물리학적 원리와 염부들의 역사적 삶의 궤적을 규명한다.',
      '디지털 일러스트 및 맵핑 기술을 가동해 갯골 생태 안전 지도를 직접 작성할 수 있다.'
    ],
    inquiryQuestions: [
      '바람과 강렬한 햇빛, 그리고 서해의 소금물은 어떻게 황금보다 귀한 천일염 결정으로 변할까?',
      '근대 노동의 땀이 서려 있는 구식 소금창고를 우리는 미래 세대를 위해 어떻게 지키고 가꾸어야 할까?'
    ],
    activities: [
      { phase: 'M (만남)', session: '1차시', topic: '바람 부는 갯골 소리', detail: '갯골 생태공원의 붉은발농게 등 갯벌 생물군 이미지와 바람 부는 소금창고 음향 만끽하기' },
      { phase: 'A (질문)', session: '2차시', topic: '소금과 습지의 의문', detail: '소금 채취 기구의 변화 및 나무 소금창고의 특수 내부 구조에 대한 핵심 탐구 질문 수집하기' },
      { phase: 'K (이해)', session: '3차시', topic: '열역학과 소래염전 역사', detail: '바닷물이 천일염 소금 결정이 되는 증발 공학적 원리와 소래염전의 태동 과정 이해하기' },
      { phase: 'E (표현)', session: '4-5차시', topic: '디지털 생태 인터랙티브 지도', detail: '인공지능 툴을 이용해 갯골의 주요 동식물 아이콘을 렌더링하고, 나만의 갯골 생태 맵 그리기' },
      { phase: 'R (연결)', session: '6차시', topic: '환경 선언문 및 가상 공유', detail: '학급 습지 보존 선언문을 선포하고, 가상 지도를 모바일 공유해 시민들에게 생태 가치 홍보하기' }
    ],
    studentOutputsDesc: '람사르 습지로 등록된 갯골을 지키기 위해 학생들이 직접 제작한 생태 도감 일러스트, 소금 창고 디자인 인포그래픽 포스터, 내만 갯골 생태 보존 제안 보고서입니다.',
    studentOutputsLink: '/heritage-archive?heritage=갯골·염전',
    lessonMaterials: [
      { title: '천일염 증발 결정 원리 과학 실험지', link: '/resources#activity' },
      { title: '근대 시흥 소래염전 산업사 수업안', link: '/resources#lesson' },
      { title: '생태 지도 디자인 제작 양식 가이드', link: '/resources#guide' }
    ]
  },
  {
    id: 'saenggeumjib',
    name: '생금집',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=600',
    overview: '시흥시 죽율동의 전통 가옥으로, 마당과 온돌방, 대청마루가 조화로운 전통적 한옥 구조 아래 ‘마루 밑에 살던 황금 닭’의 훈훈한 보은 전설이 전해져 내려오는 장소입니다.',
    topic: '한옥의 건축적 특징 탐구와 황금 닭 전설의 현대적 문학 재해석',
    objectives: [
      '생금집 전통 한옥의 ㄴ자형 안채 구조와 자연친화적 건축 요소의 쓰임새를 분석한다.',
      '황금 닭 전설 속 나눔과 상생, 성실의 교훈을 인문적으로 탐색한다.',
      'AI 문장 생성과 멀티미디어를 결합하여 생금집 황금 닭 구연동화를 창작할 수 있다.'
    ],
    inquiryQuestions: [
      '한옥의 시원한 대청마루 아래 서려 있는 황금 닭 전설은 오늘을 사는 우리에게 어떤 교훈과 나눔의 위안을 줄까?',
      '흙과 기와, 나무 등 자연에서 온 소재로 구색된 생금집 한옥 안에서 어떤 생활의 과학을 발견할 수 있을까?'
    ],
    activities: [
      { phase: 'M (만남)', session: '1차시', topic: '생금집 대청마루와 닭털', detail: '생금집 마당 사진과 옛 김씨 가문 사랑채에 숨겨진 황금 닭 전설 일러스트 시각 자료 탐색하기' },
      { phase: 'A (질문)', session: '2차시', topic: '전설의 참된 가치 질문', detail: '선조들은 왜 황금이 아닌 ‘황금 닭털 전설’을 만들고 이웃과 나누려 했을까 질문하기' },
      { phase: 'K (이해)', session: '3차시', topic: '한옥 건축과 순환 원리', detail: '한옥의 대청마루 바람 통로와 구들장 온돌의 공기 대류 열 과학 원리 이해하기' },
      { phase: 'E (표현)', session: '4-5차시', topic: '디지털 구연동화책 창작', detail: 'AI 일러스트 도구로 희망 가치 스토리를 구체화하고, 가상 구연동화 녹음 및 디지털 동화책 제작하기' },
      { phase: 'R (연결)', session: '6차시', topic: '희망 전설 갤러리 아카이브', detail: '가상 생금집 도화 전시장 링크를 학급에 배포하고 따뜻한 격려 피드백 카드 교환하기' }
    ],
    studentOutputsDesc: '황금 닭의 전설을 아름답게 계승하기 위해 학생들이 인공지능 보조 화가와 합심하여 제작한 생금집 구연동화 음성 파일, 한옥 통풍 대류 원리 도해 카드, 희망 나눔 디자인 굿즈 시안입니다.',
    studentOutputsLink: '/heritage-archive?heritage=생금집',
    lessonMaterials: [
      { title: '생금집 한옥 공학적 설계 탐색 학습지', link: '/resources#activity' },
      { title: '황금 닭 설화 인성 및 희망 나눔 수업안', link: '/resources#lesson' },
      { title: 'AI 구연동화 녹음 및 오디오 템플릿', link: '/resources#guide' }
    ]
  }
];

export default function HeritageMainPage() {
  const [selectedHeritageId, setSelectedHeritageId] = useState<string>('hozobeol');

  const activeDetail = HERITAGE_CLASS_DATA.find(h => h.id === selectedHeritageId) || HERITAGE_CLASS_DATA[0];

  return (
    <div className="min-h-screen bg-hanji-50 pb-24 font-serif">
      {/* Top Header Spacing - compensating for Layout header */}
      <div className="pt-20" />

      {/* Hero Header Section */}
      <div className="relative py-16 px-4 bg-[#FCFAF5] border-b border-[#EADFCB]/30 overflow-hidden text-center">
        <div className="hanji-texture absolute inset-0 opacity-15 pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-xs text-[#8C6239] font-serif uppercase tracking-[0.3em] font-bold block whitespace-nowrap break-keep">
            CULTURAL HERITAGE M.A.K.E.R CLASSROOM
          </span>
          <h1 
            className="text-3xl md:text-4xl font-serif text-[#1A1A1A] font-bold tracking-tight"
            style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
          >
            3-2. 문화유산 M.A.K.E.R 수업의 실제
          </h1>
          <div className="h-0.5 w-16 bg-[#8C6239]/40 mx-auto" />
          <p className="text-sm text-zinc-650 max-w-2xl mx-auto leading-relaxed break-keep font-sans">
            시흥 지역의 소중한 7대 지역문화유산을 연계한 실제 프로젝트 수업의 전체 단계와 차시 활동, 학생 활동 결과물 및 수업지도안을 한눈에 보실 수 있습니다.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 space-y-12">
        {/* Prominent Select Buttons Grid (7 Heritages) */}
        <div className="space-y-4 text-center">
          <span className="text-xs text-[#8C6239] font-bold tracking-widest uppercase font-sans">지역문화유산 선택</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {HERITAGE_CLASS_DATA.map((heritage) => {
              const isActive = heritage.id === selectedHeritageId;
              return (
                <button
                  key={heritage.id}
                  onClick={() => setSelectedHeritageId(heritage.id)}
                  className={`px-4 py-4 rounded-sm border text-xs sm:text-sm font-bold font-serif cursor-pointer tracking-wider transition-all duration-300 shadow-xs flex flex-col items-center justify-center space-y-1 ${
                    isActive 
                      ? 'bg-[#8C6239] border-[#8C6239] text-white shadow-md scale-103' 
                      : 'bg-white border-[#EADFCB] text-zinc-700 hover:border-[#8C6239] hover:bg-[#FCFAF5]'
                  }`}
                >
                  <Compass className={`w-4 h-4 mb-1 transition-transform ${isActive ? 'rotate-45 text-white' : 'text-[#8C6239]/60'}`} />
                  <span>{heritage.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Expansive Detail Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDetail.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-[#EADFCB]/50 shadow-sm p-6 md:p-12 space-y-12 relative overflow-hidden rounded-sm text-left"
          >
            <div className="hanji-texture absolute inset-0 opacity-5 pointer-events-none" />

            {/* Header / Intro block */}
            <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10 border-b border-zinc-100 pb-8">
              {/* Left thumbnail */}
              <div className="w-full lg:w-1/3 aspect-[4/3] bg-stone-100 border border-zinc-200 overflow-hidden rounded-sm relative shadow-xs">
                <img 
                  src={activeDetail.image} 
                  alt={activeDetail.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#8C6239] text-white font-serif text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-widest font-bold">
                  Active Site
                </div>
              </div>
              {/* Right core outline */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-2 text-[#8C6239]">
                  <Compass className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest font-sans">1. 문화유산 한눈에 보기</span>
                </div>
                <h2 className="text-3xl font-bold font-serif text-[#1A1A1A]">
                  시흥 {activeDetail.name} 프로젝트
                </h2>
                <div className="h-0.5 w-12 bg-[#8C6239]/40" />
                <p className="text-sm md:text-base text-zinc-700 leading-relaxed font-sans break-keep">
                  {activeDetail.overview}
                </p>
              </div>
            </div>

            {/* Topics, Objectives & Questions Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 pt-4">
              {/* Left side: Topics & Objectives */}
              <div className="space-y-6">
                {/* 2. 학습 주제 */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[#8C6239] border-b border-zinc-100 pb-2">
                    <BookOpen className="w-4.5 h-4.5" />
                    <h3 className="text-base font-bold font-serif">2. 학습 주제</h3>
                  </div>
                  <div className="bg-[#FAF8F5] border-l-4 border-[#8C6239] p-4 text-sm text-zinc-800 font-sans font-medium break-keep">
                    {activeDetail.topic}
                  </div>
                </div>

                {/* 3. 학습 목표 */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[#8C6239] border-b border-zinc-100 pb-2">
                    <Target className="w-4.5 h-4.5" />
                    <h3 className="text-base font-bold font-serif">3. 학습 목표</h3>
                  </div>
                  <ul className="space-y-2.5 pl-1.5 pt-1">
                    {activeDetail.objectives.map((obj, i) => (
                      <li key={i} className="text-xs sm:text-sm text-zinc-600 font-sans flex items-start space-x-2 leading-relaxed">
                        <span className="text-[#8C6239] font-bold shrink-0 mt-1">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right side: 4. 핵심 탐구 질문 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-[#8C6239] border-b border-zinc-100 pb-2">
                  <HelpCircle className="w-4.5 h-4.5" />
                  <h3 className="text-base font-bold font-serif">4. 핵심 탐구 질문</h3>
                </div>
                <div className="space-y-3 pt-1">
                  {activeDetail.inquiryQuestions.map((q, i) => (
                    <div key={i} className="p-5 bg-[#FCFAF5] border border-[#EADFCB]/30 rounded-sm font-serif italic text-zinc-700 text-sm md:text-base leading-relaxed flex items-start space-x-3">
                      <span className="text-lg text-[#8C6239] font-serif font-bold shrink-0">Q{i + 1}.</span>
                      <span className="break-keep">"{q}"</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. M.A.K.E.R 단계별 차시 활동 */}
            <div className="space-y-4 relative z-10 pt-4">
              <div className="flex items-center space-x-2 text-[#8C6239] border-b border-zinc-100 pb-2">
                <ClipboardList className="w-5 h-5" />
                <h3 className="text-base md:text-lg font-bold font-serif">5. M.A.K.E.R 단계별 차시 활동</h3>
              </div>
              
              {/* Responsive Table for Activities */}
              <div className="overflow-x-auto border border-zinc-200 rounded-sm">
                <table className="min-w-full divide-y divide-zinc-200 text-left font-sans text-xs sm:text-sm">
                  <thead className="bg-[#FAF8F5] text-zinc-700 font-serif font-bold">
                    <tr>
                      <th scope="col" className="px-4 py-3 border-r border-zinc-200 w-[120px] text-center">프로젝트 단계</th>
                      <th scope="col" className="px-4 py-3 border-r border-zinc-200 w-[100px] text-center">권장 차시</th>
                      <th scope="col" className="px-4 py-3 border-r border-zinc-200 w-[200px] text-left">활동 주제</th>
                      <th scope="col" className="px-4 py-3 text-left">활동 상세 내용</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-zinc-150 text-zinc-650">
                    {activeDetail.activities.map((act, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3.5 border-r border-zinc-200 font-bold text-center text-[#8C6239] whitespace-nowrap">{act.phase}</td>
                        <td className="px-4 py-3.5 border-r border-zinc-200 text-center font-serif text-zinc-500 whitespace-nowrap">{act.session}</td>
                        <td className="px-4 py-3.5 border-r border-zinc-200 font-bold text-zinc-800 break-keep">{act.topic}</td>
                        <td className="px-4 py-3.5 leading-relaxed break-keep">{act.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Split row for 6. 학생 활동 결과물 & 7. 수업 자료 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 pt-4">
              {/* 6. 학생 활동 결과물 */}
              <div className="bg-[#FAF8F5] border border-[#EADFCB]/40 p-6 md:p-8 rounded-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-[#8C6239]">
                    <Award className="w-5 h-5" />
                    <h3 className="text-base font-bold font-serif">6. 학생 활동 결과물</h3>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed font-sans break-keep pt-1">
                    {activeDetail.studentOutputsDesc}
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-100">
                  <Link 
                    to={activeDetail.studentOutputsLink}
                    className="w-full py-3 bg-[#8C6239] hover:bg-[#6D4926] text-white font-serif text-xs font-bold uppercase tracking-widest transition-all rounded-xs shadow-xs text-center inline-flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>{activeDetail.name} 아카이브 바로가기</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* 7. 수업 자료 */}
              <div className="bg-white border border-zinc-200 p-6 md:p-8 rounded-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-[#8C6239]">
                    <FileText className="w-5 h-5" />
                    <h3 className="text-base font-bold font-serif">7. 수업 자료</h3>
                  </div>
                  <div className="space-y-2 pt-1">
                    {activeDetail.lessonMaterials.map((material, idx) => (
                      <Link 
                        key={idx}
                        to={material.link}
                        className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 border border-zinc-150 rounded-xs transition-colors group/item"
                      >
                        <span className="text-xs text-zinc-700 font-sans font-medium">{material.title}</span>
                        <ChevronRight className="w-4 h-4 text-zinc-400 group-hover/item:translate-x-0.5 group-hover/item:text-[#8C6239] transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-[10px] text-zinc-400 font-sans italic text-center">
                    * 위 링크를 통해 과목별 상세 지도안 및 교육용 활동지 보관함으로 신속히 이동합니다.
                  </p>
                </div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
