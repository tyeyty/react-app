// src/pages/BlogListPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  thumbnail: string | null;
  image_url: string | null;
  created_at: string;
  created_by: string;
}

const ADMIN_USER_ID = import.meta.env.VITE_ADMIN_USER_ID; // .env에 설정

export default function BlogListPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id ?? null);
      await fetchPosts();
      setLoading(false);
    };
    init();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setPosts(data as BlogPost[]);
  };

  const isAdmin = userId === ADMIN_USER_ID;

  // 본문에서 첫 문장 or 최대 100자 추출
  const getExcerpt = (content: string) => {
    const plain = content.replace(/<[^>]*>/g, "");
    return plain.length > 100 ? plain.slice(0, 100) + "…" : plain;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f0]">
        <p className="text-[#7a7065] font-medium tracking-widest text-sm animate-pulse">
          LOADING...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] px-6 py-12 font-[Georgia,serif] lg:w-[1100px]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-14 border-b-2 border-[#2b2421] pb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#2b2421] leading-tight">
              Blog
            </h1>
          </div>
          {isAdmin && (
            <button
              onClick={() => navigate("/board/blog/new")}
              className="bg-[#2b2421] text-[#f7f5f0] px-5 py-2.5 text-sm tracking-widest uppercase hover:bg-[#4a3f38] transition-colors"
            >
              + Write
            </button>
          )}
        </div>

        {/* Post List */}
        {posts.length === 0 ? (
          <div className="text-center py-24 text-[#9b8e84] text-sm tracking-widest uppercase">
            No posts yet.
          </div>
        ) : (
          <div className="space-y-0 divide-y divide-[#ddd8d0]">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/board/blog/${post.id}`}
                className="group flex gap-6 py-8 hover:bg-[#f0ebe3] transition-colors px-3 -mx-3"
              >
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-28 h-28 overflow-hidden bg-[#e5dfd8]">
                  {post.thumbnail || post.image_url ? (
                    <img
                      src={post.thumbnail || post.image_url!}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[#b8b0a8] text-xs tracking-widest uppercase">
                        No Img
                      </span>
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex flex-col justify-center gap-1.5 min-w-0">
                  <p className="text-xs text-[#9b8e84] tracking-widest uppercase">
                    {new Date(post.created_at).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h2 className="text-xl font-semibold text-[#2b2421] group-hover:text-[#7a5c4f] transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-sm text-[#7a7065] leading-relaxed line-clamp-2">
                    {getExcerpt(post.content)}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 flex items-center ml-auto pl-4">
                  <span className="text-[#b8b0a8] group-hover:text-[#2b2421] group-hover:translate-x-1 transition-all duration-200 text-lg">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}