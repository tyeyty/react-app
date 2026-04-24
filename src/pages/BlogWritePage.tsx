// src/pages/BlogWritePage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import RichEditor from "../components/RichEditor";

const ADMIN_USER_ID = "여기에-UUID-직접-입력"; // 본인 UUID로 교체

export default function BlogWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.id !== ADMIN_USER_ID) {
        alert("접근 권한이 없습니다.");
        navigate("/board/blog");
      }
    };
    check();
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user || user.id !== ADMIN_USER_ID) return alert("권한이 없습니다.");

    let imageUrl: string | null = null;

    if (imageFile) {
      setUploading(true);
      const fileName = `${Date.now()}_${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        setUploading(false);
        return alert("이미지 업로드 실패");
      }

      const { data } = supabase.storage.from("blog-images").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
      setUploading(false);
    }

    const { error } = await supabase.from("blog_posts").insert([
      { title, content, image_url: imageUrl, thumbnail: imageUrl, created_by: user.id },
    ]);

    if (error) {
      alert("등록 실패");
    } else {
      alert("등록 성공!");
      navigate("/board/blog");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] px-6 py-12 font-[Georgia,serif]">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 border-b-2 border-[#2b2421] pb-6">
          <p className="text-xs tracking-[0.25em] text-[#9b8e84] uppercase mb-2">New Entry</p>
          <h1 className="text-3xl font-bold text-[#2b2421]">Write a Post</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* 제목 */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#9b8e84] mb-2">Title</label>
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-[#ddd8d0] bg-white px-4 py-3 text-[#2b2421] focus:outline-none focus:border-[#2b2421] transition-colors text-base"
            />
          </div>

          {/* 에디터 */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#9b8e84] mb-2">Content</label>
            <RichEditor content={content} onChange={setContent} />
          </div>

          {/* 커버 이미지 */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#9b8e84] mb-2">Cover Image</label>
            <label className="flex items-center gap-3 cursor-pointer w-fit">
              <span className="border border-[#2b2421] text-[#2b2421] px-4 py-2 text-sm tracking-widest uppercase hover:bg-[#2b2421] hover:text-[#f7f5f0] transition-colors">
                Choose File
              </span>
              <span className="text-sm text-[#9b8e84]">
                {imageFile ? imageFile.name : "No file chosen"}
              </span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            {previewUrl && (
              <div className="mt-4 relative w-full max-w-sm">
                <img src={previewUrl} alt="preview" className="w-full aspect-video object-cover border border-[#ddd8d0]" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setPreviewUrl(null); }}
                  className="absolute top-2 right-2 bg-[#2b2421] text-white text-xs px-2 py-1 hover:bg-red-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {uploading && (
            <p className="text-sm text-[#9b8e84] tracking-widest animate-pulse">이미지 업로드 중...</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={uploading}
              className="bg-[#2b2421] text-[#f7f5f0] px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#4a3f38] transition-colors disabled:opacity-50"
            >
              Publish
            </button>
            <button
              type="button"
              onClick={() => navigate("/board/blog")}
              className="border border-[#2b2421] text-[#2b2421] px-8 py-3 text-sm tracking-widest uppercase hover:bg-[#2b2421] hover:text-[#f7f5f0] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}