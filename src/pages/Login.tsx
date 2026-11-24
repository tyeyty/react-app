import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { isPortfolioAdmin } from "../lib/portfolioAdmin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrorMsg("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({email: email.trim(), password});
      if (error) { setErrorMsg("이메일 또는 비밀번호를 확인해주세요."); return; }
      if (!isPortfolioAdmin(data.user)) {
        await supabase.auth.signOut({scope: "local"});
        setErrorMsg("포트폴리오 관리자 계정만 로그인할 수 있습니다.");
        return;
      }
      navigate("/board/works", {replace: true});
    } catch { setErrorMsg("로그인에 실패했습니다. 다시 시도해주세요."); }
    finally { setBusy(false); }
  };
  return <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
    <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Portfolio Admin Login</h2>
      {errorMsg && <p role="alert" className="text-red-500 text-sm mb-4">{errorMsg}</p>}
      <input type="email" autoComplete="username" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full mb-4 px-4 py-2 border rounded" required />
      <input type="password" autoComplete="current-password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mb-4 px-4 py-2 border rounded" required />
      <button disabled={busy} type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">{busy ? "로그인 중..." : "Login"}</button>
    </form>
  </div>;
}
