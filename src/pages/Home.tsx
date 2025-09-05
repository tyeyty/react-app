import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  useEffect(() => {
    // 필요하다면 초기 로직 작성 가능
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🏠 GH's Portfolio Site</h1>
        <p className="text-gray-700 mb-6">
          This is a Trip route/message/bulletin board project built with React and Supabase.
        </p>
      </div>
    </div>
  );
}
