import { useEffect, useState } from "react";

import AQIBadge from "../components/common/AQIBadge";
import EmptyState from "../components/common/EmptyState";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import StatCard from "../components/common/StatCard";
import StatusBadge from "../components/common/StatusBadge";
import api from "../services/api";

export default function CitizenDashboard() {
  const [loading, setLoading] = useState(true);
  const [latestAqi, setLatestAqi] = useState(null);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [aqiRes, complaintsRes] = await Promise.all([api.get("/aqi/latest"), api.get("/complaints/mine")]);
      setLatestAqi(aqiRes.data);
      setComplaints(complaintsRes.data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="Citizen Dashboard" subtitle="Track your complaints and live AQI data." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="My Complaints" value={complaints.length} />
        <StatCard label="Pending" value={complaints.filter((c) => c.status === "Pending").length} />
        <StatCard label="Resolved" value={complaints.filter((c) => c.status === "Resolved").length} />
      </div>

      <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Current AQI</h2>
        {latestAqi ? <AQIBadge category={latestAqi.category} value={latestAqi.aqi_value} /> : <p>No AQI data</p>}
      </div>

      <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Recent Complaints</h2>
        {complaints.length === 0 ? (
          <EmptyState title="No complaints yet" description="Submit a complaint to get started." />
        ) : (
          <div className="space-y-3">
            {complaints.slice(0, 5).map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{complaint.title}</p>
                  <p className="text-xs text-slate-500">{complaint.location}</p>
                </div>
                <StatusBadge status={complaint.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
