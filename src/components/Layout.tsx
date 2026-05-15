import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-32">
        {children}
      </main>
      
      <footer className="bg-ink-900 text-hanji-200 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gold-500 flex items-center justify-center rounded-sm">
                 <span className="text-ink-900 font-serif font-bold text-lg">M</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-white">시흥문화유산 M.A.K.E.R</span>
            </div>
            <div className="text-hanji-200/60 text-sm leading-relaxed font-serif space-y-4">
               <p>
                  과거를 읽고, 오늘을 쓰며, 내일로 잇는 시흥.
               </p>
               <div className="space-y-0.5">
                  <div className="text-gold-500 font-bold tracking-[0.2em] text-xs">M.A.K.E.R</div>
                  <div className="text-[10px] opacity-40 uppercase tracking-wider">Meet · Ask · Know · Express · Relate</div>
                  <p className="text-xs">
                    만나고, 질문하고, 이해하고, 표현하며, 연결합니다.
                  </p>
               </div>
               <p className="text-gold-500/80">
                  시흥의 이야기는 지금, 우리를 통해 계속 이어지고 있습니다.
               </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-gold-500 font-serif font-medium uppercase tracking-wider text-xs">표현</h4>
            <ul className="space-y-2 text-sm text-hanji-200/40">
              <li><Link to="/" className="hover:text-gold-500 transition-colors">프로젝트 소개</Link></li>
              <li><Link to="/heritage" className="hover:text-gold-500 transition-colors">문화유산 지도</Link></li>
              <li><Link to="/project/갤러리" className="hover:text-gold-500 transition-colors">활동 갤러리</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-gold-500 font-serif font-medium uppercase tracking-wider text-xs">연결</h4>
            <ul className="space-y-2 text-sm text-hanji-200/40">
              <li><Link to="/education" className="hover:text-gold-500 transition-colors">학생 동아리</Link></li>
              <li><Link to="/training" className="hover:text-gold-500 transition-colors">교직원 연수</Link></li>
              <li><Link to="/parents" className="hover:text-gold-500 transition-colors">학부모 참여</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4 border-l border-white/5 pl-0 md:pl-8">
            <h4 className="text-gold-500 font-serif font-medium uppercase tracking-wider text-xs">생금초등학교</h4>
            <div className="text-sm text-hanji-200/40 space-y-1">
              <p>경기도 시흥시 죽율동</p>
              <p>M.A.K.E.R 아카이브 센터</p>
              <p className="pt-4 text-hanji-200/20">© 2026 Saenggeum Elementary School. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Re-importing Link from react-router-dom inside the component to avoid scope issues if needed
import { Link } from 'react-router-dom';
