// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TripView from "./pages/TripView";
import TripListPage from "./pages/TripListPage";
import TripDetailPage from "./pages/TripDetailPage";
import MainLayout from "./layouts/MainLayout";
import About from "./pages/About";
import BoardListPage from "./pages/BoardListPage";
import MyPage from "./pages/MyPage"; 


function App() {
  return (
    <Router>
      <Routes>
        {/* 로그인/회원가입은 Header 없이 */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* 나머지 페이지는 공통 Layout 사용 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tripview" element={<TripView />} />
          <Route path="/trips" element={<TripListPage />} />
          <Route path="/trips/:id" element={<TripDetailPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/board" element={<BoardListPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
