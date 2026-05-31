import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../lib/firebase';
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
  const { user, isAdmin } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [makerStage, setMakerStage] = useState('');
  const [heritageSelect, setHeritageSelect] = useState('호조벌');
  const [customHeritage, setCustomHeritage] = useState('');
  const [displayDate, setDisplayDate] = useState(new Date().toISOString().split('T')[0]);
  const [errorMsg, setErrorMsg] = useState('');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      // Auto-set title if empty
      if (!form.title) {
        setForm(prev => ({ ...prev, title: file.name.split('.')[0] }));
      }
      // Auto-set type based on extension
      if (file.type.includes('pdf')) {
        setForm(prev => ({ ...prev, type: 'pdf' }));
      } else if (file.type.includes('image')) {
        setForm(prev => ({ ...prev, type: 'image' }));
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (!user) throw new Error("로그인이 필요합니다.");

      let finalFileUrl = form.fileUrl;

      if (selectedFile) {
        setUploadProgress(10);
        const storageRef = ref(storage, `resources/${Date.now()}_${selectedFile.name}`);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        setUploadProgress(50);
        finalFileUrl = await getDownloadURL(snapshot.ref);
        setUploadProgress(90);
      }

      if (!finalFileUrl) {
         throw new Error("파일을 업로드하거나 파일 URL(외부 링크)을 작성해주세요.");
      }

      const chosenHeritage = heritageSelect === '기타' ? customHeritage.trim() : heritageSelect;
      const finalTitlePart = form.title.trim() ? ` - ${form.title.trim()}` : '';
      const baseTitle = heritageSelect === '기타' ? customHeritage.trim() : heritageSelect;
      const computedTitleWithoutStage = baseTitle ? (baseTitle + finalTitlePart) : form.title.trim();

      const finalTitle = makerStage ? `[${makerStage}] ${computedTitleWithoutStage}` : computedTitleWithoutStage;

      const resourceData = {
        ...form,
        title: finalTitle,
        fileUrl: finalFileUrl,
        authorId: user.uid,
        authorEmail: user.email,
        createdAt: serverTimestamp(),
        displayDate: displayDate,
        makerStage: makerStage || null,
        heritage: chosenHeritage || null
      };

      await addDoc(collection(db, 'resources'), resourceData);
      
      setForm({ ...form, title: '', type: 'image', fileUrl: '', description: '' });
      setSelectedFile(null);
      setMakerStage('');
      setHeritageSelect('호조벌');
      setCustomHeritage('');
      setDisplayDate(new Date().toISOString().split('T')[0]);
      setUploadProgress(0);
      setIsOpen(false);
      alert('아카이브에 성공적으로 자료가 기록되었습니다!');
      if (onUploadSuccess) onUploadSuccess();
    } catch (error: any) {
      console.error(error);
      let errMsg = '자료 기록 중 오류가 발생했습니다.';
      if (error instanceof Error) {
        errMsg = error.message;
      } else if (typeof error === 'string') {
        errMsg = error;
      } else if (typeof error === 'object' && error !== null) {
        errMsg = error.message || JSON.stringify(error);
      }

      if (errMsg.includes('permission-denied') || errMsg.includes('Permission denied') || errMsg.includes('Missing or insufficient permissions')) {
        errMsg = '권한이 없습니다. (관리자 계정 ' + (user?.email || '') + '으로 로그인했는지 확인해주세요. 구글 토큰 전파 시간이나 DB 사용자 정보 불일치일 수 있습니다.)';
      }
      setErrorMsg(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-3">
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center space-x-3"
          >
            <div className="bg-ink-900/80 backdrop-blur-md px-4 py-2 border border-gold-500/30 shadow-xl rounded-sm">
              <p className="text-[10px] text-gold-500 font-serif uppercase tracking-widest font-bold">New Post</p>
            </div>
            <button 
              onClick={() => setIsOpen(true)}
              className="bg-gold-500 text-ink-900 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-4 border-ink-900 animate-pulse"
            >
              <Upload className="w-7 h-7" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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

                  <div className="space-y-4">
                    <label className="text-xs text-ink-800/60 uppercase">자료 파일 선택</label>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                    
                    {!selectedFile ? (
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 border-2 border-dashed border-gold-500/20 hover:border-gold-500/50 transition-all flex flex-col items-center justify-center space-y-3 group bg-gold-500/5"
                      >
                        <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5 text-gold-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-ink-900">내 컴퓨터에서 파일 선택</p>
                          <p className="text-[10px] text-ink-800/40 uppercase tracking-tighter">Images or PDF (Max 10MB)</p>
                        </div>
                      </button>
                    ) : (
                      <div className="p-4 bg-white border border-gold-500/30 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {selectedFile.type.includes('pdf') ? (
                            <FileText className="w-5 h-5 text-red-500" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-blue-500" />
                          )}
                          <div>
                            <p className="text-sm text-ink-900 font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                            <p className="text-[10px] text-ink-800/40">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="p-1 hover:bg-gold-500/10 rounded-full text-ink-800/40 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-ink-800/60 uppercase block font-bold">M.A.K.E.R 단계 선택</label>
                    <div className="relative">
                      <select 
                        value={makerStage}
                        onChange={e => setMakerStage(e.target.value)}
                        className="w-full bg-white border border-gold-500/10 p-3 outline-none focus:border-gold-500 transition-colors appearance-none text-ink-900 cursor-pointer text-xs"
                      >
                        <option value="">선택 안 함 (없음)</option>
                        <option value="M:만남">M:만남</option>
                        <option value="A:질문">A:질문</option>
                        <option value="K:이해">K:이해</option>
                        <option value="E:표현">E:표현</option>
                        <option value="R:연결">R:연결</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-800/40 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-ink-800/60 uppercase block font-bold">문화유산 분류 선택</label>
                    <div className="relative">
                      <select 
                        value={heritageSelect}
                        onChange={e => setHeritageSelect(e.target.value)}
                        className="w-full bg-white border border-gold-500/10 p-3 outline-none focus:border-gold-500 transition-colors appearance-none text-ink-900 cursor-pointer text-xs"
                      >
                        <option value="호조벌">호조벌</option>
                        <option value="관곡지">관곡지</option>
                        <option value="오이도 패총">오이도 패총</option>
                        <option value="군자봉성황제">군자봉성황제</option>
                        <option value="능곡선사유적지">능곡선사유적지</option>
                        <option value="갯골·염전">갯골·염전</option>
                        <option value="생금집">생금집</option>
                        <option value="기타">기타(입력)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-800/40 pointer-events-none" />
                    </div>
                  </div>

                  {heritageSelect === '기타' && (
                    <div className="space-y-2">
                      <label className="text-xs text-ink-800/60 uppercase block font-bold">기타 문화유산 직접 입력</label>
                      <input 
                        required
                        type="text"
                        value={customHeritage}
                        onChange={e => setCustomHeritage(e.target.value)}
                        className="w-full bg-white border border-gold-500/10 p-3 outline-none focus:border-gold-500 transition-colors text-ink-900 text-xs"
                        placeholder="예: 생금쌍우물"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs text-ink-800/60 uppercase block font-bold">자료 상세 제목 (선택사항)</label>
                    <input 
                      type="text"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      className="w-full bg-white border border-gold-500/10 p-3 outline-none focus:border-gold-500 transition-colors text-ink-900 text-xs"
                      placeholder="예: AI 활용 학습지, 활동 일지 등"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-ink-800/60 uppercase">등록일자 직접 선택</label>
                    <input 
                      required
                      type="date"
                      value={displayDate}
                      onChange={e => setDisplayDate(e.target.value)}
                      className="w-full bg-white border border-gold-500/10 p-3 outline-none focus:border-gold-500 transition-colors text-ink-900"
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

                  {!selectedFile && (
                    <div className="space-y-2">
                      <label className="text-xs text-ink-800/60 uppercase">파일 URL (선택사항)</label>
                      <input 
                        type="url"
                        value={form.fileUrl}
                        onChange={e => setForm({ ...form, fileUrl: e.target.value })}
                        className="w-full bg-white border border-gold-500/10 p-3 outline-none focus:border-gold-500 transition-colors text-ink-900"
                        placeholder="https://..."
                      />
                      <p className="text-[10px] text-ink-800/40 italic">* 파일을 직접 올리지 않을 경우 외부 링크를 입력해 주세요.</p>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 font-sans text-xs rounded-sm mb-2 leading-relaxed">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <button 
                    disabled={loading}
                    className="w-full py-4 bg-ink-900 text-gold-500 font-bold uppercase tracking-widest hover:bg-ink-800 transition-all disabled:opacity-50 mt-4 relative overflow-hidden"
                  >
                    {loading && (
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="absolute inset-0 bg-gold-500/20"
                      />
                    )}
                    <span className="relative z-10">{loading ? '제출 중...' : '아카이브에 기록하기'}</span>
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
