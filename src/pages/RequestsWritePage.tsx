// src/pages/RequestsWritePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function RequestsWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState(""); // 익명 작성자
  const [password, setPassword] = useState(""); // 익명용 비밀번호
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userResult = await supabase.auth.getUser();
    const user = userResult.data.user;

    let insertData: any = { title, content };

    if (user) {
      // 로그인 사용자
      insertData.user_id = user.id;
    } else {
      // 익명 사용자
      if (!nickname || !password) return alert("닉네임과 비밀번호를 입력해주세요.");
      insertData.nickname = nickname;
      insertData.password = password; // 실제 서비스라면 bcrypt 등으로 해시 권장
    }

    const { error } = await supabase.from("requests").insert([insertData]);

    if (error) {
      console.error(error);
      alert("등록 실패");
    } else {
      alert("등록 성공!");
      navigate("/board/requests");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">작업 의뢰 등록</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded h-40"
          required
        />

        {/* 익명일 경우만 표시 */}
        {!supabase.auth.getUser() && (
          <>
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="비밀번호 (글 수정/삭제용)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          등록
        </button>
      </form>
    </div>
  );
}
