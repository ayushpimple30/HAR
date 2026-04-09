import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data } = await api.get("/notifications");
      setUnread(data.filter((item) => !item.is_read).length);
    };
    load();
  }, [user]);

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <div>
        <p className="text-sm text-slate-500">Welcome back</p>
        <h2 className="font-semibold text-slate-900">{user?.full_name}</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative rounded-lg bg-slate-100 px-2 py-1 text-slate-600">
          🔔
          {unread > 0 ? (
            <span className="absolute -right-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unread}
            </span>
          ) : null}
        </div>
        <button
          onClick={logout}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
