import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function MyPage() {
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { name: newName },
    });

    if (error) {
      setMessage("Name edit failed: " + error.message);
    } else {
      setMessage("이름이 성공적으로 변경되었습니다!");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Info Edit</h2>
      <input
        type="text"
        placeholder="New Name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <button
        onClick={handleUpdate}
        className="border border-gray-300 text-blue-500 px-4 py-2 rounded hover:bg-gray-50">
        수정하기
      </button>
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
