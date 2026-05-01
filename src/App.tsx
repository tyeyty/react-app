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
import DesignListPage from "./pages/DesignWorksListPage";
import DesignDetailPage from "./pages/DesignProjectDetailPage";
import MyPage from "./pages/Mypage";
import MoneyPortfolio from "./pages/MoneyPortfolio";
import ContactPage from "./pages/ContactPage";
import EconomicSimulator from "./pages/EconomicSimulator";
import BlogListPage from "./pages/BlogListPage";
import BlogWritePage from "./pages/BlogWritePage";
import BlogDetailPage from "./pages/BlogDetailPage";
import BlogEditPage from "./pages/BlogEditPage";
import WorksEditPage from "./pages/WorksEditPage";


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
          <Route path="/simul" element={<EconomicSimulator />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/contact" element={<ContactPage />} />
    
          {/* Board 라우트 */}
          <Route path="/board" element={<BoardPage />}>
            <Route index element={<Navigate to="works" replace />} />
            <Route path="works" element={<WorksListPage />} />
            <Route path="works/new" element={<WorksWritePage />} />
            <Route path="works/:id" element={<BoardDetailPage />} />
            <Route path="design" element={<DesignListPage />} />
            <Route path="design/:id" element={<DesignDetailPage />} />
          </Route>

          {/* Blog 라우트 - Board 바깥으로 분리 */}
          <Route path="/board/works/:id/edit" element={<WorksEditPage />} />
          <Route path="/board/blog" element={<BlogListPage />} />
          <Route path="/board/blog/new" element={<BlogWritePage />} />
          <Route path="/board/blog/:id" element={<BlogDetailPage />} />
          <Route path="/board/blog/:id/edit" element={<BlogEditPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
