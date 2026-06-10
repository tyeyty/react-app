import { useState, useEffect } from "react";

const PASSWORD = "tyey1234"; // 원하는 비밀번호로 변경
const STORAGE_KEY = "portfolio_auth";

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);
  const VALID_TOKENS = ["flex777", "hunt999"];

  useEffect(() => {
    // 기존 세션 체크
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved === "true") {
      setUnlocked(true);
      setChecking(false);
      return;
    }

    // 쿼리 토큰 체크
    const params = new URLSearchParams(window.location.search);
    const pass = params.get("pass");
    if (pass && VALID_TOKENS.includes(pass)) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
      // URL에서 토큰 제거 (주소창 깔끔하게)
      const url = new URL(window.location.href);
      url.searchParams.delete("pass");
      window.history.replaceState({}, "", url.toString());
    }

    setChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 1500);
    }
  };

  if (checking) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0f0f0f",
      fontFamily: "sans-serif",
    }}>
      <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
        <p style={{ color: "#888", marginBottom: "1rem", fontSize: "14px" }}>
          🔒 Private Portfolio
        </p>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter password"
          autoFocus
          style={{
            padding: "10px 16px",
            fontSize: "16px",
            borderRadius: "8px",
            border: error ? "2px solid #e53e3e" : "2px solid #333",
            background: "#1a1a1a",
            color: "#fff",
            outline: "none",
            width: "240px",
            transition: "border 0.2s",
          }}
        />
        {error && (
          <p style={{ color: "#e53e3e", fontSize: "13px", marginTop: "8px" }}>
            틀렸습니다
          </p>
        )}
        <br />
        <button type="submit" style={{
          marginTop: "12px",
          padding: "10px 24px",
          background: "#3b82f6",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
        }}>
          Enter
        </button>
      </form>
    </div>
  );
}