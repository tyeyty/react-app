// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 현재 로그인된 사용자 가져오기
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // 인증 상태 변경 감지
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🏠 홈 페이지</h1>
        <p className="text-gray-700 mb-6">Supabase 기반 프로젝트입니다.</p>

        {user ? (
          <>
            <p className="mb-4">안녕하세요, <strong>{user.email}</strong>님!</p>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
              }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <p className="mb-4">회원가입 후 다양한 기능을 이용해보세요!</p>
            <a href="/signup" className="text-blue-600 underline">
              회원가입 하러 가기
            </a>
          </>
        )}
      </div>
    </div>
  );
}
