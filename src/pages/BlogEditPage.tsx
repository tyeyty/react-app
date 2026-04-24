// src/pages/BlogEditPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import RichEditor from "../components/RichEditor";

const ADMIN_USER_ID = "여기에-UUID-직접-입력"; // 본인 UUID로 교체

export default function BlogEditPage() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.id !== ADMIN_USER_ID) {
        alert("접근 권한이 없습니다.");
        navigate("/board/blog");
        return;
      }
      await fetchPost();
      setLoaded(true);
    };
    init();
  }, [id, navigate]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();
    if (!error && data) {
      setTitle(data.title);
      setContent(data.content);
      setExistingImageUrl(data.image_url);
      setPreviewUrl(data.image_url);
    }
  };

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

    let imageUrl = existingImageUrl;

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

    const { error } = await supabase
      .from("blog_posts")
      .update({ title, content, image_url: imageUrl, thumbnail: imageUrl })
      .eq("id", id);

    if (error) {
      alert("수정 실패");
    } else {
      alert("수정 완료!");
      navigate(`/board/blog/${id}`);
    }
  };

  if (!loaded) return null;

  return (
    <div className="min-h-screen bg-[#f7f5f0] px-6 py-12 font-[Georgia,serif]">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 border-b-2 border-[#2b2421] pb-6">
          <p className="text-xs tracking-[0.25em] text-[#9b8e84] uppercase mb-2">Editing</p>
          <h1 className="text-3xl font-bold text-[#2b2421]">Edit Post</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#9b8e84] mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-[#ddd8d0] bg-white px-4 py-3 text-[#2b2421] focus:outline-none focus:border-[#2b2421] transition-colors text-base"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-[#9b8e84] mb-2">Content</label>
            {/* content가 로드된 후에만 에디터 렌더링 */}
            <RichEditor content={content} onChange={setContent} />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase text-[#9b8e84] mb-2">Cover Image</label>
            <label className="flex items-center gap-3 cursor-pointer w-fit">
              <span className="border border-[#2b2421] text-[#2b2421] px-4 py-2 text-sm tracking-widest uppercase hover:bg-[#2b2421] hover:text-[#f7f5f0] transition-colors">
                Change Image
              </span>
              <span className="text-sm text-[#9b8e84]">
                {imageFile ? imageFile.name : "현재 이미지 유지"}
              </span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            {previewUrl && (
              <div className="mt-4 relative w-full max-w-sm">
                <img src={previewUrl} alt="preview" className="w-full aspect-video object-cover border border-[#ddd8d0]" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setPreviewUrl(null); setExistingImageUrl(null); }}
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
              Save
            </button>
            <button
              type="button"
              onClick={() => navigate(`/board/blog/${id}`)}
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