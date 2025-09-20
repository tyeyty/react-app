// src/pages/RequestsListPage.tsx
import { useNavigate } from "react-router-dom";

export default function RequestsListPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">작업 의뢰</h2>
        <button
          onClick={() => navigate("/board/requests/new")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          글쓰기
        </button>
      </div>

      <p>requests 테이블에서 불러온 리스트가 들어갑니다.</p>
    </div>
  );
}
