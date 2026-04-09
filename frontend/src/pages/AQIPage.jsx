import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import toast from "react-hot-toast";

import AQIBadge from "../components/common/AQIBadge";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function AQIPage() {
  const { user } = useAuth();
  const [latest, setLatest] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ location: "City Center", aqi_value: 50 });

  const load = async () => {
    const [latestRes, historyRes] = await Promise.all([api.get("/aqi/latest"), api.get("/aqi/history")]);
    setLatest(latestRes.data);
    setHistory(historyRes.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const addAqi = async (e) => {
    e.preventDefault();
    try {
      await api.post("/aqi", { ...form, aqi_value: Number(form.aqi_value) });
      toast.success("AQI reading added");
      load();
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to add AQI reading");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="AQI Monitoring" subtitle="Live and historical air quality index data." />
      <div className="rounded-xl bg-white p-5 shadow-sm">
        {latest ? <AQIBadge category={latest.category} value={latest.aqi_value} /> : <p>No AQI readings available.</p>}
      </div>

      <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-semibold">AQI Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history.map((item) => ({ ...item, time: new Date(item.recorded_at).toLocaleDateString() }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line dataKey="aqi_value" stroke="#16a34a" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {user?.role === "admin" ? (
        <form onSubmit={addAqi} className="mt-6 max-w-xl space-y-3 rounded-xl bg-white p-5 shadow-sm">
          <h3 className="font-semibold">Add AQI Reading</h3>
          <input className="w-full rounded-lg border p-2" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
          <input className="w-full rounded-lg border p-2" type="number" min={0} max={500} value={form.aqi_value} onChange={(e) => setForm({ ...form, aqi_value: e.target.value })} required />
          <button className="rounded-lg bg-green-600 px-4 py-2 text-white">Save Reading</button>
        </form>
      ) : null}
    </div>
  );
}
