// src/pages/WorksListPage.tsx
import { useNavigate } from "react-router-dom";

export default function WorksListPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">내 작업물</h2>
        <button
          onClick={() => navigate("/board/works/new")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          글쓰기
        </button>
      </div>

      <p>works 테이블에서 불러온 리스트가 들어갑니다.</p>
    </div>
  );
}
