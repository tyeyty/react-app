// src/pages/BlogDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  thumbnail: string | null;
  created_at: string;
  created_by: string;
}

const ADMIN_USER_ID = import.meta.env.VITE_ADMIN_USER_ID;

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
      await fetchPost();
      setLoading(false);
    };
    init();
  }, [id]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) setPost(data as BlogPost);
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      alert("삭제 실패");
    } else {
      navigate("/board/blog");
    }
  };

  const isAdmin = userId === ADMIN_USER_ID;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f0]">
        <p className="text-[#7a7065] text-sm tracking-widest animate-pulse">
          LOADING...
        </p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f5f0] gap-4">
        <p className="text-[#9b8e84] tracking-widest text-sm">Post not found.</p>
        <Link
          to="/board/blog"
          className="text-sm underline text-[#2b2421] hover:text-[#7a5c4f] transition-colors"
        >
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] px-6 py-12 font-[Georgia,serif]">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          to="/board/blog"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#9b8e84] hover:text-[#2b2421] transition-colors mb-10"
        >
          ← Blog
        </Link>

        {/* Cover Image */}
        {(post.image_url || post.thumbnail) && (
          <div className="w-full aspect-video overflow-hidden mb-10">
            <img
              src={post.image_url || post.thumbnail!}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Meta */}
        <div className="mb-6">
          <p className="text-xs tracking-[0.25em] text-[#9b8e84] uppercase mb-3">
            {new Date(post.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2b2421] leading-tight">
            {post.title}
          </h1>
        </div>

        <hr className="border-[#ddd8d0] mb-8" />

        {/* Content */}
        <div
          className="text-[#3d3530] text-base leading-[1.9] whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Admin Actions */}
        {isAdmin && (
          <div className="flex gap-3 mt-14 pt-8 border-t border-[#ddd8d0]">
            <button
              onClick={() => navigate(`/board/blog/${id}/edit`)}
              className="border border-[#2b2421] text-[#2b2421] px-6 py-2.5 text-sm tracking-widest uppercase hover:bg-[#2b2421] hover:text-[#f7f5f0] transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="border border-red-400 text-red-500 px-6 py-2.5 text-sm tracking-widest uppercase hover:bg-red-500 hover:text-white transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}