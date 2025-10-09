import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function WorksWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("로그인이 필요합니다.");

    let imageUrl: string | null = null;

    if (imageFile) {
      setUploading(true);
      const fileName = `${Date.now()}_${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("works-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error(uploadError);
        setUploading(false);
        return alert("이미지 업로드 실패");
      }

      // public URL 가져오기 (v2)
      const { data } = supabase.storage.from("works-images").getPublicUrl(fileName);
      imageUrl = data.publicUrl;

      setUploading(false);
    }

    // DB에 글 저장
    const { error } = await supabase.from("works").insert([
      { title, content, image_url: imageUrl, created_by: user.id },
    ]);

    if (error) {
      console.error(error);
      alert("등록 실패");
    } else {
      alert("등록 성공!");
      navigate("/board/works");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">새 작업물 등록</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded h-40"
          required
        />

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {uploading && <p>이미지 업로드 중...</p>}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          등록
        </button>
      </form>
    </div>
  );
}
