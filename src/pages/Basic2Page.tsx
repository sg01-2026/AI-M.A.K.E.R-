import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle, ChevronRight, X, Clock, AlertCircle } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
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

export default function Basic2Page() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/basics?category=기본2(중급)', { replace: true });
  }, [navigate]);

  return null;

  const [dbItems, setDbItems] = useState<LearningItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<LearningItem | null>(null);

  useEffect(() => {
    // Query resources matching Level 2
    const q = query(
      collection(db, 'resources'),
      where('category', 'in', ['기본2(중급)', '기본2', '기본2 (중급)'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LearningItem[];
      setDbItems(fetched);
    });

    return () => unsubscribe();
  }, []);

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
              className="p-4 bg-indigo-500/10 rounded-full border border-indigo-500/20"
            >
              <BookOpen className="w-12 h-12 text-indigo-400" />
            </motion.div>
            <div className="space-y-2">
              <span className="text-indigo-400 font-serif tracking-[0.3em] text-[10px] uppercase font-bold block whitespace-nowrap break-keep">
                BASIC 2
              </span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white whitespace-nowrap break-keep">
                기본2
              </h1>
            </div>
            <p className="text-zinc-300 font-sans max-w-2xl mx-auto leading-relaxed text-sm md:text-base break-keep">
              기본2 학습 내용을 차시별로 확인하고 학습 활동에 참여할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content List */}
      <main className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div className="flex items-center space-x-3 pb-3 border-b border-[#EADFCB]/30">
          <span className="w-2.5 h-2.5 bg-[#8C6239] rotate-45 shrink-0" />
          <h2 className="text-2xl font-bold text-zinc-900 whitespace-nowrap break-keep">
            기본2 학습 내용
          </h2>
        </div>

        {dbItems.length === 0 ? (
          <div className="p-16 max-w-xl mx-auto text-center bg-white border border-[#EADFCB]/20 rounded-md shadow-xs">
            <p className="text-zinc-500 font-sans text-sm font-medium leading-relaxed mb-1 whitespace-nowrap break-keep">
              기본2 학습 내용은 추후 등록됩니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dbItems.map((item, idx) => {
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
                      <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-sm whitespace-nowrap break-keep">
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
                        {selectedItem.makerStage || '기본2'}
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
