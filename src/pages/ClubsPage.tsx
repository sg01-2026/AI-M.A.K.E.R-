import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, PenTool, Sparkles, Image as ImageIcon, FileText, Code, Rocket, ExternalLink, Calendar, User, Eye, CheckCircle2, X, Clock, Trash2, Edit } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import AdminUpload from '../components/AdminUpload';
import { useAuth } from '../context/AuthContext';

const cleanActivityTitle = (title: string) => {
  // 1. Remove [M:만남] prefix
  let clean = title.replace(/^\[[^\]]+\]\s*/, '');
  // 2. If it contains "Heritage - Title", extract the Title part
  if (clean.includes(' - ')) {
    const parts = clean.split(' - ');
    // Return the second part onwards
    clean = parts.slice(1).join(' - ');
  }
  return clean;
};

interface Resource {
  id: string;
  title: string;
  type: 'image' | 'pdf';
  fileUrl: string;
  description: string;
  createdAt?: any;
  displayDate?: string;
  makerStage?: string;
  heritage?: string;
  category?: string;
}

interface ActivityPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  eventDate: string;
  author: string;
  viewCount: number;
  createdAt?: any;
  displayDate?: string;
  makerStage?: string;
  heritage?: string;
  summary?: string;          // 활동 요약
  keywords?: string;         // 검색 태그 키워드
  attachmentUrl?: string;    // 추가 첨부파일/링크
  dayOfWeek?: string;        // 요일
  majorActivities?: string[]; // 주요 활동 목록
  warnings?: string[];       // 주의사항
  toolType?: string;         // 도구 유형
  parentExcerpt?: string;    // 추가 임의안내
}

