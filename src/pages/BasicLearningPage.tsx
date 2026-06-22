import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  User, 
  CheckCircle2, 
  Eye, 
  Plus, 
  X, 
  Trash2, 
  Sparkles, 
  Calendar,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  ChevronDown,
  Clock,
  Home,
  Edit,
  ArrowRight,
  PenTool,
  Code,
  Rocket
} from 'lucide-react';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const cleanActivityTitle = (title: string) => {
  let clean = title.replace(/^\[[^\]]+\]\s*/, '');
  if (clean.includes(' - ')) {
    const parts = clean.split(' - ');
    clean = parts.slice(1).join(' - ');
  }
  return clean;
};

interface ActivityPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: '기본1 (기초)' | '기본2(중급)' | '기본3(고급)';
  eventDate: string;
  author: string;
  viewCount: number;
  createdAt: any;
  displayDate?: string;
  makerStage?: string;
  heritage?: string;
  summary?: string;
  keywords?: string;
  attachmentUrl?: string;
  dayOfWeek?: string;
  majorActivities?: string[];
  warnings?: string[];
  toolType?: string;
  parentExcerpt?: string;
}

const DEFAULT_PHOTOS: ActivityPhoto[] = [
  {
    id: 'seed-1',
    title: '[E:표현] 구글 디지털 기초 - 크롬 배경화면 적용하기',
    eventDate: '05.13',
    dayOfWeek: '수요일',
    displayDate: '2026-05-13',
    description: '크롬 새 탭 화면에서 원하는 배경화면과 테마를 선택하고 자신만의 학습 환경을 구성합니다.',
    category: '기본1 (기초)',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=800',
    viewCount: 112,
    createdAt: null,
    summary: '크롬 새 탭 화면에서 원하는 배경화면과 테마를 선택하고 자신만의 학습 환경을 구성합니다.',
    keywords: '크롬 배경화면 테마 학습환경',
    makerStage: 'E:표현',
    heritage: '구글 기반 디지털·협업 기초',
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
    eventDate: '05.15',
    dayOfWeek: '금요일',
    displayDate: '2026-05-15',
    description: '크롬 웹스토어에서 광고 차단 확장 프로그램을 검색하고 프로그램의 정보와 권한을 확인한 후 안전하게 설치합니다.',
    category: '기본1 (기초)',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
    viewCount: 142,
    createdAt: null,
    summary: '크롬 웹스토어에서 광고 차단 확장 프로그램을 검색하고 프로그램의 정보와 권한을 확인한 후 안전하게 설치합니다.',
    keywords: '웹스토어 광고차단 확장프로그램',
    makerStage: 'K:이해',
    heritage: '구글 기반 디지털·협업 기초',
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
    eventDate: '05.18',
    dayOfWeek: '월요일',
    displayDate: '2026-05-18',
    description: '크롬 웹스토어에서 마우스 커서 확장 프로그램을 찾아 원하는 모양으로 변경하고 기본 커서로 복원합니다.',
    category: '기본1 (기초)',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800',
    viewCount: 98,
    createdAt: null,
    summary: '크롬 웹스토어에서 마우스 커서 확장 프로그램을 찾아 원하는 모양으로 변경하고 기본 커서로 복원합니다.',
    keywords: '마우스 커서 크롬 웹스토어',
    makerStage: 'E:표현',
    heritage: '구글 기반 디지털·협업 기초',
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
    eventDate: '05.20',
    dayOfWeek: '수요일',
    displayDate: '2026-05-20',
    description: '크롬 브라우저의 주소창, 탭, 북마크, 다운로드와 방문 기록 등 기본 기능을 살펴보고 직접 사용합니다.',
    category: '기본1 (기초)',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    viewCount: 165,
    createdAt: null,
    summary: '크롬 브라우저의 주소창, 탭, 북마크, 다운로드와 방문 기록 등 기본 기능을 살펴보고 직접 사용합니다.',
    keywords: '크롬브라우저 북마크 방문기록',
    makerStage: 'M:만남',
    heritage: '구글 기반 디지털·협업 기초',
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
    eventDate: '05.22',
    dayOfWeek: '금요일',
    displayDate: '2026-05-22',
    description: '찾고 싶은 내용을 질문으로 바꾸고 핵심 단어를 선택하여 구글에서 필요한 정보를 검색합니다.',
    category: '기본1 (기초)',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
    viewCount: 138,
    createdAt: null,
    summary: '찾고 싶은 내용을 질문으로 바꾸고 핵심 단어를 선택하여 구글에서 필요한 정보를 검색합니다.',
    keywords: '구글검색 정보찾기 팩트체크 검색어',
    makerStage: 'A:질문',
    heritage: '구글 기반 디지털·협업 기초',
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
    eventDate: '05.27',
    dayOfWeek: '수요일',
    displayDate: '2026-05-27',
    description: '구글 검색 결과에서 광고와 일반 검색 결과를 구분하고 작성자, 운영 기관, 작성 날짜와 출처를 확인합니다.',
    category: '기본1 (기초)',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
    viewCount: 124,
    createdAt: null,
    summary: '구글 검색 결과에서 광고와 일반 검색 결과를 구분하고 작성자, 운영 기관, 작성 날짜와 출처를 확인합니다.',
    keywords: '신뢰성 신뢰성확인 팩트체크 출처기록',
    makerStage: 'K:이해',
    heritage: '구글 기반 디지털·협업 기초',
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
    eventDate: '05.29',
    dayOfWeek: '금요일',
    displayDate: '2026-05-29',
    description: '구글 드라이브의 기본 화면을 살펴보고 파일과 폴더를 만들고 관리하는 기본 방법을 익힙니다.',
    category: '기본1 (기초)',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80&w=800',
    viewCount: 182,
    createdAt: null,
    summary: '구글 드라이브의 기본 화면을 살펴보고 파일과 폴더를 만들고 관리하는 기본 방법을 익힙니다.',
    keywords: '구글드라이브 클라우드 파일관리',
    makerStage: 'M:만남',
    heritage: '구글 기반 디지털·협업 기초',
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
    eventDate: '06.01',
    dayOfWeek: '월요일',
    displayDate: '2026-06-01',
    description: '수업과 프로젝트별로 폴더를 만들고 일정한 파일 이름 규칙을 적용하여 자료를 체계적으로 정리합니다.',
    category: '기본1 (기초)',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    viewCount: 119,
    createdAt: null,
    summary: '수업과 프로젝트별로 폴더를 만들고 일정한 파일 이름 규칙을 적용하여 자료를 체계적으로 정리합니다.',
    keywords: '자료정리 폴더구조 파일네이밍',
    makerStage: 'K:이해',
    heritage: '구글 기반 디지털·협업 기초',
    majorActivities: [
      '수업별 폴더 만들기',
      '프로젝트별 하위 폴더 만들기',
      '문서, 이미지와 영상 파일 구분하기',
      '파일 이름 규칙 정하기',
      '중복 파일 확인하기',
      '최근 문서 기능 사용하기',
      '별표 기능 사용하기'
    ],
    parentExcerpt: '파일 이름 예시: 학년_반_이름_활동명'
  },
  {
    id: 'seed-9',
    title: '[R:연결] 구글 디지털 기초 - 파일 공유와 권한 설정하기',
    eventDate: '06.05',
    dayOfWeek: '금요일',
    displayDate: '2026-06-05',
    description: '구글 드라이브에서 보기, 댓글과 편집 권한의 차이를 이해하고 파일을 안전하게 공유합니다.',
    category: '기본1 (기초)',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1552664735-8a15d13575f0?auto=format&fit=crop&q=80&w=800',
    viewCount: 144,
    createdAt: null,
    summary: '구글 드라이브에서 보기, 댓글과 편집 권한의 차이를 이해하고 파일을 안전하게 공유합니다.',
    keywords: '파일공유 공유권한 협업도구 안전공유',
    makerStage: 'R:연결',
    heritage: '구글 기반 디지털·협업 기초',
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
    eventDate: '06.08',
    dayOfWeek: '월요일',
    displayDate: '2026-06-08',
    description: '구글 문서, 프레젠테이션, 스프레드시트, 설문지, 클래스룸과 미트의 역할과 활용 목적을 살펴봅니다.',
    category: '기본1 (기초)',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    viewCount: 210,
    createdAt: null,
    summary: '구글 문서, 프레젠테이션, 스프레드시트, 설문지, 클래스룸과 미트의 역할과 활용 목적을 살펴봅니다.',
    keywords: '구글도구 협업도구 스프레드시트 설문지',
    makerStage: 'M:만남',
    heritage: '구글 기반 디지털·협업 기초',
    majorActivities: [
      '구글 문서의 역할 알아보기',
      '구글 프레젠테이션의 역할 알아보기',
      '구글 스프레드시트의 역할 알아보기',
      '구글 설문지의 역할 알아보기',
      '구글 클래스룸의 역할 알아보기',
      '구글 미트의 역할 알아보기',
      '활동 목적에 맞는 구글 도구 선택하기'
    ],
    parentExcerpt: '상세한 문서 제작 실습이 아니라 각 도구의 용도를 이해하는 수준으로 구성해 주세요.'
  },
  {
    id: 'seed-11',
    title: '[R:연결] 구글 디지털 기초 - 구글 클래스룸에서 과제 제출하기',
    eventDate: '06.12',
    dayOfWeek: '금요일',
    displayDate: '2026-06-12',
    description: '구글 클래스룸에서 공지와 과제를 확인하고 구글 드라이브 파일을 첨부하여 제출하는 기본 과정을 익힙니다.',
    category: '기본1 (기초)',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=800',
    viewCount: 189,
    createdAt: null,
    summary: '구글 클래스룸에서 공지와 과제를 확인하고 구글 드라이브 파일을 첨부하여 제출하는 기본 과정을 익힙니다.',
    keywords: '구글클래스룸 과제제출 교사피드백',
    makerStage: 'R:연결',
    heritage: '구글 기반 디지털·협업 기초',
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
    eventDate: '06.15',
    dayOfWeek: '월요일',
    displayDate: '2026-06-15',
    description: '교사가 제공한 패들렛 게시판에 접속하여 자신이 만들고 싶은 AI 그림의 주제와 아이디어를 질문 형태로 작성합니다.',
    category: '기본1 (기초)',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    viewCount: 145,
    createdAt: null,
    summary: '교사가 제공한 패들렛 게시판에 접속하여 자신이 만들고 싶은 AI 그림의 주제와 아이디어를 질문 형태로 작성합니다.',
    keywords: '패들렛 질문 아이디어 주제선정',
    makerStage: 'A:질문',
    heritage: '구글 기반 디지털·협업 기초',
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
    ],
    parentExcerpt: '학생이 직접 새로운 패들렛 게시판을 개설하지 않고 교사가 제공한 게시판에 참여하도록 구성해 주세요.'
  },
  {
    id: 'seed-13',
    title: '[A:질문] 패들렛 - AI 그림 프롬프트 구체화하기',
    eventDate: '06.17',
    dayOfWeek: '수요일',
    displayDate: '2026-06-17',
    description: '만들고 싶은 그림의 주제, 대상, 배경, 색상, 분위기와 표현 방식을 구체적으로 정리하여 AI 이미지 생성용 프롬프트를 작성합니다.',
    category: '기본1 (기초)',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
    viewCount: 162,
    createdAt: null,
    summary: '만들고 싶은 그림의 주제, 대상, 배경, 색상, 분위기와 표현 방식을 구체적으로 정리하여 AI 이미지 생성용 프롬프트를 작성합니다.',
    keywords: '프롬프트 구체화 이미지생성 패들렛',
    makerStage: 'A:질문',
    heritage: '구글 기반 디지털·협업 기초',
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
    ],
    parentExcerpt: '프롬프트 구성: 주제 + 대상 + 배경 + 색상과 분위기 + 표현 방식 / 프롬프트 예시: 우리 지역의 오래된 성곽을 배경으로 어린이들이 전통문화를 체험하는 모습을 밝고 따뜻한 동화책 그림으로 표현해 주세요.'
  },
  {
    id: 'seed-14',
    title: '[E:표현] 패들렛 - 패들렛에서 AI로 그림 그리기',
    eventDate: '06.19',
    dayOfWeek: '금요일',
    displayDate: '2026-06-19',
    description: '작성한 프롬프트를 활용하여 패들렛의 AI 이미지 생성 기능으로 그림을 만들고 생성 결과를 비교하며 프롬프트를 수정합니다.',
    category: '기본1 (기초)',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    viewCount: 178,
    createdAt: null,
    summary: '작성한 프롬프트를 활용하여 패들렛의 AI 이미지 생성 기능으로 그림을 만들고 생성 결과를 비교하며 프롬프트를 수정합니다.',
    keywords: 'AI그림 그림그리기 패들렛 AI생성',
    makerStage: 'E:표현',
    heritage: '구글 기반 디지털·협업 기초',
    toolType: '보조 협업·AI 표현 도구',
    majorActivities: [
      '교사가 제공한 패들렛 게시판 접속하기',
      'AI 이미지 생성 기능 찾기',
      '13차시에서 작성한 프롬프트 입력하기',
      '생성된 AI 그림 확인하기',
      '원했던 결과와 다른 부분 찾기',
      '대상, 배경, 색상과 분위기 수정하기',
      '수정한 프롬프트로 그림 다시 생성하기',
      '여러 생성 결과 비교하기',
      '최종 그림 한 장 선택하기',
      '최종 그림과 사용한 프롬프트 함께 게시하기'
    ],
    warnings: [
      '폭력적이거나 불쾌한 이미지 생성하지 않기',
      '특정 사람을 조롱하거나 왜곡하는 이미지 생성하지 않기',
      '학생 이름, 학교명과 얼굴 사진 등 개인정보 사용하지 않기',
      '저작권이 있는 캐릭터를 그대로 복제하도록 요구하지 않기',
      '생성한 이미지가 사실을 증명하는 자료는 아니라는 점 안내하기'
    ],
    parentExcerpt: '활동 안내 문구: AI가 처음 만든 그림이 항상 가장 적절한 결과는 아닙니다. 원하는 부분과 다른 부분을 찾고 프롬프트를 수정해 보세요. / 패들렛 AI 이미지 생성 기능을 사용할 수 없는 환경이라면 기능이 없는 것처럼 임의 구현하지 말고, 교사가 지정한 대체 AI 이미지 도구에서 생성한 결과를 패들렛에 게시할 수 있도록 안내 영역을 제공해 주세요.'
  },
  {
    id: 'seed-15',
    title: '[R:연결] 패들렛 - AI 그림 전시하고 의견 나누기',
    eventDate: '06.22',
    dayOfWeek: '월요일',
    displayDate: '2026-06-22',
    description: '패들렛 공동 게시판에 완성한 AI 그림과 사용한 프롬프트를 전시하고 친구들의 작품을 감상하며 댓글과 반응으로 의견을 나눕니다.',
    category: '기본1 (기초)',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800',
    viewCount: 194,
    createdAt: null,
    summary: '패들렛 공동 게시판에 완성한 AI 그림과 사용한 프롬프트를 전시하고 친구들의 작품을 감상하며 댓글과 반응으로 의견을 나눕니다.',
    keywords: 'AI전시 전시회 의견나눔 피드백',
    makerStage: 'R:연결',
    heritage: '구글 기반 디지털·협업 기초',
    toolType: '보조 협업·AI 표현 도구',
    majorActivities: [
      '완성한 AI 그림 게시하기',
      '그림 제목 작성하기',
      '사용한 최종 프롬프트 함께 기록하기',
      '처음 프롬프트와 수정한 프롬프트 비교하기',
      '친구들의 AI 그림 감상하기',
      '작품에서 인상적인 부분 찾기',
      '예의 있고 구체적인 댓글 작성하기',
      '반응 기능 사용하기',
      '자신의 그림과 친구의 그림 비교하기',
      'AI가 생성한 부분과 자신이 결정한 부분 구분하기'
    ],
    warnings: [
      '다른 학생의 게시물을 임의로 수정하거나 삭제하지 않기',
      '외모나 실력을 평가하는 댓글 작성하지 않기',
      '개인정보를 댓글에 작성하지 않기',
      '작품과 관련된 구체적인 의견 작성하기'
    ],
    parentExcerpt: '댓글 예시: 그림의 ○○ 부분이 인상적입니다. / 프롬프트에 ○○ 내용을 추가하면 더 잘 표현될 것 같습니다. / 색상과 배경이 그림의 분위기와 잘 어울립니다. / 처음 그림보다 수정한 그림에서 ○○ 부분이 더 잘 나타났습니다.'
  }
];

