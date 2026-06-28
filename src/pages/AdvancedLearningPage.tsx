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
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
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

interface IntensivePhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: '심화1' | '심화2' | '심화3';
  eventDate: string;
  author: string;
  viewCount: number;
  createdAt: any;
  displayDate?: string;
  makerStage?: string;
  heritage?: string; // Storing the "학습 영역"
  summary?: string;
  keywords?: string;
  attachmentUrl?: string;
  dayOfWeek?: string;
  majorActivities?: string[];
  warnings?: string[];
  toolType?: string;
}

const DEFAULT_PHOTOS: IntensivePhoto[] = [
  {
    id: 'intensive-seed-1',
    title: '[M:만남] 디지털 영상 편집 - 영상과 이미지를 불러와 하나의 영상으로 만들기',
    eventDate: '06.24',
    dayOfWeek: '수요일',
    displayDate: '2026-06-24',
    description: '캡컷에 여러 개의 영상과 이미지를 불러오고, 필요한 순서대로 배치하여 하나의 영상으로 제작합니다. 필요 없는 부분을 자르고 각 장면의 길이를 조절합니다.',
    category: '심화1',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=800',
    viewCount: 120,
    createdAt: null,
    summary: '캡컷에 여러 개의 영상과 이미지를 불러오고, 필요한 순서대로 배치하여 하나의 영상으로 제작합니다.',
    keywords: '캡컷 타임라인 컷편집 영상제작 디지털영상편집',
    makerStage: 'M:만남',
    heritage: '디지털 영상 편집',
    majorActivities: [
      '미디어 파일 가져오기 (Import)',
      '타임라인에 미디어 순서대로 배치하기',
      '불필요한 구간 삭제하기 (Split & Cut)',
      '클립 끝부분을 드래그하여 길이 조절하기',
      '전체 작업 미리보기 확인하기'
    ]
  },
  {
    id: 'intensive-seed-2',
    title: '[K:이해] 개인정보 보호 - 움직이는 대상을 따라 모자이크와 블러 효과 적용하기',
    eventDate: '06.26',
    dayOfWeek: '금요일',
    displayDate: '2026-06-26',
    description: '영상 속 얼굴, 이름표와 차량 번호 등 가려야 할 부분을 확인하고, 움직이는 대상을 따라가도록 모자이크와 블러 효과를 적용합니다.',
    category: '심화1',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800',
    viewCount: 145,
    createdAt: null,
    summary: '영상 속 얼굴, 이름표와 차량 번호 등 가려야 할 부분을 확인하고 모자이크와 블러 효과를 적용합니다.',
    keywords: '개인정보보호 모자이크 블러 키프레임',
    makerStage: 'K:이해',
    heritage: '개인정보 보호',
    majorActivities: [
      '영상 내 가려야 할 요소 식별하기',
      '모자이크 / 블러 효과 필터 추가하기',
      '대상체의 움직임 파악하기',
      '키프레임(Keyframe)을 생성하여 효과 위치 동기화하기',
      '가려진 상태 및 자연스러움 확인하기'
    ],
    warnings: [
      '타인의 얼굴이나 차량 번호판이 외부에 유출되지 않도록 신중하게 검토하여 편집을 완료해 주세요.'
    ]
  },
  {
    id: 'intensive-seed-3',
    title: '[E:표현] 디지털 영상 편집 - 장면 전환, 필터와 스티커로 영상 꾸미기',
    eventDate: '06.29',
    dayOfWeek: '월요일',
    displayDate: '2026-06-29',
    description: '영상의 장면 사이에 전환 효과를 넣고, 필터와 스티커를 활용하여 영상의 분위기와 내용을 효과적으로 표현합니다.',
    category: '심화1',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800',
    viewCount: 95,
    createdAt: null,
    summary: '영상의 장면 사이에 전환 효과를 넣고, 필터와 스티커를 활용하여 영상의 분위기와 내용을 효과적으로 표현합니다.',
    keywords: '장면전환 비디오필터 스티커 영상꾸미기 디지털영상편집',
    makerStage: 'E:표현',
    heritage: '디지털 영상 편집',
    majorActivities: [
      '트랜지션 효과 선택 및 클립 사이에 배치하기',
      '시각적 분위기 조정을 위한 필터 적용하기',
      '메시지 강조를 위한 디지털 스티커 및 에셋 오버레이',
      '스티커의 노출 시간 및 크기 맞춤 조정하기'
    ]
  },
  {
    id: 'intensive-seed-4',
    title: '[E:표현] AI 자막 활용 - 영상에 제목과 자막 넣기',
    eventDate: '07.01',
    dayOfWeek: '수요일',
    displayDate: '2026-07-01',
    description: '영상의 시작 부분에 제목을 넣고 장면별 설명 자막을 작성합니다. 자동 자막을 생성한 후 잘못 인식된 글자와 문장을 직접 수정합니다.',
    category: '심화1',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800',
    viewCount: 180,
    createdAt: null,
    summary: '영상의 시작 부분에 제목을 넣고 자동 자막을 생성한 후 잘못 인식된 자막을 직접 수정합니다.',
    keywords: '타이틀자막 설명자막 자동자막 AI자막',
    makerStage: 'E:표현',
    heritage: 'AI 자막 활용',
    majorActivities: [
      '영상 인트로 타이틀 텍스트 디자인',
      'AI 자동 음성인식 기반 자동 캡션(Auto Captions) 기능 실행',
      '줄바꿈 및 한글 오타 교정 작업',
      '가독성을 높이는 자막 서체, 크기 및 배경 바 설정하기',
      '자막과 오디오 음성 싱크 맞추기'
    ]
  },
  {
    id: 'intensive-seed-5',
    title: '[R:연결] 디지털 영상 편집 - 배경음악과 효과음을 넣고 영상 완성하기',
    eventDate: '07.03',
    dayOfWeek: '금요일',
    displayDate: '2026-07-03',
    description: '영상의 내용에 어울리는 배경음악과 효과음을 넣고 소리의 크기를 조절합니다. 완성된 영상을 확인한 후 적절한 파일 형식으로 저장합니다.',
    category: '심화1',
    author: 'AI 디지털 소양',
    imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800',
    viewCount: 210,
    createdAt: null,
    summary: '영상의 내용에 어울리는 배경음악과 효과음을 넣고 적절한 파일 형식으로 동영상을 내보내기합니다.',
    keywords: '배경음악 효과음 볼륨조절 오디오편집 영상내보내기 디지털영상편집',
    makerStage: 'R:연결',
    heritage: '디지털 영상 편집',
    majorActivities: [
      '영상의 성격 and 톤에 맞는 사운드 에셋 선택하기',
      '오디오 트랙 추가 및 오디오 볼륨(Gain) 페이드인/아웃 조절',
      '핵심 연출 구간에 임팩트를 주는 효과음(SFX) 삽입하기',
      '전체 재생 및 음향 믹싱 상태 최종 검수',
      'MP4/MOV 등으로 렌더링 내보내기(Export)'
    ]
  }
];

export default function AdvancedLearningPage() {
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
            <span className="text-[#8C6239] font-semibold">2-2. 수준별 심화학습</span>
          </div>
        </div>
      </div>

      <CommonArchive
        pageTitle="2-2. 수준별 심화학습"
        activityType="수준별 심화학습"
        defaultPhotos={DEFAULT_PHOTOS as any}
        categoryTitle="단계"
        categories={['전체', '심화1', '심화2', '심화3', '미분류(기타)']}
        learningAreas={[
          '전체',
          '디지털 영상 편집',
          '개인정보 보호',
          'AI 자막 활용'
        ]}
        defaultCategoryValue="심화1"
        authorOptions={['전체', '교사', '학생', 'AI 디지털 소양']}
        defaultAuthorValue="전체"
        defaultHeritageValue="전체"
      />
    </div>
  );
}
