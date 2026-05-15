import { useState, FormEvent, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { useAuth } from '../context/AuthContext';
import { Upload, FileText, Image as ImageIcon, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_CATEGORIES } from '../constants';

interface AdminUploadProps {
  initialCategory?: string;
  onUploadSuccess?: () => void;
}

export default function AdminUpload({ initialCategory, onUploadSuccess }: AdminUploadProps) {
  const { isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'image' as 'image' | 'pdf',
    fileUrl: '',
    description: '',
    category: initialCategory || ALL_CATEGORIES[0]
  });

  useEffect(() => {
    if (initialCategory) {
      setForm(prev => ({ ...prev, category: initialCategory }));
    }
  }, [initialCategory]);

  if (!isAdmin) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!auth.currentUser) throw new Error("Not authenticated");

      const resourceData = {
        ...form,
        authorId: auth.currentUser.uid,
        authorEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'resources'), resourceData);
      
      setForm({ ...form, title: '', type: 'image', fileUrl: '', description: '' });
      setIsOpen(false);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'resources');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-gold-500 text-ink-900 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
      >
        <Upload className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-hanji-50 p-8 shadow-2xl border border-gold-500/20 rounded-sm"
            >
              <div className="hanji-texture absolute inset-0 opacity-10 pointer-events-none" />
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-ink-800/40 hover:text-ink-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6 relative z-10 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="text-center">
                  <h2 className="text-2xl font-serif text-ink-900">자료 업로드 (Admin)</h2>
                  <p className="text-[10px] text-gold-600 font-serif uppercase tracking-widest mt-1">아카이브 등록</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 font-serif">
                  <div className="space-y-2">
                    <label className="text-xs text-ink-800/60 uppercase">메뉴 선택 (카테고리)</label>
                    <div className="relative">
                      <select 
                        required
                        value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                        className="w-full bg-white border border-gold-500/10 p-3 outline-none focus:border-gold-500 transition-colors appearance-none text-ink-900"
                      >
                        {ALL_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-800/40 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-ink-800/60 uppercase">자료 제목</label>
                    <input 
                      required
                      type="text"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      className="w-full bg-white border border-gold-500/10 p-3 outline-none focus:border-gold-500 transition-colors text-ink-900"
                      placeholder="자료 명칭을 입력하세요"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setForm({ ...form, type: 'image' })}
                      className={`p-3 border flex items-center justify-center space-x-2 transition-all ${
                        form.type === 'image' ? 'bg-gold-500 border-gold-500 text-ink-900' : 'bg-white border-gold-500/10 text-ink-800/40'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>이미지</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setForm({ ...form, type: 'pdf' })}
                      className={`p-3 border flex items-center justify-center space-x-2 transition-all ${
                        form.type === 'pdf' ? 'bg-gold-500 border-gold-500 text-ink-900' : 'bg-white border-gold-500/10 text-ink-800/40'
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      <span>PDF 문서</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-ink-800/60 uppercase">파일 URL</label>
                    <input 
                      required
                      type="url"
                      value={form.fileUrl}
                      onChange={e => setForm({ ...form, fileUrl: e.target.value })}
                      className="w-full bg-white border border-gold-500/10 p-3 outline-none focus:border-gold-500 transition-colors text-ink-900"
                      placeholder="https://..."
                    />
                    <p className="text-[10px] text-ink-800/40 italic">* 외부 링크나 클라우드 주소를 입력해 주세요.</p>
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full py-4 bg-ink-900 text-gold-500 font-bold uppercase tracking-widest hover:bg-ink-800 transition-all disabled:opacity-50 mt-4"
                  >
                    {loading ? '업로드 중...' : '아카이브에 기록하기'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
