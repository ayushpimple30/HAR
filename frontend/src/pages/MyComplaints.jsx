import { useEffect, useState } from "react";

import EmptyState from "../components/common/EmptyState";
import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import StatusBadge from "../components/common/StatusBadge";
import api from "../services/api";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/complaints/mine");
      setComplaints(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="My Complaints" subtitle="Track your submitted complaints and status updates." />
      {complaints.length === 0 ? (
        <EmptyState title="No complaints" description="You have not submitted complaints yet." />
      ) : (
        <div className="space-y-3">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{complaint.title}</h3>
                <StatusBadge status={complaint.status} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{complaint.description}</p>
              <p className="mt-2 text-xs text-slate-500">
                {complaint.location} • {complaint.category}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
