import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data, error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(isLogin ? '로그인 성공!' : '회원가입 이메일 전송됨!');
    }

    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-center">
        {isLogin ? '로그인' : '회원가입'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border px-4 py-2 rounded"
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border px-4 py-2 rounded"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          type="submit"
          disabled={loading}
        >
          {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
        </button>
      </form>
      <button
        className="text-sm text-gray-500 hover:underline block mx-auto"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? '회원가입 하기' : '이미 계정이 있나요? 로그인'}
      </button>
      {message && <p className="text-center text-sm text-red-600">{message}</p>}
    </div>
  );
}
