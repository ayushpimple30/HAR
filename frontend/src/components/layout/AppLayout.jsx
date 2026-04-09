import { Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen md:flex">
      <Sidebar role={user?.role} />
      <div className="flex-1">
        <Navbar />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