const DEFAULT_ACTIVITY_PHOTOS: ActivityPhoto[] = [
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
    imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=850',
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

const clubLevels = {
  '기본1 (기초)': {
    title: '학생동아리 - 기본1 (기초)',
    level: 'Beginner',
    desc: 'AI 프로젝트의 기초를 다지고 문화유산과 처음 만나는 단계입니다.',
    topics: ['생성형 AI의 기본 이해', '시흥 문화유산 탐색하기', '간단한 AI 프롬프트 작성법', '문화유산 굿즈 기획'],
    icon: <PenTool className="w-12 h-12 text-gold-500" />
  },
  '기본2(중급)': {
    title: '학생동아리 - 기본2(중급)',
    level: 'Intermediate',
    desc: 'AI 도구를 활용해 시흥의 이야기를 창의적으로 재구성하는 단계입니다.',
    topics: ['이미지 생성 AI 심화 활용', '지역 스토리텔링 동화 제작', '디지털 드로잉과 AI 협업', '인터랙티브 콘텐츠 기초'],
    icon: <Code className="w-12 h-12 text-gold-500" />
  },
  '기본3(고급)': {
    title: '학생동아리 - 기본3(고급)',
    level: 'Advanced',
    desc: '복합적인 AI 기술을 통해 고도화된 지역 문화 아카이브를 제작하는 단계입니다.',
    topics: ['AI 뮤직비디오 및 OST 제작', '3D 가상 유적지 복원 프로젝트', '웹툰 및 인터랙션 디자인', '지역 사회 공유 및 전시'],
    icon: <Rocket className="w-12 h-12 text-gold-500" />
  }
};

const makerStepsData = {
  '기본1 (기초)': [
    {
      step: 'M',
      title: '만남 (Meet)',
      desc: '생성형 AI의 정의와 시흥의 소중한 문화유산(생금집 등)과의 첫 대면',
      details: 'AI 드로잉 기초 도구를 경험하며 문화유산의 가치를 시공간을 초월해 탐색합니다.'
    },
    {
      step: 'A',
      title: '질문 (Ask)',
      desc: '"인공지능은 예술과 문화유산을 어떻게 해석하고 드로잉할까?" 탐구적 질문 던지기',
      details: '질문에 답변하는 과정을 구상하여 프롬프트의 영향력과 생성 양식을 구체화합니다.'
    },
    {
      step: 'K',
      title: '이해 (Know)',
      desc: '기초적인 이미지 생성 AI 프롬프트 가이드라인과 인풋-아웃풋 협업 메커니즘 이해',
      details: '단어와 텍스트가 풍성한 일러스트가 되는 원리를 이해하여 AI 굿즈 디자인 능력을 함양합니다.'
    },
    {
      step: 'E',
      title: '표현 (Express)',
      desc: '나만의 시흥 문화유산 굿즈 시제품 디자인 및 드로잉 제작 활동',
      details: '활동 안내: 직접 AI 드로잉 툴을 활용하여 나만의 시흥 문화유산 굿즈 디자인 초안이나 드로잉 결과물을 창의적으로 제작해 보세요!'
    },
    {
      step: 'R',
      title: '연결 (Route/Connect)',
      desc: '제작한 굿즈 결과물을 보존하고 학생 활동 아카이브에 실시간 공유 전시하기',
      details: '활동 안내: 내가 작성하고 만든 소장가치 높은 미술품 결과물을 [내 활동 등록하기] 버튼을 통해 학급 아카이브 보관 공간에 보관하고 다른 친구들의 결과물과 이어보세요.'
    }
  ],
  '기본2(중급)': [
    {
      step: 'M',
      title: '만남 (Meet)',
      desc: '시흥의 대표 농경유산 호조벌, 테마공원 관곡지와 AI 멀티미디어 도구의 조화로운 결합',
      details: '유산의 역사적 유래와 전설을 시각 자원화하여 이야기책 구성을 위해 구조화합니다.'
    },
    {
      step: 'A',
      title: '질문 (Ask)',
      desc: '"인공지능을 활용하여 지역 농경유산의 가치를 재미있는 디지털 일러스트 동화로 풀어낼 수 있을까?"',
      details: '질문을 가공하면서 모둠별 시나리오의 기초 축이 되어 줄 갈등 및 가치 해결 과정을 질문합니다.'
    },
    {
      step: 'K',
      title: '이해 (Know)',
      desc: '이미지 생성 AI 심화 테크닉과 컷툰 문맥 일관성, 다각적 표현 양식 습득',
      details: '등장인물의 표정, 배경 구도를 고정하여 이야기를 논리적이고 균일한 완성도로 연출하는 법을 학습합니다.'
    },
    {
      step: 'E',
      title: '표현 (Express)',
      desc: '시흥의 문화유산을 모티브로 한 나만의 창의 디지털 일러스트 동화책 제련 및 제작',
      details: '활동 안내: 팀원들과 협력해 시흥 문화유산의 역사 이야기를 인공지능 그래픽 도구와 결합하여 고해상도 디지털 동화책으로 풍성하게 구현해 보세요!'
    },
    {
      step: 'R',
      title: '연결 (Route/Connect)',
      desc: '완성도 높은 디지털 동화책을 온라인 학생 활동 아카이브에 등록해 역사적 가치 공유',
      details: '활동 안내: 완성한 우리의 그림 동화책 포트폴리오를 아래 [내 활동 등록하기] 버튼을 눌러 온라인 아카이브에 실시간 등재하고 지역 사회와 소통해 보세요.'
    }
  ],
  '기본3(고급)': [
    {
      step: 'M',
      title: '만남 (Meet)',
      desc: '오이도 유적지, 대규모 군자봉 성황제와 초지능형 AI 창작 프로토타입의 융복합 만남',
      details: '문화재의 핵심 원천 콘텐츠를 오디오, 비디오, 3D 실감 미디어가 덧입혀진 대형 프로젝트로 연동합니다.'
    },
    {
      step: 'A',
      title: '질문 (Ask)',
      desc: '"웹 퍼블리싱, 실시간 가상 공간 복원, 혹은 AI 작곡을 융합하여 미래지향적인 축제 공간을 구현할 수 있을까?"',
      details: '다각적 크리에이터 AI 엔진들과 커뮤니케이션하며 실무급 지역 홍보 수단을 설계하고 구체화합니다.'
    },
    {
      step: 'K',
      title: '이해 (Know)',
      desc: '인터랙션 미디어 빌드, 메타버스 공간 렌더링, 실시간 오케스트라 작곡 프로세스 이해',
      details: '다양한 미디어 소스를 큐레이팅하고 제어하는 최고 수준의 AI 서비스 배치 메커니즘을 습득합니다.'
    },
    {
      step: 'E',
      title: '표현 (Express)',
      desc: 'AI 작곡 음원 적용 문화유산 뮤직비디오, 메타버스 복원 전시 공간 및 3D 앱 구축',
      details: '활동 안내: 인공지능 사운드메이커와 멀티미디어 생성 모델 등을 종합 결착하여 가상 3D 실감 유적 복원, 또는 테마 OST 뮤직비디오 등 고도화된 작품을 창작해 보세요!'
    },
    {
      step: 'R',
      title: '연결 (Route/Connect)',
      desc: '종합 연출된 완성형 작품 및 소감문을 아카이브에 보존하여 디지털 명예의 전당 등재',
      details: '활동 안내: 우리 학급의 명작을 [내 활동 등록하기]를 통해 아카이브에 게재하여 온/오프라인 전시관에 시흥의 찬란한 자산을 영구 보존 및 연결해 보세요.'
    }
  ]
};

export default function ClubsPage() {
  const { level } = useParams<{ level: string }>();
  const { isAdmin } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedMakerStage, setSelectedMakerStage] = useState<string>('전체');
  const [selectedHeritage, setSelectedHeritage] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activityPhotos, setActivityPhotos] = useState<ActivityPhoto[]>([]);
  const [activePhoto, setActivePhoto] = useState<ActivityPhoto | null>(null);

  // States to persist deleted posts and edited edits locally (for seamless instant deletion/updating of any item)
  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('deleted_post_ids');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [editedPosts, setEditedPosts] = useState<Record<string, Partial<Resource>>>(() => {
    try {
      const stored = localStorage.getItem('edited_post_data');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  // State to manage the editing modal
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  
  const currentLevel = clubLevels[level as keyof typeof clubLevels] || clubLevels['기본1 (기초)'];

  const activeMakerLevelKey = (level === '기본1 (기초)' || level === '기본1(기초)' || level === '기본1') 
    ? '기본1 (기초)' 
    : (level === '기본2(중급)' || level === '기본2 (중급)' || level === '기본2') 
      ? '기본2(중급)' 
      : '기본3(고급)';
  
  const currentLevelSteps = makerStepsData[activeMakerLevelKey] || makerStepsData['기본1 (기초)'];

  useEffect(() => {
    const q = query(
      collection(db, 'resources'),
      where('category', '==', level),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];
      setResources(fetched);
    });

    return () => unsubscribe();
  }, [level]);

  useEffect(() => {
    const q = query(
      collection(db, 'activity_photos'),
      orderBy('createdAt', 'desc')
    );

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
        }) as any[];
      setActivityPhotos(fetched);
    }, (error) => {
      console.error("Error loading activity photos in ClubsPage:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleViewDetails = async (photo: ActivityPhoto) => {
    setActivePhoto(photo);
    
    if (!photo.id.startsWith('seed-')) {
      try {
        const photoRef = doc(db, 'activity_photos', photo.id);
        await updateDoc(photoRef, {
          viewCount: (photo.viewCount || 0) + 1
        });
      } catch (e) {
        console.warn("Could not increment view count", e);
      }
    } else {
      setActivityPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, viewCount: (p.viewCount || 0) + 1 } : p));
    }
  };

  const handleDeleteResource = async (e: React.MouseEvent, res: Resource) => {
    e.stopPropagation(); // Prevent opening/clicking of card
    
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      return;
    }
    
    try {
      if (!res.id) {
        alert("유효한 게시글 ID를 찾을 수 없습니다.");
        return;
      }

      // Add to deletedIds local list so it disappears instantly from the screen
      const updatedDeleted = [...deletedIds, res.id];
      setDeletedIds(updatedDeleted);
      localStorage.setItem('deleted_post_ids', JSON.stringify(updatedDeleted));

      // Delete Firebase Storage associated file if exists and is stored on Firebase
      if (res.fileUrl && (res.fileUrl.includes('firebasestorage.googleapis.com') || res.fileUrl.startsWith('gs://'))) {
        try {
          const fileRef = ref(storage, res.fileUrl);
          await deleteObject(fileRef);
          console.log("Deleted associated Storage file successfully:", res.fileUrl);
        } catch (stErr) {
          console.warn("Storage file deletion skipped or failed:", stErr);
        }
      }

      const isSeed = res.id.startsWith('seed-');
      if (!isSeed) {
        // Try deletion directly on both collections in Firestore.
        try {
          await deleteDoc(doc(db, 'resources', res.id));
        } catch (dbErr) {
          try {
            await deleteDoc(doc(db, 'activity_photos', res.id));
          } catch (photoErr) {
            handleFirestoreError(dbErr, OperationType.DELETE, `resources/${res.id}`);
          }
        }
      }
      
      alert("성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting document:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleOpenEditModal = (e: React.MouseEvent, res: Resource) => {
    e.stopPropagation();
    setEditingResource(res);
  };



  const displayActivityPhotos = (() => {
    const matchingFromDb = activityPhotos.filter(photo => photo.category === level);
    const matchingFromDefaults = DEFAULT_ACTIVITY_PHOTOS.filter(photo => photo.category === level);
    // Combine them, avoiding duplicates by title
    return [
      ...matchingFromDb,
      ...matchingFromDefaults.filter(dp => !matchingFromDb.some(dbPhoto => dbPhoto.title.includes(dp.title) || dbPhoto.description.includes(dp.description.substring(0, 10))))
    ];
  })();

  // Map activity photos to resources so they can accumulate and stack in "학생 활동 아카이브"
  const activityPhotosAsResources: Resource[] = displayActivityPhotos.map(photo => {
    const stage = photo.makerStage || (photo.category === '기본3(고급)' || photo.category === '기본3 (고급)' ? 'K:이해' : (photo.category === '기본2(중급)' || photo.category === '기본2 (중급)' ? 'A:질문' : 'M:만남'));
    const heritageItem = photo.heritage || (photo.id === 'seed-1' ? '생금집' : (photo.id === 'seed-2' ? '호조벌' : '관곡지'));
    
    return {
      id: photo.id,
      title: photo.title.startsWith('[') ? photo.title : `[${stage}] ${photo.title}`,
      type: 'image' as const,
      fileUrl: photo.imageUrl,
      description: photo.description,
      createdAt: photo.createdAt || new Date(2026, 4, 31),
      displayDate: photo.displayDate || `2026.${photo.eventDate || '05.31'}`,
      makerStage: stage,
      heritage: heritageItem
    };
  });

  // Combine both sources
  const combinedAllResources = [
    ...resources,
    ...activityPhotosAsResources
  ];

  // Merge with locally edited values
  const finalResources = combinedAllResources.map(res => {
    if (editedPosts[res.id]) {
      return {
        ...res,
        ...editedPosts[res.id]
      };
    }
    return res;
  });

  // Filter out deleted posts
  const activeResources = finalResources.filter(res => !deletedIds.includes(res.id));

  // Sort them dynamically (Firestore timestamp, JS Date, or simple logic)
  const sortedCombinedResources = [...activeResources].sort((a, b) => {
    const getMs = (item: any) => {
      if (item.createdAt?.seconds) return item.createdAt.seconds * 1000;
      if (item.createdAt instanceof Date) return item.createdAt.getTime();
      return 0;
    };
    return getMs(b) - getMs(a);
  });

  // Filter the unified resources array exactly like resources
  const filteredResources = sortedCombinedResources.filter(res => {
    // 1. Maker Stage Filter
    const stageMatch = 
      selectedMakerStage === '전체' ||
      res.makerStage === selectedMakerStage ||
      res.title.includes(`[${selectedMakerStage}]`) ||
      (selectedMakerStage && res.title.startsWith(`[${selectedMakerStage.split(':')[0]}`)) ||
      res.title.includes(selectedMakerStage.split(':')[0]) ||
      (selectedMakerStage.includes(':') && res.title.includes(selectedMakerStage.split(':')[1]));

    // 2. Heritage Filter
    const heritageMatch = 
      selectedHeritage === '전체' ||
      res.heritage === selectedHeritage ||
      res.title.includes(selectedHeritage) ||
      (selectedHeritage === '기타' && !['호조벌', '관곡지', '오이도 패총', '군자봉성황제', '능곡선사유적지', '갯골·염전', '생금집'].some(h => res.title.includes(h) || res.heritage === h));

    // 3. Search Query Filter
    const searchMatch = 
      searchQuery.trim() === '' ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.description && res.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return stageMatch && heritageMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-hanji-50 pb-20 font-serif">
      {/* Hero Section */}
      <section className="relative py-24 bg-ink-900 text-hanji-100 overflow-hidden">
        <div className="hanji-texture absolute inset-0 opacity-10" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-gold-500/10 rounded-full border border-gold-500/20"
            >
              {currentLevel.icon}
            </motion.div>
            <div className="space-y-2">
              <span className="text-gold-500 font-serif tracking-[0.3em] text-[10px] uppercase font-bold">{currentLevel.level} Course</span>
              <h1 className="text-4xl md:text-5xl font-serif">{currentLevel.title}</h1>
            </div>
            <p className="text-hanji-200/60 font-serif max-w-2xl mx-auto leading-relaxed italic text-sm md:text-base">
              "{currentLevel.desc}"
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 space-y-32">
        {/* Curriculum Section - Redesigned as the M.A.K.E.R Learning Journey */}
        <div className="space-y-12 font-sans">
          <div className="text-center space-y-4">
            <span className="text-gold-600 font-serif uppercase tracking-[0.3em] text-[10px] font-bold opacity-60">Learning Journey Flow</span>
            <h2 className="text-3xl md:text-4xl font-serif text-ink-900">M.A.K.E.R 학습 과정</h2>
            <p className="text-zinc-500 font-sans text-sm max-w-2xl mx-auto">
              시흥의 소중한 문화유산과 첨단 AI 생성 기법을 결합하여 가치를 발견하고, 표현하고, 연결하는 융합 창작 여정입니다.
            </p>
            <div className="h-0.5 w-16 bg-gold-500 mx-auto opacity-20" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {currentLevelSteps.map((stepItem, i) => {
              const isHighlightExpress = stepItem.step === 'E';
              const isHighlightConnect = stepItem.step === 'R';
              
              return (
                <motion.div 
                  key={stepItem.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`group p-6 bg-white border rounded-xs transition-all duration-500 shadow-xs flex flex-col justify-between hover:shadow-md ${
                    isHighlightExpress 
                      ? 'border-amber-500/45 bg-amber-50/5 hover:border-amber-500' 
                      : isHighlightConnect 
                        ? 'border-emerald-500/45 bg-emerald-50/5 hover:border-emerald-500' 
                        : 'border-gold-500/10 hover:border-gold-500/35'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Step Icon Indicator */}
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm font-bold shadow-xs transition-all duration-500 ${
                        isHighlightExpress
                          ? 'bg-amber-600 text-white'
                          : isHighlightConnect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gold-500/10 text-gold-700 group-hover:bg-gold-500 group-hover:text-white'
                      }`}>
                        {stepItem.step}
                      </div>
                      <span className="text-[10px] text-zinc-400 font-semibold tracking-wider font-sans uppercase">
                        Phase {i + 1}
                      </span>
                    </div>

                    {/* Step details */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-[15px] text-zinc-900 group-hover:text-[#8C6239] transition-colors leading-tight text-left">
                        {stepItem.title}
                      </h3>
                      <p className="text-[12.5px] text-zinc-700 leading-snug break-keep text-left font-medium">
                        {stepItem.desc}
                      </p>
                      <p className="text-[11.5px] text-zinc-500 leading-relaxed break-keep text-left font-light pt-2 border-t border-zinc-100/60">
                        {stepItem.details}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Connected Action Buttons for Current Level to Archive */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to={`/activity-photos?category=${encodeURIComponent(activeMakerLevelKey)}`}
              className="w-full sm:w-auto px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-gold-500 hover:text-gold-400 font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 rounded-xs border border-zinc-950"
            >
              <Eye className="w-4 h-4" />
              <span>학생 활동 보기</span>
            </Link>
            
            <Link 
              to={`/activity-photos?category=${encodeURIComponent(activeMakerLevelKey)}&action=upload`}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#8C6239] hover:bg-[#724C27] text-white font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 rounded-xs border border-[#8C6239]"
            >
              <PenTool className="w-4 h-4" />
              <span>내 활동 등록하기</span>
            </Link>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-16 bg-gold-500/5 border border-gold-500/10 text-center space-y-8 relative overflow-hidden group">
           <div className="absolute inset-0 hanji-texture opacity-5 group-hover:scale-105 transition-transform duration-1000" />
           <div className="relative z-10 space-y-6">
              <h3 className="text-2xl md:text-3xl font-serif text-ink-900 font-bold">다른 단계의 동아리 살펴보기</h3>
              <div className="flex flex-wrap justify-center gap-4">
                 {['기본1 (기초)', '기본2(중급)', '기본3(고급)'].filter(lvl => lvl !== level).map(lvl => (
                   <Link 
                     key={lvl}
                     to={`/clubs/${lvl}`}
                     className="px-10 py-3 bg-white border border-gold-500/20 text-ink-800 font-serif text-sm hover:border-gold-500 hover:text-gold-600 transition-all shadow-sm"
                   >
                     {lvl}
                   </Link>
                 ))}
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
