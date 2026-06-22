import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdvancedLearningPage() {
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
            <span style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}>2-2. 수준별 심화학습</span>
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className="relative py-24 px-4 bg-[#FCFAF5] border-b border-[#EADFCB]/30 overflow-hidden">
        <div className="hanji-texture absolute inset-0 opacity-15 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-xs text-[#8C6239] font-serif uppercase tracking-[0.3em] font-bold block whitespace-nowrap break-keep">
            ADVANCED DIGITAL LITERACY
          </span>
          <h1 
            className="text-4xl md:text-5xl font-serif text-[#1A1A1A] font-bold tracking-tight"
            style={{ whiteSpace: 'nowrap', wordBreak: 'keepAll', overflowWrap: 'normal' }}
          >
            2-2. 수준별 심화학습
          </h1>
          <div className="h-0.5 w-16 bg-[#8C6239]/40 mx-auto" />
        </div>
      </div>

      {/* Main Body Content */}
      <div className="max-w-5xl mx-auto px-4 mt-20">
        <div className="bg-white border border-[#EADFCB]/30 p-16 rounded-sm shadow-xs text-center">
          <p className="text-xl font-serif text-[#1A1A1A]">심화학습</p>
        </div>
      </div>
    </div>
  );
}
