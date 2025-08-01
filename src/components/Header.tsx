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
    <>
      {/* ✅ 데스크탑 헤더 */}
      <div className="hidden xl:block fixed w-full top-0 left-0 bg-gray-100 border-b border-gray-300 h-[40px] z-50">
        <div className="2xl:w-[1300px] mx-auto">
          <div className="px-4 py-2 flex items-center justify-between text-sm">
            {/* 왼쪽: 로고 및 SNS 링크 */}
            <div className="flex items-center space-x-4">
              <a href="/" className="text-[12px] font-bold">🏠 Trip App</a>
              <div className="flex items-center space-x-2">
                <a href="https://www.instagram.com/dalsaramdotcom/" target="_blank" rel="noreferrer">
                  <img src="/img/VER2/SNS-Logo2_instagram2.png" width="20" />
                </a>
                <a href="https://www.youtube.com/@dalsaramdotcom" target="_blank" rel="noreferrer">
                  <img src="/img/VER2/SNS-Logo2_youtube.png" width="20" />
                </a>
              </div>
            </div>

            {/* 오른쪽: 로그인/로그아웃 메뉴 */}
            <div className="space-x-2">
              {user ? (
                <>
                  <span>안녕하세요, <strong>{user.email}</strong>님!</span>
                  <a href="#" className="hover:underline">공지사항</a>
                  <a href="#" className="hover:underline">마이페이지</a>
                  <a href="#" className="hover:underline">쪽지</a>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setUser(null);
                    }}
                    className="text-red-500 hover:underline"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="text-blue-600 hover:underline">로그인</a>
                  <a href="/signup" className="hover:underline">회원가입</a>
                  <a href="#" className="hover:underline">공지사항</a>
                  <a href="#" className="hover:underline">아이디/비번 찾기</a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 모바일 헤더 */}
      <div className="xl:hidden h-[60px] flex items-center justify-center px-4 py-2 bg-blue-600 text-white relative">
        <a href="/" className="absolute left-1/2 -translate-x-1/2 font-bold">Trip App</a>
        <div className="absolute right-4 text-xs">
          {user ? (
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
              }}
              className="text-white hover:underline"
            >
              로그아웃
            </button>
          ) : (
            <a href="/login" className="hover:underline">로그인</a>
          )}
        </div>
      </div>
    </>
  );
}
