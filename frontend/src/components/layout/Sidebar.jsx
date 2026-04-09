import { Link, useLocation } from "react-router-dom";

const linksByRole = {
  admin: [
    { to: "/admin", label: "Dashboard" },
    { to: "/complaints/all", label: "All Complaints" },
    { to: "/aqi", label: "AQI Monitoring" },
  ],
  citizen: [
    { to: "/citizen", label: "Dashboard" },
    { to: "/complaints/new", label: "New Complaint" },
    { to: "/complaints/mine", label: "My Complaints" },
    { to: "/aqi", label: "AQI Monitoring" },
  ],
};

export default function Sidebar({ role }) {
  const location = useLocation();
  const links = linksByRole[role] || [];

  return (
    <aside className="w-full border-r border-slate-200 bg-white p-4 md:w-64">
      <div className="mb-6 text-xl font-bold text-blue-700">Smart City</div>
      <nav className="space-y-2">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
