import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, BookOpen, Users, Award, Calendar, Share2, Info, GraduationCap, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const menuItems = [
  {
    title: '학생동아리',
    icon: <Users className="w-4 h-4" />,
    sub: ['기본1 (기초)', '기본2(중급)', '기본3(고급)', '학생 활동사진']
  },
  {
    title: '지역문화유산 프로젝트',
    icon: <BookOpen className="w-4 h-4" />,
    sub: ['호조벌', '관곡지', '오이도 패총', '군자봉성황제', '능곡선사유적지', '갯골·염전', '생금집']
  },
  {
    title: '지도안 · 학습지',
    icon: <GraduationCap className="w-4 h-4" />,
    sub: ['수업 지도안', '활동지', '프로젝트 활동 자료', '프롬프트 예시', 'AI 활용 가이드']
  },
  {
    title: 'AI페스티벌',
    icon: <Calendar className="w-4 h-4" />,
    sub: ['학생 작품 전시', 'AI 체험 활동', '문화유산 프로젝트 발표', 'AI 창작 발표회']
  },
  {
    title: '교직원연수',
    icon: <Info className="w-4 h-4" />,
    sub: ['AI활용연수', '디지털수업사례', 'AI체험프로그램', '프로젝트 운영자료']
  },
  {
    title: '학부모참여 프로젝트학습',
    icon: <Users className="w-4 h-4" />,
    sub: ['가족 참여 활동', '지역문화 체험', 'AI 체험 프로그램', '학부모 프로젝트 결과물']
  },
  {
    title: '홍보',
    icon: <Share2 className="w-4 h-4" />,
    sub: ['갤러리', '프로젝트소식', '지역교과서탑재', '활동영상']
  },
  {
    title: 'AI경진대회',
    icon: <Award className="w-4 h-4" />,
    sub: ['대회 안내', '작품 제출', '우수작 발표', '수상작 전시']
  }
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const location = useLocation();
  const { user, isAdmin, logout, login } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setShowLoginModal(false);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = await login(loginId, loginPw);
    if (success) {
      setShowLoginModal(false);
      setLoginId('');
      setLoginPw('');
    } else {
      setLoginError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getHref = (itemTitle: string, subItem: string) => {
    if (itemTitle === '학생동아리') {
      if (subItem === '학생 활동사진') return '/activity-photos';
      return `/clubs/${subItem}`;
    }
    if (itemTitle === '지도안 · 학습지') {
      const sectionMap: Record<string, string> = {
        '수업 지도안': 'lesson',
        '활동지': 'activity',
        '프로젝트 활동 자료': 'project-res',
        '프롬프트 예시': 'prompt',
        'AI 활용 가이드': 'guide'
      };
      return `/resources#${sectionMap[subItem] || ''}`;
    }
    if (itemTitle === '교직원연수') {
      const sectionMap: Record<string, string> = {
        'AI활용연수': 'ai-training',
        '디지털수업사례': 'digital-case',
        'AI체험프로그램': 'ai-experience',
        '프로젝트 운영자료': 'project-data'
      };
      return `/staff#${sectionMap[subItem] || ''}`;
    }
    if (itemTitle === '홍보') {
      const sectionMap: Record<string, string> = {
        '갤러리': 'gallery',
        '프로젝트소식': 'news',
        '지역교과서탑재': 'textbook',
        '활동영상': 'videos'
      };
      return `/promotion#${sectionMap[subItem] || ''}`;
    }
    if (itemTitle === 'AI경진대회') {
      const sectionMap: Record<string, string> = {
        '대회 안내': 'info',
        '작품 제출': 'submit',
        '우수작 발표': 'winners',
        '수상작 전시': 'exhibit'
      };
      return `/contest#${sectionMap[subItem] || ''}`;
    }
    
    // Default cases for other menus can be projects or specific pages
    if (subItem === '활동 갤러리' || subItem === '갤러리') return '/project/갤러리'; // Example handler
    
    return `/project/${subItem}`;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-hanji-100/95 shadow-md' : 'bg-transparent'
      }`}
    >
      {/* Top Utility Bar */}
      <div className="border-b border-gold-500/10 bg-hanji-200/40 backdrop-blur-sm py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-end items-center">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-[8px] text-gold-600 font-serif uppercase tracking-widest bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/20">
                  {isAdmin ? (user.uid === 'mock-admin' ? 'System Admin' : 'Administrator') : 'Student'}
                </span>
                <span className="text-[10px] text-ink-900/60 font-serif">{user.email}</span>
              </div>
              <button 
                onClick={() => logout()}
                className="text-ink-800/40 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="group flex items-center space-x-1.5 text-ink-800/40 text-[8px] font-serif hover:text-gold-600 transition-all uppercase tracking-widest"
            >
              <ShieldCheck className="w-2.5 h-2.5" />
              <span>Admin Access</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gold-500 flex items-center justify-center rounded-sm group-hover:rotate-12 transition-transform duration-300 shadow-lg">
               <span className="text-ink-900 font-serif font-bold text-xl">M</span>
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-lg leading-tight tracking-tight transition-colors ${scrolled ? 'text-gold-500' : 'text-white'}`}>시흥문화유산</span>
              <span className={`text-[9px] font-serif uppercase tracking-[0.2em] font-bold ${scrolled ? 'text-ink-900/60' : 'text-gold-500/80'}`}>M.A.K.E.R Project</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden xl:flex items-center space-x-6">
            {menuItems.map((item) => (
              <div 
                key={item.title} 
                className="relative group"
                onMouseEnter={() => setActiveSub(item.title)}
                onMouseLeave={() => setActiveSub(null)}
              >
                <button className={`flex items-center space-x-1 py-4 transition-colors duration-200 text-[13px] font-bold ${
                  scrolled ? 'text-gold-600 hover:text-ink-900' : 'text-gold-500 hover:text-white'
                }`}>
                  <span>{item.title}</span>
                  <ChevronDown className="w-3 h-3 opacity-30" />
                </button>
                
                <AnimatePresence>
                  {activeSub === item.title && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full left-0 w-52 bg-hanji-50 border border-gold-500/20 shadow-2xl rounded-sm p-1.5 z-[100]"
                    >
                      <div className="absolute inset-0 hanji-texture opacity-20 pointer-events-none" />
                      {item.sub.map((subItem) => (
                        <Link
                          key={subItem}
                          to={getHref(item.title, subItem)}
                          className="block px-3 py-2 text-xs text-ink-800 hover:bg-gold-500/10 hover:text-gold-600 rounded-sm transition-all duration-200"
                        >
                          {subItem}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-ink-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-hanji-100 lg:hidden pt-20 px-4 overflow-y-auto"
          >
            <div className="hanji-texture absolute inset-0 opacity-10 pointer-events-none" />
            <div className="space-y-6 pb-20 relative z-10">
              {menuItems.map((item) => (
                <div key={item.title} className="space-y-3">
                  <div className="flex items-center space-x-2 text-gold-600 font-serif border-b border-gold-500/20 pb-2">
                    {item.icon}
                    <span className="text-lg">{item.title}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 pl-6">
                    {item.sub.map((subItem) => (
                      <Link
                        key={subItem}
                        to={getHref(item.title, subItem)}
                        onClick={() => setIsOpen(false)}
                        className="text-ink-800 hover:text-gold-600 transition-colors duration-200"
                      >
                        • {subItem}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
              onClick={() => setShowLoginModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-hanji-50 border border-gold-500/30 shadow-2xl p-8"
            >
              <div className="hanji-texture absolute inset-0 opacity-10 pointer-events-none" />
              <div className="relative z-10 space-y-8">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gold-500 flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3 group">
                     <ShieldCheck className="w-8 h-8 text-ink-900 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-serif text-ink-900">Administrator Access</h3>
                  <p className="text-ink-800/40 text-xs font-serif italic uppercase tracking-widest">Authorized Personnel Only</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-ink-900/40 font-serif uppercase tracking-widest ml-1">Identity ID</label>
                    <input 
                      type="text" 
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-ink-900/10 focus:border-gold-500/40 outline-none font-serif text-sm transition-all"
                      placeholder="Enter ID"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-ink-900/40 font-serif uppercase tracking-widest ml-1">Access Token</label>
                    <input 
                      type="password" 
                      value={loginPw}
                      onChange={(e) => setLoginPw(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-ink-900/10 focus:border-gold-500/40 outline-none font-serif text-sm transition-all"
                      placeholder="Enter Password"
                      required
                    />
                  </div>
                  
                  {loginError && (
                    <p className="text-red-500 text-[10px] font-serif text-center">{loginError}</p>
                  )}

                  <button 
                    type="submit"
                    className="w-full py-4 bg-ink-900 text-gold-500 font-serif text-sm hover:bg-ink-800 transition-colors uppercase tracking-[0.2em] font-bold shadow-lg"
                  >
                    Authenticate
                  </button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ink-900/10"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-hanji-50 px-2 text-ink-800/20 font-serif">OR continue with</span></div>
                </div>

                <button 
                  onClick={handleGoogleLogin}
                  className="w-full py-4 bg-white border border-ink-900/10 text-ink-900 font-serif text-sm hover:border-gold-500/30 transition-all flex items-center justify-center space-x-3 shadow-sm"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                  <span className="uppercase tracking-widest font-bold text-[11px]">Google Workspace</span>
                </button>
                
                <p className="text-center text-[9px] text-ink-800/20 font-serif leading-relaxed">
                  Notice: All access attempts are recorded for investigative audit purposes.<br/>
                  Maker Project Information Security Division.
                </p>
              </div>
              
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-ink-800/20 hover:text-ink-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
