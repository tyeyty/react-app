// src/components/Header.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 현재 사용자 정보 가져오기
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // 인증 상태 감지
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 좌측 로고 */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold tracking-wide font-sans pt-4">
              GH JO
            </h1>
            <div className="flex">
            <a
              href="https://www.linkedin.com/in/tyeyty/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M18 3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zM8 10a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-5a1 1 0 0 0-1-1m3-1a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-3.66c.305-.344.82-.748 1.393-.993c.333-.142.834-.2 1.182-.09a.55.55 0 0 1 .293.188c.052.07.132.226.132.555v4a1 1 0 0 0 2 0v-4c0-.67-.17-1.266-.524-1.744a2.54 2.54 0 0 0-1.301-.907c-.902-.283-1.901-.126-2.568.16a6 6 0 0 0-.623.312A1 1 0 0 0 11 9M8 7a1 1 0 1 0 0 2a1 1 0 0 0 0-2"/></g></svg>
            </a>
            <a
              href="https://github.com/tyeyty"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>            </a> 
            </div>                         
            
          </div>

          {/* 우측 메뉴 */}
          <nav className="hidden md:flex items-center">
            <div className="space-x-6">
              <a href="/" className="text-blue-700 ml-2 hover:text-blue-900">
                Home
              </a>
              <a href="/about" className="text-blue-700 ml-2 hover:text-blue-900">
                About
              </a>
              <a href="/trips" className="text-blue-700 ml-2 hover:text-blue-900">
                Trips
              </a>
              <a href="/board" className="text-blue-700 ml-2 hover:text-blue-900">
                Works
              </a>
              <a href="/portfolio" className="text-blue-700 ml-2 hover:text-blue-900">
                My Portfolio
              </a>              
              <a href="/shop" className="text-blue-700 ml-2 hover:text-blue-900">
                Shop
              </a>
              <a href="/contact" className="text-blue-700 ml-2 hover:text-blue-900">
                Contact
              </a>              
            </div>

            {user ? (
              <div className="flex items-center space-x-2 pl-2">
                <span className="text-xs">
                    <strong>{user.user_metadata?.name || user.email}</strong>님 환영합니다
                </span>
                <a href="/mypage" className="text-gray-600 ml-2 hover:text-gray-900 text-xs"> Mypage</a> 
                <a href="/messages" className="text-gray-700 hover:text-gray-900 text-xs">쪽지관리</a>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="ml-2 px-3 py-1 border rounded text-gray-700 hover:bg-gray-100 text-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <a
                  href="/login"
                  className="ml-2 px-3 py-1 border rounded text-gray-700 hover:bg-gray-100 text-xs">
                  Login
                </a>
                <a
                  href="/signup"
                  className="ml-2 px-3 py-1 border rounded text-gray-700 hover:bg-gray-100 text-xs">
                  Signup
                </a>
              </div>
            )}
          </nav>

          {/* 모바일 햄버거 */}
          <div className="md:hidden">
            <button className="text-gray-700 focus:outline-none">
              {/* 아이콘 넣을 수 있음 */}
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
