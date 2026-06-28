import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, X, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ClubPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: '역사탐구동아리' | 'AI크리에이터동아리' | '지역연계탐구팀' | '초등교육과' | '미분류(기타)';
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
}

const DEFAULT_PHOTOS: ClubPhoto[] = [
  {
    id: 'club-seed-1',
    title: '[M:만남] 디지털 역사 탐구 - 우리 지역 문화유산 답사 계획하기',
    eventDate: '05.13',
    dayOfWeek: '수요일',
    displayDate: '2026-05-13',
    description: '동아리 부원들과 함께 우리 지역의 주요 문화유산을 조사하고, 탐방할 코스와 역할을 나누어 구글 문서로 협업하여 답사 계획을 세웁니다.',
    category: '역사탐구동아리',
    author: '역사탐구동아리',
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800',
    viewCount: 95,
    createdAt: null,
    summary: '동아리 부원들과 함께 우리 지역의 주요 문화유산을 조사하고 구글 문서로 협업하여 답사 계획을 세웁니다.',
    keywords: '역사탐구 답사계획 문화유산 구글문서',
    makerStage: 'M:만남',
    heritage: '디지털 역사 탐구',
    majorActivities: [
      '우리 지역 대표 문화유산 목록 조사하기',
      '답사 대상지 선정 및 이동 경로 탐색하기',
      '사진 촬영, 기록, 인터뷰 등 역할 분담하기',
      '구글 문서로 실시간 협업하여 계획서 작성하기'
    ]
  },
  {
    id: 'club-seed-2',
    title: '[E:표현] 문화유산 디지털 표현 - AI를 활용한 가상 유적 복원도 그리기',
    eventDate: '05.20',
    dayOfWeek: '수요일',
    displayDate: '2026-05-20',
    description: '현재 소실되어 터만 남은 문화유산의 역사적 고증 자료를 찾고, 이미지 생성형 AI 도구를 활용하여 과거 전성기 때의 장엄한 유적 모습을 가상 이미지로 복원합니다.',
    category: 'AI크리에이터동아리',
    author: 'AI크리에이터동아리',
    imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800',
    viewCount: 110,
    createdAt: null,
    summary: '역사적 자료를 기반으로 이미지 생성 AI를 활용해 과거 유적의 전성기 모습을 복원합니다.',
    keywords: 'AI그림 가상복원 문화유산 인공지능',
    makerStage: 'E:표현',
    heritage: '문화유산 디지털 표현',
    majorActivities: [
      '역사책과 학술자료에서 유적의 원래 형태 고증하기',
      'AI 이미지 생성용 프롬프트 설계하기 (건축 양식, 재질 등)',
      '다양한 프롬프트 실험을 통해 고증에 가까운 이미지 생성하기',
      '완성된 이미지에 설명을 더해 동아리 게시판에 공유하기'
    ]
  }
];

import CommonArchive from '../components/CommonArchive';

export default function ActivityPhotosPage() {
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
            <span className="text-[#8C6239] font-semibold">2-3. 학생동아리 활동</span>
          </div>
        </div>
      </div>

      <CommonArchive
        pageTitle="2-3. 학생동아리 활동"
        activityType="학생동아리 활동"
        defaultPhotos={DEFAULT_PHOTOS as any}
        categoryTitle="단계"
        categories={['전체', '역사탐구동아리', 'AI크리에이터동아리', '지역연계탐구팀', '초등교육과', '미분류(기타)']}
        learningAreas={[
          '전체',
          '디지털 역사 탐구',
          '문화유산 디지털 표현'
        ]}
        defaultCategoryValue="역사탐구동아리"
        authorOptions={['전체', '교사', '학생', 'AI 디지털 소양']}
        defaultAuthorValue="전체"
        defaultHeritageValue="전체"
      />
    </div>
  );
}
