import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import TripView from "./pages/TripView";
import TripListPage from "./pages/TripListPage";
import TripDetailPage from "./pages/TripDetailPage";
import MainLayout from "./layouts/MainLayout";
import About from "./pages/About";
import BoardPage from "./pages/BoardListPage";
import BoardDetailPage from "./pages/BoardDetailPage";
import WorksListPage from "./pages/WorksListPage";
import WorksWritePage from "./pages/WorksWritePage";
import RequestsWritePage from "./pages/RequestsWritePage";
import RequestsListPage from "./pages/RequestsListPage";
import MyPage from "./pages/Mypage";
import MoneyPortfolio from "./pages/MoneyPortfolio";
import ContactPage from "./pages/ContactPage";

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
          <Route path="/portfolio" element={<MoneyPortfolio />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Board 라우트 */}
          <Route path="/board" element={<BoardPage />}>
            {/* /board 접속 시 /board/works로 리다이렉트 */}
            <Route index element={<Navigate to="works" replace />} />
            <Route path="works" element={<WorksListPage />} />
            <Route path="works/new" element={<WorksWritePage />} />
            <Route path="works/:id" element={<BoardDetailPage />} />
            <Route path="requests" element={<RequestsListPage />} />
            <Route path="requests/new" element={<RequestsWritePage />} />
            <Route path="requests/:id" element={<BoardDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
