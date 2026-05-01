import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function WorksEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      const { data, error } = await supabase
        .from("works")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (error) {
        console.error(error);
        alert("게시글을 불러올 수 없습니다.");
        navigate(-1);
        return;
      }

      setTitle(data.title);
      setContent(data.content);
      setImageUrl(data.image_url);
      setLoading(false);
    }

    fetchPost();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("로그인이 필요합니다.");

    let finalImageUrl = imageUrl;

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

      const { data } = supabase.storage.from("works-images").getPublicUrl(fileName);
      finalImageUrl = data.publicUrl;
      setUploading(false);
    }

    const { error } = await supabase
      .from("works")
      .update({ title, content, image_url: finalImageUrl })
      .eq("id", Number(id));

    if (error) {
      console.error(error);
      alert("수정 실패");
    } else {
      alert("수정 완료!");
      navigate(`/board/works/${id}`);
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">작업물 수정</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:w-[900px]">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />

        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 rounded h-120 w-full"
          required
        />

        {imageUrl && !imageFile && (
          <div>
            <p className="text-sm text-gray-500 mb-1">현재 이미지</p>
            <img src={imageUrl} alt="현재 이미지" className="max-w-xs rounded shadow" />
          </div>
        )}

        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imageFile && <p className="text-sm text-gray-500">새 이미지: {imageFile.name}</p>}

        {uploading && <p>이미지 업로드 중...</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            수정 완료
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}