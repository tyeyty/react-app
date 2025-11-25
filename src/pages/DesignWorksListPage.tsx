// src/pages/DesignWorksListPage.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

interface Project {
  id: number;
  name: string;
  cover_image: string | null;  
  created_at: string;
}

export default function DesignWorksListPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("design_projects")
      .select("*")
      .order("sort", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setProjects(data as Project[]);
    }
  };

  return (
    <div className="p-6 lg:w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">디자인 작업물</h2>
        <button
          onClick={() => navigate("/projects/new")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          프로젝트 추가
        </button>
      </div>

      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Design Works</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/board/design/${project.id}`}
              className="border rounded overflow-hidden hover:shadow-lg transition"
            >
              {project.cover_image ? (
                <img
                  src={project.cover_image}
                  alt={project.name}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <p className="text-gray-400 text-sm mt-2">
                  {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
