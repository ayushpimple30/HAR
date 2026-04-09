import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import Spinner from "../components/common/Spinner";
import StatusBadge from "../components/common/StatusBadge";
import api from "../services/api";

const statuses = ["Pending", "In Progress", "Resolved"];

export default function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await api.get("/complaints");
    setComplaints(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/complaints/${id}/status`, { status });
      toast.success("Status updated");
      load();
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to update status");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <PageHeader title="All Complaints" subtitle="Review and manage all citizen complaints." />
      <div className="space-y-3">
        {complaints.map((complaint) => (
          <div key={complaint.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold">{complaint.title}</h3>
                <p className="text-xs text-slate-500">
                  By {complaint.citizen_name} • {complaint.location} • {complaint.category}
                </p>
              </div>
              <StatusBadge status={complaint.status} />
            </div>
            <p className="mt-2 text-sm text-slate-600">{complaint.description}</p>
            <div className="mt-3 flex gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(complaint.id, status)}
                  className="rounded border px-2 py-1 text-xs hover:bg-slate-100"
                >
                  Mark {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
