import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle, ChevronRight, X, Clock, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

interface LearningItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  makerStage?: string;
  summary?: string;
  majorActivities?: string[];
  warnings?: string[];
  toolType?: string;
}

const DEFAULT_BASIC1_LEARNING: LearningItem[] = [
  {
    id: 'seed-1',
    title: '[E:표현] 구글 디지털 기초 - 크롬 배경화면 적용하기',
    description: '크롬 새 탭 화면에서 원하는 배경화면과 테마를 선택하고 자신만의 학습 환경을 구성합니다.',
    category: '기본1 (기초)',
    makerStage: 'E:표현',
    toolType: '구글 기반 디지털·협업 기초',
    majorActivities: [
      '크롬 새 탭 열기',
      '크롬 맞춤설정 메뉴 찾기',
      '제공되는 배경화면 선택하기',
      '개인 이미지 배경으로 적용하기',
      '테마 변경하기',
      '기본 배경화면으로 되돌리기'
    ]
  },
  {
    id: 'seed-2',
    title: '[K:이해] 구글 디지털 기초 - 크롬 웹스토어 광고 차단 기능 설치하기',
    description: '크롬 웹스토어에서 광고 차단 확장 프로그램을 검색하고 프로그램의 정보와 권한을 확인한 후 안전하게 설치합니다.',
    category: '기본1 (기초)',
    makerStage: 'K:이해',
    toolType: '구글 기반 디지털·협업 기초',
    majorActivities: [
      '크롬 웹스토어 접속하기',
      '광고 차단 확장 프로그램 검색하기',
      '프로그램 개발자와 사용자 평가 확인하기',
      '확장 프로그램이 요구하는 권한 확인하기',
      '확장 프로그램 설치하기',
      '광고 차단 기능 켜기와 끄기',
      '특정 사이트에서 기능 해제하기',
      '확장 프로그램 삭제하기'
    ],
    warnings: [
      '학교 또는 기관에서 허용한 확장 프로그램만 설치하도록 안내해 주세요.',
      '과도한 개인정보 접근 권한을 요구하는 확장 프로그램은 설치하지 않도록 안내해 주세요.'
    ]
  },
  {
    id: 'seed-3',
    title: '[E:표현] 구글 디지털 기초 - 크롬 웹스토어에서 마우스 커서 바꾸기',
    description: '크롬 웹스토어에서 마우스 커서 확장 프로그램을 찾아 원하는 모양으로 변경하고 기본 커서로 복원합니다.',
    category: '기본1 (기초)',
    makerStage: 'E:표현',
    toolType: '구글 기반 디지털·협업 기초',
    majorActivities: [
      '마우스 커서 확장 프로그램 검색하기',
      '확장 프로그램의 정보와 권한 확인하기',
      '원하는 커서 선택하기',
      '커서 크기 변경하기',
      '커서의 가독성 비교하기',
      '기본 커서로 복원하기',
      '사용하지 않는 확장 프로그램 삭제하기'
    ],
    warnings: [
      '움직임이 지나치게 많거나 글자와 버튼을 가리는 커서는 사용하지 않도록 안내해 주세요.'
    ]
  },
  {
    id: 'seed-4',
    title: '[M:만남] 구글 디지털 기초 - 크롬 브라우저 기본 기능 익히기',
    description: '크롬 브라우저의 주소창, 탭, 북마크, 다운로드와 방문 기록 등 기본 기능을 살펴보고 직접 사용합니다.',
    category: '기본1 (기초)',
    makerStage: 'M:만남',
    toolType: '구글 기반 디지털·협업 기초',
    majorActivities: [
      '주소창과 검색창 사용하기',
      '새 탭과 새 창 열기',
      '탭 이동과 닫기',
      '이전 페이지와 다음 페이지 이동하기',
      '북마크 추가하기',
      '북마크 정리하기',
      '다운로드 파일 확인하기',
      '방문 기록 확인하기'
    ]
  },
  {
    id: 'seed-5',
    title: '[A:질문] 구글 디지털 기초 - 구글 검색어와 질문 만들기',
    description: '찾고 싶은 내용을 질문으로 바꾸고 핵심 단어를 선택하여 구글에서 필요한 정보를 검색합니다.',
    category: '기본1 (기초)',
    makerStage: 'A:질문',
    toolType: '구글 기반 디지털·협업 기초',
    majorActivities: [
      '궁금한 내용을 질문 문장으로 작성하기',
      '질문에서 핵심 단어 찾기',
      '길고 모호한 검색어를 짧고 구체적으로 바꾸기',
      '검색어에 따른 결과 비교하기',
      '이미지 검색하기',
      '동영상 검색하기',
      '검색어를 수정해 다시 검색하기'
    ]
  },
  {
    id: 'seed-6',
    title: '[K:이해] 구글 디지털 기초 - 검색 결과와 정보의 신뢰성 확인하기',
    description: '구글 검색 결과에서 광고와 일반 검색 결과를 구분하고 작성자, 운영 기관, 작성 날짜와 출처를 확인합니다.',
    category: '기본1 (기초)',
    makerStage: 'K:이해',
    toolType: '구글 기반 디지털·협업 기초',
    majorActivities: [
      '광고와 일반 검색 결과 구분하기',
      '사이트 운영 기관 확인하기',
      '글의 작성자 확인하기',
      '작성 날짜와 수정 날짜 확인하기',
      '여러 검색 결과 비교하기',
      '공식 기관 자료 찾기',
      '이미지와 자료의 출처 기록하기',
      '확인되지 않은 정보를 그대로 사용하지 않기'
    ]
  },
  {
    id: 'seed-7',
    title: '[M:만남] 구글 디지털 기초 - 구글 드라이브 시작하기',
    description: '구글 드라이브의 기본 화면을 살펴보고 파일과 폴더를 만들고 관리하는 기본 방법을 익힙니다.',
    category: '기본1 (기초)',
    makerStage: 'M:만남',
    toolType: '구글 기반 디지털·협업 기초',
    majorActivities: [
      '구글 드라이브 화면 살펴보기',
      '새 폴더 만들기',
      '파일 업로드하기',
      '파일 다운로드하기',
      '파일 이름 변경하기',
      '파일 이동하기',
      '파일 삭제하기',
      '휴지통에서 파일 복원하기'
    ]
  },
  {
    id: 'seed-8',
    title: '[K:이해] 구글 디지털 기초 - 구글 드라이브 자료 정리하기',
    description: '수업과 프로젝트별로 폴더를 만들고 일정한 파일 이름 규칙을 적용하여 자료를 체계적으로 정리합니다.',
    category: '기본1 (기초)',
    makerStage: 'K:이해',
    toolType: '구글 기반 디지털·협업 기초',
    majorActivities: [
      '수업별 폴더 만들기',
      '프로젝트별 하위 폴더 만들기',
      '문서, 이미지와 영상 파일 구분하기',
      '파일 이름 규칙 정하기',
      '중복 파일 확인하기',
      '최근 문서 기능 사용하기',
      '별표 기능 사용하기'
    ]
  },
  {
    id: 'seed-9',
    title: '[R:연결] 구글 디지털 기초 - 파일 공유와 권한 설정하기',
    description: '구글 드라이브에서 보기, 댓글과 편집 권한의 차이를 이해하고 파일을 안전하게 공유합니다.',
    category: '기본1 (기초)',
    makerStage: 'R:연결',
    toolType: '구글 기반 디지털·협업 기초',
    majorActivities: [
      '특정 사용자와 파일 공유하기',
      '보기 권한 설정하기',
      '댓글 권한 설정하기',
      '편집 권한 설정하기',
      '링크 공유 범위 확인하기',
      '공유 권한 변경하기',
      '잘못 설정한 공유 권한 해제하기',
      '공유된 파일 확인하기'
    ],
    warnings: [
      '개인정보가 포함된 파일은 전체 공개 링크로 공유하지 않도록 안내해 주세요.'
    ]
  },
  {
    id: 'seed-10',
    title: '[M:만남] 구글 디지털 기초 - 구글 교육 도구 알아보기',
    description: '구글 문서, 프레젠테이션, 스프레드시트, 설문지, 클래스룸과 미트의 역할과 활용 목적을 살펴봅니다.',
    category: '기본1 (기초)',
    makerStage: 'M:만남',
    toolType: '구글 기반 디지털·협업 기초',
    majorActivities: [
      '구글 문서의 역할 알아보기',
      '구글 프레젠테이션의 역할 알아보기',
      '구글 스프레드시트의 역할 알아보기',
      '구글 설문지의 역할 알아보기',
      '구글 클래스룸의 역할 알아보기',
      '구글 미트의 역할 알아보기',
      '활동 목적에 맞는 구글 도구 선택하기'
    ]
  },
  {
    id: 'seed-11',
    title: '[R:연결] 구글 디지털 기초 - 구글 클래스룸에서 과제 제출하기',
    description: '구글 클래스룸에서 공지와 과제를 확인하고 구글 드라이브 파일을 첨부하여 제출하는 기본 과정을 익힙니다.',
    category: '기본1 (기초)',
    makerStage: 'R:연결',
    toolType: '구글 기반 디지털·협업 기초',
    majorActivities: [
      '클래스룸 수업 화면 확인하기',
      '공지 확인하기',
      '수업 자료 열기',
      '과제 내용 확인하기',
      '과제 마감일 확인하기',
      '구글 드라이브 파일 첨부하기',
      '과제 제출하기',
      '제출 취소와 재제출 알아보기',
      '교사 피드백 확인하기'
    ]
  },
  {
    id: 'seed-12',
    title: '[A:질문] 패들렛 - 패들렛에서 AI 그림 아이디어 질문하기',
    description: '교사가 제공한 패들렛 게시판에 접속하여 자신이 만들고 싶은 AI 그림의 주제와 아이디어를 질문 형태로 작성합니다.',
    category: '기본1 (기초)',
    makerStage: 'A:질문',
    toolType: '보조 협업·AI 표현 도구',
    majorActivities: [
      '교사가 공유한 패들렛 게시판 접속하기',
      '패들렛 게시판 구성 살펴보기',
      '만들고 싶은 그림의 주제 생각하기',
      '그림에 등장할 대상 정하기',
      '그림의 배경 정하기',
      '그림의 색상과 분위기 생각하기',
      '궁금한 점과 아이디어를 질문으로 작성하기',
      '친구들의 아이디어 살펴보기'
    ]
  },
  {
    id: 'seed-13',
    title: '[A:질문] 패들렛 - AI 그림 프롬프트 구체화하기',
    description: '만들고 싶은 그림의 주제, 대상, 배경, 색상, 분위기와 표현 방식을 구체적으로 정리하여 AI 이미지 생성용 프롬프트를 작성합니다.',
    category: '기본1 (기초)',
    makerStage: 'A:질문',
    toolType: '보조 협업·AI 표현 도구',
    majorActivities: [
      '그림 주제 정하기',
      '등장 대상 정하기',
      '장소와 배경 정하기',
      '색상 정하기',
      '그림의 분위기 정하기',
      '표현 방식 정하기',
      '짧고 모호한 문장을 구체적인 문장으로 수정하기',
      '완성한 프롬프트를 패들렛 게시물에 기록하기'
    ],
    warnings: [
      '실제 학생이나 교사의 이름을 입력하지 않기',
      '연락처, 주소와 학교명 등 개인정보를 입력하지 않기',
      '실제 인물의 얼굴을 무단으로 생성하지 않기',
      '다른 사람을 조롱하거나 불쾌하게 만드는 내용을 작성하지 않기'
    ]
  }
];

