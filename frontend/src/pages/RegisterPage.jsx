import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", password: "", role: "citizen" });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold">Register</h1>
        <input className="mb-3 w-full rounded-lg border p-2" placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
        <input className="mb-3 w-full rounded-lg border p-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="mb-3 w-full rounded-lg border p-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <select className="mb-4 w-full rounded-lg border p-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="citizen">Citizen</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full rounded-lg bg-blue-600 p-2 font-semibold text-white hover:bg-blue-700">Create Account</button>
        <p className="mt-4 text-sm text-slate-600">
          Already registered? <Link className="text-blue-600" to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}
