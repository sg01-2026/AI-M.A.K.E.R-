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
import CommonArchive from '../components/CommonArchive';

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
    displayDate: '2026-05-19',
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
  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 text-left">
      {/* [1. Breadcrumb 영역] */}
      <div className="border-b border-[#EADFCB]/10 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between text-xs font-serif">
          <div className="flex items-center space-x-2 text-zinc-500">
            <Link to="/" className="flex items-center text-zinc-400 hover:text-zinc-700 transition-colors">
              <Home className="w-3.5 h-3.5" />
            </Link>
            <span className="text-zinc-300">/</span>
            <span>2. 디딤발 활동</span>
            <span className="text-zinc-300">/</span>
            <span className="text-[#8C6239] font-semibold">2-1. 기초학습</span>
          </div>
        </div>
      </div>

      <CommonArchive
        pageTitle="2-1. 기초학습"
        activityType="기초학습"
        defaultPhotos={DEFAULT_PHOTOS as any}
        categoryTitle="단계"
        categories={['전체', '기본1', '기본2', '기본3', '미분류(기타)']}
        learningAreas={[
          '전체',
          '구글 기반 디지털·협업 기초',
          '구글 디지털 기초',
          'AI 드로잉',
          'AI 일러스트 동화',
          'AI 뮤직비디오',
          '3D 가상 유적지 복원'
        ]}
        defaultCategoryValue="기본1 (기초)"
        authorOptions={['전체', '교사', '학생', 'AI 디지털 소양']}
        defaultAuthorValue="전체"
        defaultHeritageValue="전체"
      />
    </div>
  );
}
