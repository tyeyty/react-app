// src/pages/WorksListPage.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

interface WorkItem {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

export default function WorksListPage() {
  const navigate = useNavigate();
  const [works, setWorks] = useState<WorkItem[]>([]);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    const { data, error } = await supabase
      .from("works")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
    } else {
      setWorks(data as WorkItem[]);
    }
  };  

  return (
    <div className="p-6 lg:w-[1200px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">내 작업물</h2>
        <button
          onClick={() => navigate("/board/works/new")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          글쓰기
        </button>
      </div>

    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Dev Works</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {works.map((item) => (
          <Link
            key={item.id}
            to={`/board/works/${item.id}`}
            className="border rounded overflow-hidden hover:shadow-lg transition"
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}

            <div className="p-4">
              <h2 className="font-semibold text-lg">{item.title}</h2>
              <p className="text-gray-400 text-sm mt-1">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
    
    </div>
  );
}
