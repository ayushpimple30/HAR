import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Spinner from "../components/common/Spinner";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/citizen");
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold">Login</h1>
        <input
          className="mb-3 w-full rounded-lg border p-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="mb-4 w-full rounded-lg border p-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          disabled={submitting}
          className="w-full rounded-lg bg-blue-600 p-2 font-semibold text-white hover:bg-blue-700"
        >
          {submitting ? "Signing in..." : "Login"}
        </button>
        <p className="mt-4 text-sm text-slate-600">
          New user? <Link className="text-blue-600" to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
