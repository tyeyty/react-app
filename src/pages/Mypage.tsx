import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function MyPage() {
  const [currentName, setCurrentName] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");

  // 페이지 로드 시 현재 유저 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setCurrentEmail(data.user.email ?? "");
        setCurrentName(data.user.user_metadata?.name ?? "");
        setNewName(data.user.user_metadata?.name ?? "");
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { name: newName },
    });

    if (error) {
      setMessage("Name edit failed: " + error.message);
    } else {
      setMessage("이름이 성공적으로 변경되었습니다!");
      setCurrentName(newName); // 화면에 업데이트 반영
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto lg:w-[1312px]">
      <h2 className="text-xl font-bold mb-4">My Info</h2>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Email:</p>
        <p className="font-medium">{currentEmail}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">Current Name:</p>
        <p className="font-medium">{currentName}</p>
      </div>

      <input
        type="text"
        placeholder="New Name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="border p-2 rounded mr-2 w-full mb-4"
      />
      <button
        onClick={handleUpdate}
        className="border border-gray-300 text-blue-500 px-4 py-2 rounded hover:text-blue-600 hover:bg-blue-300 transition-colors"
      >
        수정하기
      </button>

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