export default function BasicLearningPage() {
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '전체';
  const [photos, setPhotos] = useState<ActivityPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedMakerStage, setSelectedMakerStage] = useState<string>('전체');
  const [selectedHeritage, setSelectedHeritage] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modal states
  const [activePhoto, setActivePhoto] = useState<ActivityPhoto | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<'기본1 (기초)' | '기본2(중급)' | '기본3(고급)'>('기본1 (기초)');
  const [newAuthor, setNewAuthor] = useState('AI 디지털 소양');
  const [authorSelectType, setAuthorSelectType] = useState('AI 디지털 소양');
  const [newCustomAuthor, setNewCustomAuthor] = useState('');
  const [newMakerStage, setNewMakerStage] = useState('');
  const [newHeritageSelect, setNewHeritageSelect] = useState('AI 드로잉');
  const [newCustomHeritage, setNewCustomHeritage] = useState('');
  const [newDisplayDate, setNewDisplayDate] = useState(new Date().toISOString().split('T')[0]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [formError, setFormError] = useState('');

  // Additional Optional Fields
  const [newSummary, setNewSummary] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [newAttachmentUrl, setNewAttachmentUrl] = useState('');

  // State for editing a post
  const [selectedPost, setSelectedPost] = useState<ActivityPhoto | null>(null);
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  // Form states for editing
  const [editTitle, setEditTitle] = useState('');
  const [editEventDate, setEditEventDate] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<'기본1 (기초)' | '기본2(중급)' | '기본3(고급)'>('기본1 (기초)');
  const [editAuthor, setEditAuthor] = useState('');
  const [editDisplayDate, setEditDisplayDate] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editMakerStage, setEditMakerStage] = useState('');
  const [editHeritage, setEditHeritage] = useState('');
  
  // Additional Optional Fields for editing
  const [editSummary, setEditSummary] = useState('');
  const [editKeywords, setEditKeywords] = useState('');
  const [editAttachmentUrl, setEditAttachmentUrl] = useState('');

  useEffect(() => {
    if (selectedPost) {
      setEditTitle(selectedPost.title);
      setEditEventDate(selectedPost.eventDate);
      setEditDescription(selectedPost.description);
      setEditCategory(selectedPost.category);
      setEditAuthor(selectedPost.author);
      setEditImageUrl(selectedPost.imageUrl);
      setEditDisplayDate(selectedPost.displayDate || new Date().toISOString().split('T')[0]);
      setEditMakerStage(selectedPost.makerStage || '');
      setEditHeritage(selectedPost.heritage || '');
      setEditSummary(selectedPost.summary || '');
      setEditKeywords(selectedPost.keywords || '');
      setEditAttachmentUrl(selectedPost.attachmentUrl || '');
      setEditImageFile(null);
    }
  }, [selectedPost]);

  // Fetch photos from Firestore
  useEffect(() => {
    const q = query(collection(db, 'activity_photos'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((photo: any) => {
          const toExclude = ['유아교육과', '스승의 날', '엠티', 'student_council'];
          const titleContains = photo.title && toExclude.some(term => photo.title.toLowerCase().includes(term.toLowerCase()));
          const descContains = photo.description && toExclude.some(term => photo.description.toLowerCase().includes(term.toLowerCase()));
          const authorContains = photo.author && toExclude.some(term => photo.author.toLowerCase().includes(term.toLowerCase()));
          return !titleContains && !descContains && !authorContains;
        }) as ActivityPhoto[];
      
      setPhotos(fetched);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error loading activity photos:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Auto trigger upload modal and sync category filter if parameters are passed
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'upload') {
      setShowUploadModal(true);
    }
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Handle Incremental View Count
  const handleViewDetails = async (photo: ActivityPhoto) => {
    setActivePhoto(photo);
    if (!photo.id.startsWith('seed-')) {
      try {
        const photoRef = doc(db, 'activity_photos', photo.id);
        await updateDoc(photoRef, {
          viewCount: photo.viewCount + 1
        });
      } catch (e) {
        console.warn("Could not increment view count", e);
      }
    } else {
      setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, viewCount: p.viewCount + 1 } : p));
    }
  };

  // Seeding trigger if collection is empty
  const handleSeedSamples = async () => {
    setUploadProgress(true);
    try {
      const batch = writeBatch(db);
      DEFAULT_PHOTOS.forEach((photo) => {
        const newDocRef = doc(collection(db, 'activity_photos'));
        batch.set(newDocRef, {
          title: photo.title,
          eventDate: photo.eventDate,
          description: photo.description,
          category: photo.category === '기본2(중급)' as any ? '기본2(중급)' : photo.category === '기본3(고급)' as any ? '기본3(고급)' : photo.category,
          author: photo.author,
          imageUrl: photo.imageUrl,
          viewCount: photo.viewCount,
          createdAt: serverTimestamp()
        });
      });
      await batch.commit();
      alert('샘플 활동사진 데이터 3건이 성공적으로 DB에 등록되었습니다!');
    } catch (e: any) {
      alert('오류 발생: ' + e.message);
    } finally {
      setUploadProgress(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('파일을 읽는 데 실패했습니다.'));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Upload Logic
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setUploadProgress(true);

    if (!newTitle.trim()) {
      setFormError('제목을 입력해주세요.');
      setUploadProgress(false);
      return;
    }
    if (!newEventDate.trim()) {
      setFormError('날짜를 입력해주세요 (예: 05.11 또는 04.10~04.11).');
      setUploadProgress(false);
      return;
    }
    if (!newDescription.trim()) {
      setFormError('상세 설명을 입력해주세요.');
      setUploadProgress(false);
      return;
    }
    const computedAuthor = authorSelectType === 'custom' ? newCustomAuthor.trim() : authorSelectType;
    if (!computedAuthor) {
      setFormError('소속/작성자를 입력해주세요.');
      setUploadProgress(false);
      return;
    }

    let finalImageUrl = newImageUrl.trim();

    try {
      if (imageFile) {
        try {
          const uploadPromise = async () => {
            const fileRef = ref(storage, `activity_photos/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(fileRef, imageFile);
            return await getDownloadURL(snapshot.ref);
          };

          const timeoutPromise = new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error("Storage timeout")), 3000)
          );

          finalImageUrl = await Promise.race([uploadPromise(), timeoutPromise]);
        } catch (storageError) {
          console.warn("Storage upload failed or timed out, falling back to Base64:", storageError);
          if (imageFile.size > 800 * 1024) {
            throw new Error("파일 크기가 너무 큽니다 (최대 800KB). 이미지 크기를 줄이거나 더 저용량 주소로 작성해 주세요.");
          }
          finalImageUrl = await fileToBase64(imageFile);
        }
      }

      if (!finalImageUrl) {
        setFormError('활동 사진 이미지를 업로드하거나 이미지 URL 주소를 입력해주세요.');
        setUploadProgress(false);
        return;
      }

      const chosenHeritage = newHeritageSelect === '기타' ? newCustomHeritage.trim() : newHeritageSelect;
      const finalTitlePart = newTitle.trim() ? ` - ${newTitle.trim()}` : '';
      const baseTitle = newHeritageSelect === '기타' ? newCustomHeritage.trim() : newHeritageSelect;
      const computedTitleWithoutStage = baseTitle ? (baseTitle + finalTitlePart) : newTitle.trim();
      const finalTitle = newMakerStage ? `[${newMakerStage}] ${computedTitleWithoutStage}` : computedTitleWithoutStage;

      const docData = {
        title: finalTitle,
        eventDate: newEventDate.trim(),
        description: newDescription.trim(),
        category: newCategory,
        author: computedAuthor,
        imageUrl: finalImageUrl,
        viewCount: 0,
        createdAt: serverTimestamp(),
        displayDate: newDisplayDate,
        makerStage: newMakerStage || null,
        heritage: chosenHeritage || null,
        summary: newSummary.trim() || null,
        keywords: newKeywords.trim() || null,
        attachmentUrl: newAttachmentUrl.trim() || null
      };

      await addDoc(collection(db, 'activity_photos'), docData);

      setNewTitle('');
      setNewEventDate('');
      setNewDescription('');
      setNewAuthor('AI 디지털 소양');
      setAuthorSelectType('AI 디지털 소양');
      setNewCustomAuthor('');
      setNewMakerStage('');
      setNewHeritageSelect('AI 드로잉');
      setNewCustomHeritage('');
      setNewDisplayDate(new Date().toISOString().split('T')[0]);
      setNewImageUrl('');
      setImageFile(null);
      setNewSummary('');
      setNewKeywords('');
      setNewAttachmentUrl('');
      setShowUploadModal(false);
      alert('활동 사진이 성공적으로 등록되었습니다!');
    } catch (err: any) {
      console.error(err);
      setFormError(`저장 중 오류 발생: ${err.message || err}`);
    } finally {
      setUploadProgress(false);
    }
  };

  // Delete Logic
  const handleDelete = async (photoId: string) => {
    if (!window.confirm('정말로 이 활동 사진을 삭제하시겠습니까?')) return;
    try {
      if (photoId.startsWith('seed-')) {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
      } else {
        await deleteDoc(doc(db, 'activity_photos', photoId));
      }
      setActivePhoto(null);
      alert('성공적으로 삭제되었습니다.');
    } catch (err: any) {
      alert(`삭제 오류: ${err.message}`);
    }
  };

  // Save Edit Logic
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;

    try {
      setUploadProgress(true);
      let finalImageUrl = editImageUrl;

      if (editImageFile) {
        try {
          const uploadPromise = async () => {
            const fileRef = ref(storage, `activity_photos/${Date.now()}_${editImageFile.name}`);
            const snapshot = await uploadBytes(fileRef, editImageFile);
            return await getDownloadURL(snapshot.ref);
          };

          const timeoutPromise = new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error("Storage timeout")), 3000)
          );

          finalImageUrl = await Promise.race([uploadPromise(), timeoutPromise]);
        } catch (storageError) {
          console.warn("Storage upload failed or timed out during edit, falling back to Base64:", storageError);
          if (editImageFile.size > 800 * 1024) {
            alert("파일 크기가 너무 큽니다 (최대 800KB). 이미지 크기를 줄여서 업로드하거나, 더 저용량 주소를 사용해 편집해주세요.");
            setUploadProgress(false);
            return;
          }
          finalImageUrl = await fileToBase64(editImageFile);
        }
      }
      
      const updatedData = {
        title: editTitle,
        eventDate: editEventDate,
        description: editDescription,
        category: editCategory,
        author: editAuthor,
        imageUrl: finalImageUrl,
        displayDate: editDisplayDate,
        makerStage: editMakerStage || null,
        heritage: editHeritage || null,
        summary: editSummary.trim() || null,
        keywords: editKeywords.trim() || null,
        attachmentUrl: editAttachmentUrl.trim() || null
      };

      if (!selectedPost.id.startsWith('seed-')) {
        const docRef = doc(db, 'activity_photos', selectedPost.id);
        await updateDoc(docRef, updatedData);
      } else {
        setPhotos(prev => prev.map(p => p.id === selectedPost.id ? { ...p, ...updatedData } : p));
      }

      if (activePhoto && activePhoto.id === selectedPost.id) {
        setActivePhoto({
          ...activePhoto,
          ...updatedData
        } as any);
      }

      alert('성공적으로 수정되었습니다.');
      setSelectedPost(null);
      setEditImageFile(null);
    } catch (err: any) {
      console.error(err);
      alert(`수정 중 오류가 발생했습니다: ${err.message || err}`);
    } finally {
      setUploadProgress(false);
    }
  };

  const displayPhotos = [
    ...photos,
    ...DEFAULT_PHOTOS.filter(dp => !photos.some(p => p.title.includes(dp.title) || p.description.includes(dp.description.substring(0, 10))))
  ].filter(photo => {
    const rawStr = photo.displayDate || (photo.eventDate ? `2026-${photo.eventDate.replace('.', '-')}` : '');
    const isExcluded = ['2026-05-25', '2026-06-03', '2026-06-10'].some(ex => rawStr.includes(ex));
    return !isExcluded;
  }).sort((a, b) => {
    const rawDateA = a.displayDate || (a.eventDate ? `2026-${a.eventDate.replace('.', '-')}` : '1970-01-01');
    const rawDateB = b.displayDate || (b.eventDate ? `2026-${b.eventDate.replace('.', '-')}` : '1970-01-01');
    return rawDateA.localeCompare(rawDateB);
  });

  const filteredPhotos = displayPhotos.filter(photo => {
    const matchesCategory = selectedCategory === '전체' ||
      (selectedCategory === '기본1 (기초)' && (photo.category === '기본1 (기초)' || photo.category === '기본1(기초)' || photo.category === '기본1')) ||
      (selectedCategory === '기본2(중급)' && (photo.category === '기본2(중급)' || photo.category === '기본2 (중급)' || photo.category === '기본2')) ||
      (selectedCategory === '기본3(고급)' && (photo.category === '기본3(고급)' || photo.category === '기본3 (고급)' || photo.category === '기본3(심화)' || photo.category === '기본3')) ||
      (selectedCategory === '미분류' && (!photo.category || photo.category === '미분류' || photo.category === 'Unclassified'));

    const stageMatch = 
      selectedMakerStage === '전체' ||
      (photo as any).makerStage === selectedMakerStage ||
      (photo.title && photo.title.toLowerCase().includes(`[${selectedMakerStage.toLowerCase()}]`)) ||
      (selectedMakerStage && selectedMakerStage.includes(':') && (
         (photo as any).makerStage === selectedMakerStage.split(':')[0] || 
         (photo as any).makerStage === selectedMakerStage || 
         (photo.title && photo.title.toLowerCase().includes(selectedMakerStage.split(':')[0].toLowerCase())) ||
         (photo.title && photo.title.toLowerCase().includes(selectedMakerStage.split(':')[1].toLowerCase()))
      ));

    const heritageMatch = 
      selectedHeritage === '전체' ||
      (photo as any).heritage === selectedHeritage ||
      (selectedHeritage === '구글 기반 디지털·협업 기초' && (photo.category === '기본1 (기초)' || photo.category === '기본1(기초)' || (photo as any).heritage === '구글 디지털 기초' || (photo as any).heritage === '구글 기반 디지털·협업 기초')) ||
      (photo.title && photo.title.includes(selectedHeritage));

    const query = searchQuery.toLowerCase().trim();
    const searchMatch = query === '' || 
      (photo.title && photo.title.toLowerCase().includes(query)) ||
      (photo.description && photo.description.toLowerCase().includes(query)) ||
      (photo.author && photo.author.toLowerCase().includes(query)) ||
      (photo.category && photo.category.toLowerCase().includes(query)) ||
      ((photo as any).makerStage && (photo as any).makerStage.toLowerCase().includes(query)) ||
      ((photo as any).keywords && (photo as any).keywords.toLowerCase().includes(query)) ||
      ((photo as any).summary && (photo as any).summary.toLowerCase().includes(query)) ||
      (photo.category === '기본1 (기초)' && (query.includes('기본1') || query.includes('기초'))) ||
      (photo.category === '기본2(중급)' && (query.includes('기본2') || query.includes('중급'))) ||
      (photo.category === '기본3(고급)' && (query.includes('기본3') || query.includes('고급')));
      
    return matchesCategory && stageMatch && heritageMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 text-left pt-20">
      {/* Decorative Accent Border */}
      <div className="h-1 bg-gradient-to-r from-[#8C6239] via-[#C5A880] to-[#1A1A1A] w-full" />

      {/* Breadcrumb section */}
      <div className="bg-[#FAF8F5] border-b border-zinc-200 py-3">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center space-x-2 text-xs text-zinc-500 font-sans">
          <Link to="/" className="flex items-center text-zinc-400 hover:text-zinc-700 transition-colors">
            <Home className="w-3.5 h-3.5" />
          </Link>
          <span className="text-zinc-300 font-light">/</span>
          <div className="flex items-center space-x-1 hover:text-zinc-700 cursor-pointer">
            <span style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}>2. 디딤발 활동</span>
          </div>
          <span className="text-zinc-300 font-light">/</span>
          <div className="flex items-center space-x-1 text-zinc-800 font-semibold cursor-pointer">
            <span style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}>2-1. 기초학습</span>
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="relative py-24 px-4 bg-[#FCFAF5] border-b border-[#EADFCB]/30 overflow-hidden">
        <div className="hanji-texture absolute inset-0 opacity-15 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-xs text-[#8C6239] font-serif uppercase tracking-[0.3em] font-bold block whitespace-nowrap break-keep">
            BASIC DIGITAL LITERACY
          </span>
          <h1 
            className="text-4xl md:text-5xl font-serif text-[#1A1A1A] font-bold tracking-tight"
            style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
          >
            2-1. 기초학습
          </h1>
          <div className="h-0.5 w-16 bg-[#8C6239]/40 mx-auto" />
          <p className="max-w-2xl mx-auto text-zinc-650 font-serif leading-relaxed text-sm md:text-base break-keep">
            기본 단계 필터에서 기본1, 기본2, 기본3을 선택하면 해당 단계의 학생 활동 결과물을 확인할 수 있습니다.
          </p>
        </div>
      </div>

      {/* ARCHIVE GROUND SECTION */}
      <div id="archive-section" className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-8 mt-12 space-y-8">
        
        {/* Section Header Block */}
        <div className="text-center py-8 space-y-3 bg-white border border-[#EADFCB]/30 p-8 rounded-sm">
          <div className="w-10 h-[1.5px] bg-[#8C6239] mx-auto mb-3 opacity-60" />
          <h2 
            className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight font-serif"
            style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
          >
            기초학습 아카이브
          </h2>
          <p className="text-zinc-650 font-sans text-sm max-w-3xl mx-auto leading-relaxed break-keep p-2">
            기본 단계 필터에서 기본1, 기본2, 기본3을 선택하면 해당 단계의 학생 활동 결과물을 확인할 수 있습니다.
          </p>
        </div>

        {/* Filters and Search Container */}
        <div className="bg-white border border-zinc-150 p-5 md:p-6 rounded-xs shadow-xs space-y-6">
          
          {/* SEARCH & ACTION ROW */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
            <div className="relative flex-1 max-w-lg">
              <input
                type="text"
                placeholder="활동 제목, 내용, 키워드, 학과 또는 단계명으로 탐색해 보세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-xs py-3 pl-4 pr-11 outline-none focus:border-[#8C6239] focus:bg-white rounded-xs font-sans transition-all placeholder-zinc-400 shadow-inner"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-5 py-3 bg-[#8C6239] hover:bg-[#724C27] text-white font-sans font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm rounded-xs border border-[#8C6239] cursor-pointer"
                  style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
                >
                  <Plus className="w-4 h-4" />
                  <span>새 활동 등록 (NEW POST)</span>
                </button>
              )}
            </div>
          </div>

          {/* BASIC COURSE FILTER ROW */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span 
              className="text-xs font-bold text-zinc-500 uppercase tracking-wider min-w-[100px] text-left"
              style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
            >
              기본 단계 필터
            </span>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { label: '전체', value: '전체' },
                { label: '기본1', value: '기본1 (기초)' },
                { label: '기본2', value: '기본2(중급)' },
                { label: '기본3', value: '기본3(고급)' },
                { label: '미분류(기타)', value: '미분류' }
              ].map(opt => {
                const isActive = selectedCategory === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedCategory(opt.value)}
                    className={`px-4 py-2 text-xs font-sans font-medium transition-all duration-200 border rounded-full cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#8C6239] text-white border-[#8C6239] shadow-sm font-bold'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:bg-slate-50'
                    }`}
                    style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* M.A.K.E.R STEP FILTER ROW */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-zinc-100">
            <span 
              className="text-xs font-bold text-zinc-500 uppercase tracking-wider min-w-[100px] text-left"
              style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
            >
              M.A.K.E.R 필터
            </span>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { label: '전체', value: '전체' },
                { label: 'M: 만남', value: 'M:만남' },
                { label: 'A: 질문', value: 'A:질문' },
                { label: 'K: 이해', value: 'K:이해' },
                { label: 'E: 표현', value: 'E:표현' },
                { label: 'R: 연결', value: 'R:연결' }
              ].map(opt => {
                const isActive = selectedMakerStage === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedMakerStage(opt.value)}
                    className={`px-4 py-2 text-xs font-sans font-medium transition-all duration-200 border rounded-full cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm font-bold'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:bg-slate-50'
                    }`}
                    style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* LEARNING AREA FILTER ROW */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-zinc-100">
            <span 
              className="text-xs font-bold text-zinc-500 uppercase tracking-wider min-w-[100px] text-left"
              style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
            >
              학습 영역 필터
            </span>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {['전체', '구글 기반 디지털·협업 기초', '구글 디지털 기초', 'AI 드로잉', 'AI 일러스트 동화', 'AI 뮤직비디오', '3D 가상 유적지 복원'].map(heritage => {
                const isActive = selectedHeritage === heritage;
                return (
                  <button
                    key={heritage}
                    onClick={() => setSelectedHeritage(heritage)}
                    className={`px-3 py-1.5 text-xs font-sans transition-all duration-200 border rounded-md cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs font-bold'
                        : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-350 hover:bg-slate-50'
                    }`}
                    style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
                  >
                    {heritage}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Main Grid Content */}
        {loading ? (
          <div className="py-24 text-center text-zinc-400 font-sans">
            아카이브에서 활동 내역을 가져오고 있습니다...
          </div>
        ) : filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPhotos.map((photo, index) => {
              const stageColors: Record<string, string> = {
                'M:만남': 'bg-blue-50 text-blue-800 border-blue-200',
                'A:질문': 'bg-pink-50 text-pink-800 border-pink-200',
                'K:이해': 'bg-yellow-50 text-yellow-800 border-yellow-200',
                'E:표현': 'bg-amber-50 text-amber-800 border-amber-200',
                'R:연결': 'bg-emerald-50 text-emerald-800 border-emerald-200'
              };

              const normalizedStageKey = photo.makerStage || '';
              const badgeClass = stageColors[normalizedStageKey] || 'bg-slate-100 text-slate-700 border-slate-200';

              return (
                <motion.div
                  key={photo.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="group bg-white border border-zinc-200 hover:border-[#8C6239]/50 transition-all duration-300 rounded-sm overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md relative"
                >
                  
                  {/* Card Main Image */}
                  <div 
                    className="relative aspect-[16/10] bg-zinc-50 overflow-hidden cursor-pointer"
                    onClick={() => handleViewDetails(photo)}
                  >
                    <img
                      src={photo.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-103 duration-500 transition-transform"
                      referrerPolicy="no-referrer"
                    />

                    {/* Stage Badges overlaid */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 shadow-xs">
                      {photo.category && (
                        <span className="text-[10px] font-sans font-bold bg-zinc-950/80 text-white px-2 py-0.5 rounded-sm">
                          {photo.category === '기본1 (기초)' || photo.category === '기본1(기초)' || photo.category === '기본1'
                            ? '기본1'
                            : photo.category === '기본2(중급)' || photo.category === '기본2'
                              ? '기본2'
                              : photo.category === '기본3(고급)' || photo.category === '기본3'
                                ? '기본3'
                                : photo.category}
                        </span>
                      )}
                      
                      {photo.makerStage && (
                        <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-sm border ${badgeClass}`}>
                          {photo.makerStage}
                        </span>
                      )}

                      {photo.toolType && (
                        <span className="text-[10px] font-sans font-bold bg-[#1E3A8A]/95 text-white px-2 py-0.5 rounded-sm border border-[#1E3A8A]">
                          {photo.toolType}
                        </span>
                      )}
                    </div>

                    {/* Admin Controls */}
                    {isAdmin && (
                      <div 
                        className="absolute top-3 right-3 flex items-center space-x-1.5 z-30 pointer-events-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setSelectedPost(photo);
                          }}
                          className="p-1.5 bg-white hover:bg-zinc-100 text-[#8C6239] rounded-full shadow-md hover:scale-105 active:scale-[95] transition-all cursor-pointer pointer-events-auto relative z-30 flex items-center justify-center border border-zinc-200/50"
                          title="수정"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDelete(photo.id);
                          }}
                          className="p-2 bg-red-650 hover:bg-red-750 text-white hover:text-white rounded-full shadow-md hover:scale-105 active:scale-[95] transition-all cursor-pointer pointer-events-auto relative z-30 flex items-center justify-center border border-red-700/20"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Body Details Area */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-zinc-400 font-sans tracking-wide">
                          {photo.displayDate && photo.dayOfWeek 
                            ? `${photo.displayDate.replace(/-/g, '.')} (${photo.dayOfWeek})`
                            : photo.eventDate
                              ? `2026.${photo.eventDate} (${photo.dayOfWeek || '월요일'})`
                              : '2026.06.15'}
                        </span>
                      </div>

                      <h3 
                        onClick={() => handleViewDetails(photo)}
                        className="text-[15px] font-extrabold text-zinc-950 group-hover:text-[#8C6239] transition-colors leading-snug break-keep text-left font-sans cursor-pointer line-clamp-2"
                      >
                        {cleanActivityTitle(photo.title)}
                      </h3>

                      <p className="text-[12px] text-zinc-500 leading-relaxed break-keep font-sans text-left line-clamp-2 min-h-[36px]">
                        {photo.summary || photo.description}
                      </p>
                    </div>

                    {/* Metadata Footer Row */}
                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-sans">
                      <div className="flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-zinc-400 mr-0.5" />
                        <span className="font-semibold text-zinc-700">{photo.author || '미분류 학생'}</span>
                      </div>

                      <button
                        onClick={() => handleViewDetails(photo)}
                        className="text-[#8C6239] hover:text-[#724C27] font-bold flex items-center space-x-1 group/btn transition-colors cursor-pointer"
                        style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
                      >
                        <span>자세히 보기</span>
                        <ChevronDown className="w-3 h-3 -rotate-90 group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center text-zinc-400 font-serif border border-dashed border-[#EADFCB] bg-white rounded-sm max-w-xl mx-auto space-y-4">
            <AlertCircle className="w-10 h-10 text-zinc-300 mx-auto" />
            <p className="text-sm">검색 필터에 해당되는 학생 활동 내역이 아카이브에 없습니다.</p>
            {isAdmin && photos.length === 0 && (
              <button
                onClick={handleSeedSamples}
                className="px-4 py-2 bg-[#8C6239] text-white text-xs font-serif rounded-sm inline-block cursor-pointer"
              >
                데모 데이터 일체 주입하기 (Seed)
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pop-up Card Detailed Modal */}
      <AnimatePresence>
        {activePhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1A1A1A]/70 backdrop-blur-sm"
              onClick={() => setActivePhoto(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#FCFAF5] border border-[#EADFCB] rounded-sm p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="hanji-texture absolute inset-0 opacity-10 pointer-events-none" />

              <div className="relative z-10 space-y-6 text-left">
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {activePhoto.category && (
                        <span className="text-[10px] text-[#8C6239] bg-[#8C6239]/5 border border-[#8C6239]/20 px-2.5 py-0.5 rounded-sm font-bold font-serif uppercase tracking-widest">
                          {activePhoto.category}
                        </span>
                      )}
                      {activePhoto.makerStage && (
                        <span className="text-[10px] text-zinc-700 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-sm font-bold font-serif whitespace-nowrap">
                          {activePhoto.makerStage}
                        </span>
                      )}
                      {activePhoto.toolType && (
                        <span className="text-[10px] text-[#1967D2] bg-[#E8F0FE] border border-[#D2E3FC] px-2.5 py-0.5 rounded-sm font-bold font-serif whitespace-nowrap">
                          도구 유형: {activePhoto.toolType}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold font-serif text-[#1A1A1A] leading-snug">
                      {cleanActivityTitle(activePhoto.title)}
                    </h3>
                    <p className="text-xs text-zinc-400 font-sans">
                      상위 프로젝트: <span className="font-semibold text-zinc-650">AI 디지털 소양 P</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => setActivePhoto(null)}
                    className="p-1 px-1.5 border border-zinc-200 text-zinc-400 hover:text-zinc-600 rounded-sm hover:bg-stone-50 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Detailed Image */}
                <div className="aspect-[16/10] bg-black rounded-xs overflow-hidden shadow-inner relative border border-[#EADFCB]/30">
                  <img 
                    src={activePhoto.imageUrl} 
                    alt={activePhoto.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Sub-meta details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3.5 px-4 bg-[#FAF8F5] border border-[#EADFCB]/40 rounded-sm text-xs text-zinc-600 font-serif">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-zinc-400" />
                    <div>
                      <span className="font-bold text-zinc-800 block sm:inline">하단 분류:</span>{' '}
                      <span className="text-zinc-600">{activePhoto.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                    <div>
                      <span className="font-bold text-zinc-800 block sm:inline">날짜 및 요일:</span>{' '}
                      <span className="text-zinc-650">
                        {activePhoto.displayDate && activePhoto.dayOfWeek 
                          ? `${activePhoto.displayDate.replace(/-/g, '.')} (${activePhoto.dayOfWeek})`
                          : activePhoto.eventDate
                            ? `2026.${activePhoto.eventDate} (${activePhoto.dayOfWeek || '월요일'})`
                            : '2026.06.15'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-zinc-400" />
                    <div>
                      <span className="font-bold text-zinc-800 block sm:inline">조회수:</span>{' '}
                      <span className="text-zinc-650">{activePhoto.viewCount}회</span>
                    </div>
                  </div>
                </div>

                {/* Course Name */}
                <div className="pt-2 pb-1 border-b border-zinc-100 text-xs text-zinc-600 font-serif">
                  <span className="font-bold text-zinc-800">학습 과정명:</span>{' '}
                  <span className="text-[#8C6239] font-semibold">{activePhoto.heritage || '구글 기반 디지털·협업 기초'}</span>
                </div>

                {/* Optional summary context */}
                {activePhoto.summary && (
                  <div className="bg-[#FAF8F5]/80 border-l-4 border-[#8C6239] p-4 rounded-sm">
                    <h4 className="text-xs text-[#8C6239] font-bold font-serif uppercase tracking-wider mb-1">■ 활동 요약</h4>
                    <p className="text-xs text-zinc-700 font-sans leading-relaxed break-all">
                      {activePhoto.summary}
                    </p>
                  </div>
                )}

                {/* Multi-line Description text */}
                <div className="space-y-2">
                  <h4 className="text-xs text-[#8C6239] font-bold uppercase tracking-wider font-serif">■ 상세 활동 기록</h4>
                  <p className="text-sm text-zinc-700 leading-relaxed break-keep font-serif whitespace-pre-wrap pl-1 font-light">
                    {activePhoto.description}
                  </p>
                </div>

                {/* Major Activities List */}
                {activePhoto.majorActivities && activePhoto.majorActivities.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <h4 className="text-xs text-[#8C6239] font-bold uppercase tracking-wider font-serif">■ 주요 활동 목록</h4>
                    <ul className="list-disc list-inside text-xs text-zinc-750 font-sans leading-relaxed pl-2 space-y-1">
                      {activePhoto.majorActivities.map((act, i) => (
                        <li key={i} className="pl-1 text-zinc-700">{act}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Parent instructions or examples */}
                {activePhoto.parentExcerpt && (
                  <div className="bg-amber-50/30 border border-[#EADFCB]/30 p-4 rounded-sm space-y-1">
                    <h4 className="text-xs text-[#8C6239] font-serif font-bold">💡 활동 예시 & 추가 안내</h4>
                    <p className="text-xs text-zinc-650 font-sans leading-relaxed">
                      {activePhoto.parentExcerpt}
                    </p>
                  </div>
                )}

                {/* Warnings / Cautions */}
                {activePhoto.warnings && activePhoto.warnings.length > 0 && (
                  <div className="bg-red-50/50 border-l-4 border-red-300 p-4 rounded-sm space-y-1">
                    <h4 className="text-xs text-red-700 font-bold uppercase tracking-wider font-sans">⚠️ 주의사항</h4>
                    <ul className="list-disc list-inside text-[11px] text-red-800 font-sans leading-relaxed pl-1 space-y-0.5">
                      {activePhoto.warnings.map((warn, i) => (
                        <li key={i}>{warn}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Optional keywords/tags context */}
                {activePhoto.keywords && (
                  <div className="space-y-1.5 pt-2">
                    <h4 className="text-xs text-zinc-400 font-bold font-sans uppercase tracking-wider">키워드 태그</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activePhoto.keywords.split(/[\s,#]+/).filter(Boolean).map((kw, i) => (
                        <span key={i} className="text-[11px] font-sans text-[#8C6239] bg-[#8C6239]/5 border border-[#8C6239]/10 px-2 py-0.5 rounded-sm">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional attachment link download */}
                {activePhoto.attachmentUrl && (
                  <div className="pt-3 border-t border-zinc-150 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-sans font-serif">※ 참고자료 및 학생 제작물 파일이 포함되어 있습니다.</span>
                    <a
                      href={activePhoto.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-slate-150 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold rounded-sm flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>첨부파일 및 제작물 보기</span>
                    </a>
                  </div>
                )}

                {/* Admin specific action */}
                {isAdmin && (
                  <div className="flex justify-end pt-4 border-t border-zinc-100 space-x-2">
                    <button
                      onClick={() => setSelectedPost(activePhoto)}
                      className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 text-xs font-serif transition-colors rounded-sm flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>수정하기</span>
                    </button>
                    <button
                      onClick={() => handleDelete(activePhoto.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-xs font-serif transition-colors rounded-sm flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>활동 내역 삭제</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin New Creation dialog pop-up */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowUploadModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#EADFCB] rounded-sm p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-[#EADFCB]/50">
                  <h4 className="text-xl font-bold font-serif text-[#1A1A1A] flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-[#8C6239]" />
                    <span>새 활동사진 등록 (관리자전용)</span>
                  </h4>
                  <button 
                    onClick={() => setShowUploadModal(false)}
                    className="p-1 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {formError && (
                  <p className="p-3 bg-red-50 border border-red-200 text-xs text-red-600 rounded-sm font-serif">
                    {formError}
                  </p>
                )}

                <form onSubmit={handleUpload} className="space-y-4 font-serif text-xs">
                  {/* M.A.K.E.R Stage Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">M.A.K.E.R 단계 선택</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                      value={newMakerStage}
                      onChange={(e) => setNewMakerStage(e.target.value)}
                    >
                      <option value="">선택 안 함 (없음)</option>
                      <option value="M:만남">M:만남</option>
                      <option value="A:질문">A:질문</option>
                      <option value="K:이해">K:이해</option>
                      <option value="E:표현">E:표현</option>
                      <option value="R:연결">R:연결</option>
                    </select>
                  </div>

                  {/* Learning Area Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">학습 영역 선택</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                      value={newHeritageSelect}
                      onChange={(e) => setNewHeritageSelect(e.target.value)}
                    >
                      <option value="AI 드로잉">AI 드로잉</option>
                      <option value="AI 일러스트 동화">AI 일러스트 동화</option>
                      <option value="AI 뮤직비디오 · 3D 가상 유적지 복원">AI 뮤직비디오 · 3D 가상 유적지 복원</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">활동 상세 제목 (선택사항)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="예: 탐방 학습지 제작"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </div>

                  {/* Event Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">날짜 표시 (예: 05.11 또는 04.10~04.11)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="05.11"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Admin Display Date selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">등록일자 직접 선택 (카드에 표시될 날짜)</label>
                    <input
                      type="date"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      value={newDisplayDate}
                      onChange={(e) => setNewDisplayDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Club Category */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">구분 (게시판 카테고리)</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                    >
                      <option value="기본1 (기초)">기본1</option>
                      <option value="기본2(중급)">기본2</option>
                      <option value="기본3(고급)">기본3</option>
                    </select>
                  </div>

                  {/* Author / Crew Name selectable dropdown */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">소속 학과 / 탐구동아리명 선택</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer mb-2"
                      value={authorSelectType}
                      onChange={(e) => {
                        setAuthorSelectType(e.target.value);
                        if (e.target.value !== 'custom') {
                          setNewAuthor(e.target.value);
                        }
                      }}
                    >
                      <option value="AI 디지털 소양">AI 디지털 소양</option>
                      <option value="초등교육과">초등교육과</option>
                      <option value="역사탐구동아리">역사탐구동아리</option>
                      <option value="AI크리에이터동아리">AI크리에이터동아리</option>
                      <option value="지역연계탐구팀">지역연계탐구팀</option>
                      <option value="M:만남">M:만남</option>
                      <option value="A:질문">A:질문</option>
                      <option value="K:이해">K:이해</option>
                      <option value="E:표현">E:표현</option>
                      <option value="R:연결">R:연결</option>
                      <option value="custom">직접 입력...</option>
                    </select>

                    {authorSelectType === 'custom' && (
                      <input
                        type="text"
                        className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] mt-1 font-sans"
                        placeholder="소속 학과 혹은 탐구동아리명을 직접 입력하세요"
                        value={newCustomAuthor}
                        onChange={(e) => {
                          setNewCustomAuthor(e.target.value);
                          setNewAuthor(e.target.value);
                        }}
                        required
                      />
                    )}
                  </div>

                  {/* Image Options */}
                  <div className="space-y-2 border-y border-[#EADFCB]/30 py-3 my-2">
                    <span className="text-[10px] text-zinc-500 font-bold tracking-wider block">활동 이미지 입력 (파일 업로드 혹은 URL 주소 제공 중 택1)</span>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#8C6239] font-semibold block">1. 로컬 이미지 파일 선택</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                          }
                        }}
                        className="w-full p-1 border border-dashed border-[#EADFCB] bg-white rounded-sm text-zinc-500 font-sans"
                      />
                    </div>

                    <div className="text-center text-[9px] text-zinc-400 my-1">─ 또는 ─</div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-[#8C6239] font-semibold block">2. 외부 이미지 URL 주소 직접 입력</label>
                      <input
                        type="text"
                        className="w-full p-2.5 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none font-sans"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">상세 활동 설명 *</label>
                    <textarea
                      rows={4}
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="활동에 관련된 세부 내용을 작성해주세요"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      required
                    />
                  </div>

                  {/* Summary */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">활동 요약 (카드 목록에 노출될 요약 문구, 선택사항)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="예: 교수님들께 감사하는 마음을 담은 카네이션 및 축하 편지 전달"
                      value={newSummary}
                      onChange={(e) => setNewSummary(e.target.value)}
                    />
                  </div>

                  {/* Keywords */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">검색 키워드 태그 (공백이나 쉼표로 구분, 선택사항)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="예: 스승의날 카네이션 학부행사"
                      value={newKeywords}
                      onChange={(e) => setNewKeywords(e.target.value)}
                    />
                  </div>

                  {/* Attachment URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">활동 참고자료 / 첨부 파일 웹 링크 (선택사항)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="예: https://drive.google.com/... 또는 관련 블로그 주소"
                      value={newAttachmentUrl}
                      onChange={(e) => setNewAttachmentUrl(e.target.value)}
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-2 pt-4 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-4 py-2.5 bg-white border border-zinc-200 hover:bg-stone-50 text-[#1A1A1A] cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={uploadProgress}
                      className="px-6 py-2.5 bg-[#8C6239] hover:bg-[#6D4926] text-white flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>{uploadProgress ? '등록 중...' : '등록하기'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal (selectedPost) */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedPost(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#EADFCB] rounded-sm p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-[#EADFCB]/50">
                  <h4 className="text-xl font-bold font-serif text-[#1A1A1A] flex items-center space-x-2">
                    <Edit className="w-5 h-5 text-[#8C6239]" />
                    <span>활동 기록 수정 (관리자전용)</span>
                  </h4>
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="p-1 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-4 font-serif text-xs">
                  {/* M.A.K.E.R Stage Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">M.A.K.E.R 단계 선택</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                      value={editMakerStage}
                      onChange={(e) => setEditMakerStage(e.target.value)}
                    >
                      <option value="">선택 안 함 (없음)</option>
                      <option value="M:만남">M:만남</option>
                      <option value="A:질문">A:질문</option>
                      <option value="K:이해">K:이해</option>
                      <option value="E:표현">E:표현</option>
                      <option value="R:연결">R:연결</option>
                    </select>
                  </div>

                  {/* Learning Area Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider block mb-1">학습 영역 선택</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                      value={editHeritage}
                      onChange={(e) => setEditHeritage(e.target.value)}
                    >
                      <option value="">미분류</option>
                      <option value="AI 드로잉">AI 드로잉</option>
                      <option value="AI 일러스트 동화">AI 일러스트 동화</option>
                      <option value="AI 뮤직비디오 · 3D 가상 유적지 복원">AI 뮤직비디오 · 3D 가상 유적지 복원</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">활동 상세 제목</label>
                    <input
                      required
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="예: 탐방 학습지 제작"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>

                  {/* Event Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">날짜 표시 (예: 05.11 또는 04.10~04.11)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="05.11"
                      value={editEventDate}
                      onChange={(e) => setEditEventDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Date selection */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">등록일자 선택</label>
                    <input
                      type="date"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      value={editDisplayDate}
                      onChange={(e) => setEditDisplayDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* Club Category */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">구분 (게시판 카테고리)</label>
                    <select
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239] cursor-pointer"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as any)}
                    >
                      <option value="기본1 (기초)">기본1</option>
                      <option value="기본2(중급)">기본2</option>
                      <option value="기본3(고급)">기본3</option>
                    </select>
                  </div>

                  {/* Author / Crew Name */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">소속 학과 / 탐구동아리명</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="소속 학과 혹은 탐구동아리명"
                      value={editAuthor}
                      onChange={(e) => setEditAuthor(e.target.value)}
                      required
                    />
                  </div>

                  {/* Image Options for Editing */}
                  <div className="space-y-2 border-y border-[#EADFCB]/30 py-3 my-2 text-left">
                    <span className="text-[10px] text-zinc-500 font-bold tracking-wider block">활동 이미지 입력 (파일 업로드 혹은 URL 주소 제공 중 택1)</span>
                    
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#8C6239] font-semibold block">1. 로컬 이미지 파일 선택 (새 이미지 업로드 시)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setEditImageFile(e.target.files[0]);
                          }
                        }}
                        className="w-full p-1 border border-dashed border-[#EADFCB] bg-white rounded-sm text-zinc-500 font-sans"
                      />
                    </div>

                    <div className="text-center text-[9px] text-zinc-400 my-1">─ 또는 ─</div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-[#8C6239] font-semibold block">2. 외부 이미지 URL 주소 직접 입력</label>
                      <input
                        type="text"
                        className="w-full p-2.5 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none font-sans"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">상세 활동 설명 *</label>
                    <textarea
                      rows={4}
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="활동에 관련된 세부 내용을 작성해주세요"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      required
                    />
                  </div>

                  {/* Edit Summary */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">활동 요약 (선택사항)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="예: 교수님들께 감사하는 마음을 담은 카네이션 및 축하 편지 전달"
                      value={editSummary}
                      onChange={(e) => setEditSummary(e.target.value)}
                    />
                  </div>

                  {/* Edit Keywords */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">검색 키워드 태그 (선택사항)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="예: 스승의날 카네이션 학부행사"
                      value={editKeywords}
                      onChange={(e) => setEditKeywords(e.target.value)}
                    />
                  </div>

                  {/* Edit Attachment URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500 font-bold tracking-wider">활동 참고자료 / 첨부 파일 웹 링크 (선택사항)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-white border border-[#EADFCB] rounded-sm text-xs outline-none focus:border-[#8C6239]"
                      placeholder="예: https://drive.google.com/... 또는 관련 블로그 주소"
                      value={editAttachmentUrl}
                      onChange={(e) => setEditAttachmentUrl(e.target.value)}
                    />
                  </div>

                  {/* Submit buttons */}
                  <div className="flex gap-2 pt-4 justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedPost(null)}
                      className="px-4 py-2.5 bg-white border border-zinc-200 hover:bg-stone-50 text-[#1A1A1A] cursor-pointer"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={uploadProgress}
                      className="px-6 py-2.5 bg-[#8C6239] hover:bg-[#6D4926] text-white flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <span>{uploadProgress ? '수정 중...' : '수정 완료'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
