import { useState } from "react";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import api from "../services/api";

export default function ComplaintForm() {
  const [form, setForm] = useState({ title: "", description: "", location: "", category: "Infrastructure" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/complaints", form);
      toast.success("Complaint submitted successfully");
      setForm({ title: "", description: "", location: "", category: "Infrastructure" });
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to submit complaint");
    }
  };

  return (
    <div>
      <PageHeader title="Raise Complaint" subtitle="Help city management resolve issues faster." />
      <form onSubmit={submit} className="max-w-2xl space-y-3 rounded-xl bg-white p-5 shadow-sm">
        <input className="w-full rounded-lg border p-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea className="w-full rounded-lg border p-2" placeholder="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input className="w-full rounded-lg border p-2" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        <input className="w-full rounded-lg border p-2" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">Submit</button>
      </form>
    </div>
  );
}