const parseLessonTitle = (fullTitle: string) => {
  let clean = fullTitle.replace(/^\[[^\]]+\]\s*/, '');
  let parts = clean.split(' - ');
  if (parts.length >= 2) {
    return {
      categoryName: parts[0].trim(),
      activityName: parts.slice(1).join(' - ').trim()
    };
  }
  return {
    categoryName: '기본 과정',
    activityName: clean.trim()
  };
};

export default function Basic1Page() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/basics?category=기본1 (기초)', { replace: true });
  }, [navigate]);

  return null;

  const [dbItems, setDbItems] = useState<LearningItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);

  useEffect(() => {
    // Collect from real resources where category corresponds to level 1
    const q1 = query(
      collection(db, 'resources'),
      where('category', 'in', ['기본1 (기초)', '기본1', '기본1(기초)'])
    );

    const unsubscribe = onSnapshot(q1, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LearningItem[];
      setDbItems(fetched);
    });

    return () => unsubscribe();
  }, []);

  const totalItems = (() => {
    // Avoid duplication
    const combined = [...dbItems, ...DEFAULT_BASIC1_LEARNING];
    const unique: LearningItem[] = [];
    const seen = new Set<string>();
    for (const item of combined) {
      const parsed = parseLessonTitle(item.title);
      const uniqueKey = `${parsed.categoryName}-${parsed.activityName}`.toLowerCase();
      if (!seen.has(uniqueKey)) {
        seen.add(uniqueKey);
        unique.push(item);
      }
    }
    return unique;
  })();

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 text-left font-serif">
      {/* Hero Header Section */}
      <section className="relative py-24 bg-zinc-900 text-amber-50 overflow-hidden">
        <div className="hanji-texture absolute inset-0 opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-amber-500/10 rounded-full border border-amber-500/20"
            >
              <BookOpen className="w-12 h-12 text-amber-500" />
            </motion.div>
            <div className="space-y-2">
              <span className="text-amber-500 font-serif tracking-[0.3em] text-[10px] uppercase font-bold block whitespace-nowrap break-keep">
                BASIC 1
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white whitespace-nowrap break-keep">
                기본1
              </h1>
            </div>
            <p className="text-zinc-300 font-sans max-w-2xl mx-auto leading-relaxed text-sm md:text-base break-keep">
              기본1 학습 내용을 차시별로 확인하고 학습 활동에 참여할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content List */}
      <main className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div className="flex items-center space-x-3 pb-3 border-b border-[#EADFCB]/30">
          <span className="w-2.5 h-2.5 bg-[#8C6239] rotate-45 shrink-0" />
          <h2 className="text-2xl font-bold text-zinc-900 whitespace-nowrap break-keep">
            기본1 학습 내용
          </h2>
        </div>

        {totalItems.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#EADFCB]/20 rounded-md">
            <p className="text-zinc-500 font-sans text-sm">기본1 학습 내용은 추후 등록됩니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {totalItems.map((item, idx) => {
              const { categoryName, activityName } = parseLessonTitle(item.title);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 3) * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-[#EADFCB]/30 rounded-xs p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-[#8C6239]/50 transition-all text-left"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono bg-[#8C6239]/10 text-[#8C6239] font-bold px-2 py-0.5 rounded-sm whitespace-nowrap break-keep">
                        {item.makerStage || '기본'}
                      </span>
                      {item.toolType && (
                        <span className="text-[9px] font-sans text-zinc-400 font-medium whitespace-nowrap break-keep">
                          {item.toolType}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="block text-[11px] text-zinc-400 font-sans font-medium whitespace-nowrap break-keep">
                        {categoryName}
                      </span>
                      <h3 className="text-base font-sans font-bold text-zinc-950 line-clamp-1 break-keep leading-tight whitespace-nowrap break-keep">
                        {activityName}
                      </h3>
                    </div>

                    <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed font-sans min-h-[40px] break-keep select-none">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-[#EADFCB]/10">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="w-full py-2 bg-zinc-50 hover:bg-[#8C6239]/10 hover:text-[#8C6239] border border-zinc-200 hover:border-[#8C6239]/30 rounded-xs text-[11px] font-sans font-bold transition-all flex items-center justify-center space-x-2 whitespace-nowrap break-keep cursor-pointer"
                    >
                      <span>활동 상세 확인</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal Detail Dialog */}
      <AnimatePresence>
        {selectedItem && (() => {
          const { categoryName, activityName } = parseLessonTitle(selectedItem.title);
          return (
            <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-[#EADFCB] shadow-2xl w-full max-w-xl rounded-sm overflow-hidden text-left flex flex-col font-sans"
              >
                {/* Modal Header */}
                <div className="bg-[#FCFAF5] p-6 border-b border-[#EADFCB]/40 flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono font-bold bg-[#8C6239] text-white px-2 py-0.5 rounded-sm">
                        {selectedItem.makerStage || '기본1'}
                      </span>
                      {selectedItem.toolType && (
                        <span className="text-[10px] font-sans text-[#8C6239] font-semibold">
                          {selectedItem.toolType}
                        </span>
                      )}
                    </div>
                    <span className="block text-xs text-zinc-400 font-sans">{categoryName}</span>
                    <h3 className="text-xl font-bold text-zinc-950 font-serif whitespace-nowrap break-keep">
                      {activityName}
                    </h3>
                  </div>

                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-1 px-2 border rounded-full bg-white hover:bg-zinc-100 transition-colors cursor-pointer text-zinc-400 hover:text-zinc-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Modal Scroll Content */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">주요 학습 설명</h4>
                    <p className="text-[13.5px] text-zinc-800 leading-relaxed font-light break-keep">
                      {selectedItem.description}
                    </p>
                  </div>

                  {selectedItem.majorActivities && selectedItem.majorActivities.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-[#8C6239] uppercase tracking-wider flex items-center space-x-1.5">
                        <CheckCircle className="w-4 h-4" />
                        <span>차시별 주요 학습 활동</span>
                      </h4>
                      <ul className="text-xs text-zinc-700 space-y-1.5 pl-4 list-decimal marker:text-[#8C6239] font-medium leading-relaxed">
                        {selectedItem.majorActivities.map((act, i) => (
                          <li key={i} className="break-keep">{act}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedItem.warnings && selectedItem.warnings.length > 0 && (
                    <div className="p-4 bg-amber-50/50 border border-amber-500/15 rounded-xs space-y-2">
                      <h4 className="text-xs font-bold text-amber-800 flex items-center space-x-1.5">
                        <AlertCircle className="w-4 h-4" />
                        <span>지도 유의사항 &amp; 안내</span>
                      </h4>
                      <ul className="text-[11.5px] text-amber-900 space-y-1 pl-4 list-disc break-keep">
                        {selectedItem.warnings.map((warn, i) => (
                           <li key={i}>{warn}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="bg-zinc-50 p-4 border-t border-zinc-100 flex justify-end">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold font-sans rounded-xs cursor-pointer whitespace-nowrap break-keep"
                  >
                    확인 완료 (닫기)
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
