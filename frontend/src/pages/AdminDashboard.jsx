import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";

import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import StatCard from "../components/common/StatCard";
import api from "../services/api";

const COLORS = ["#f59e0b", "#3b82f6", "#22c55e"];

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [aqiHistory, setAqiHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [statsRes, aqiRes] = await Promise.all([api.get("/complaints/stats/admin"), api.get("/aqi/history")]);
      setStats(statsRes.data);
      setAqiHistory(aqiRes.data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !stats) return <Spinner />;

  const statusData = Object.entries(stats.by_status).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Complaint analytics and AQI trends." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Complaints" value={stats.total} />
        <StatCard label="In Progress" value={stats.by_status["In Progress"]} />
        <StatCard label="Resolved" value={stats.by_status.Resolved} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-semibold">Complaints by Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={95} label>
                {statusData.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 font-semibold">AQI Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={aqiHistory.map((item) => ({ ...item, date: new Date(item.recorded_at).toLocaleDateString() }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="aqi_value" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
