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
        <h1 className="text-4xl font-bold mb-4">🏠 하루마루하와의 사이트입니다</h1>
        <p className="text-gray-700 mb-6">React+Supabase 기반 Trip 루트/ 쪽지/ 게시판 프로젝트입니다.</p>
      </div>
    </div>
  );
}
