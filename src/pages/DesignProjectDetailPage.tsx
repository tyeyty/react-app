// src/pages/DesignProjectDetailPage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface WorkItem {
  id: number;
  title: string;
  image_url: string | null;
  created_at: string;
  project_id: number;
}

interface Project {
  id: number;
  name: string;
  cover_image: string | null;
}

export default function DesignProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // ⭐ 모달 이미지 상태

  useEffect(() => {
    fetchProject();
    fetchWorks();
  }, [id]);

  // 프로젝트 정보 가져오기
  const fetchProject = async () => {
    const { data, error } = await supabase
      .from("design_projects")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) setProject(data);
  };

  // 해당 프로젝트 작업물 가져오기
  const fetchWorks = async () => {
    const { data, error } = await supabase
      .from("design_works")
      .select("*")
      .eq("project_id", id)
      .order("sort", { ascending: false });

    if (!error && data) setWorks(data as WorkItem[]);
  };

  return (
    <div className="p-6 lg:w-[1200px] mx-auto">
      {/* 프로젝트 헤더 */}
      {project && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
          {project.cover_image && (
            <img
              src={project.cover_image}
              alt={project.name}
              className="w-full max-h-[300px] object-cover rounded"
            />
          )}
        </div>
      )}

      {/* 작업물 리스트 */}
      <h2 className="text-xl font-semibold mb-4">프로젝트 작업물</h2>

      {works.length === 0 ? (
        <p className="text-gray-500">아직 등록된 작업물이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((w) => (
            <div
              key={w.id}
              className="border rounded overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => setSelectedImage(w.image_url!)} // ⭐ 클릭하면 모달 열기
            >
              {w.image_url ? (
                <img
                  src={w.image_url}
                  alt={w.title}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div className="p-4">
                <h3 className="font-semibold text-lg">{w.title}</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {new Date(w.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ⭐ 이미지 모달 */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)} // 클릭하면 닫힘
        >
          <div className="relative max-w-3xl w-full p-4">
            <img
              src={selectedImage}
              alt="enlarged"
              className="w-full max-h-[90vh] object-contain rounded cursor-pointer"
              onClick={() => setSelectedImage(selectedImage)}
            />

            {/* 닫기 버튼 */}
            <button
              className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded shadow"
              onClick={() => setSelectedImage(null)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
