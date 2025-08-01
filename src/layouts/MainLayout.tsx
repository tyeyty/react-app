// src/layouts/MainLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <>
      <Header />
      <main className="mt-[60px] xl:mt-[40px] p-4">
        <Outlet />
      </main>
    </>
  );
}
