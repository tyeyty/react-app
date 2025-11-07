
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

// HTML 태그를 안전하게 처리하는 함수
const sanitizeHtml = (html: string): string => {
  // 기본적인 XSS 방지를 위한 간단한 처리
  return html
    .replace(/\n/g, '<br>') // 개행 문자를 <br> 태그로 변환
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // script 태그 제거
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // iframe 태그 제거
    .replace(/on\w+="[^"]*"/gi, '') // 이벤트 핸들러 제거
    .replace(/javascript:/gi, ''); // javascript: 제거
};

interface WorkItem {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

export default function BoardDetailPage() {
  const { id } = useParams();  
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState<WorkItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ post가 있을 때만 날짜 포맷
  const formattedDate = post
    ? new Date(post.created_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

    useEffect(() => {
      async function fetchPost() {
        if (!id) return;
  
        setLoading(true);
        setError(null);
  
        // URL 경로에 따라 테이블명 결정
        const tableName = location.pathname.includes('/works/') ? 'works' : 'requests';
        const postId = Number(id);
  
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .eq("id", postId)
          .single();
  
        if (error) {
          console.error(error);
          setError("게시글을 불러오는 중 오류가 발생했습니다.");
        } else {
          setPost(data as WorkItem);
        }
  
        setLoading(false);
      }
  
      fetchPost();
    }, [id, location.pathname]);
  
    if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!post) return <div className="p-6 text-gray-500">게시글이 없습니다.</div>;
  
    return (
      <div className="p-6 lg:w-[1200px]">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline mb-4"
        >
          ← Back to list
        </button>
  
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6">
          {formattedDate}
        </div>

        {post.image_url && (
          <div className="mb-6">
            <img
              src={post.image_url}
              alt={post.title}
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}
  
        <div 
          className="prose max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
        />
      </div>
    );
  }