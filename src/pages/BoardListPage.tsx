// src/pages/BoardListPage.tsx
import { NavLink, Outlet } from "react-router-dom";

export default function BoardListPage() {
return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-6">Works</h1>

      {/* 탭 메뉴 */}
      <div className="flex border-b mb-4">
        <NavLink
          to="works"
          className={({ isActive }) =>
            `px-4 py-2 font-medium ${
              isActive
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`
          }
        >
          Dev
        </NavLink>
        <NavLink
          to="requests"
          className={({ isActive }) =>
            `px-4 py-2 font-medium ${
              isActive
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500"
            }`
          }
        >
          Design
        </NavLink>
      </div>

      {/* 하위 라우트가 표시되는 자리 */}
      <Outlet />
    </div>
  );
}