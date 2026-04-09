import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import Spinner from "./components/common/Spinner";
import { useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import AllComplaints from "./pages/AllComplaints";
import AQIPage from "./pages/AQIPage";
import CitizenDashboard from "./pages/CitizenDashboard";
import ComplaintForm from "./pages/ComplaintForm";
import LoginPage from "./pages/LoginPage";
import MyComplaints from "./pages/MyComplaints";
import RegisterPage from "./pages/RegisterPage";

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={user.role === "admin" ? "/admin" : "/citizen"} replace />;

  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/citizen"} /> : <LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen"
          element={
            <ProtectedRoute roles={["citizen"]}>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/new"
          element={
            <ProtectedRoute roles={["citizen"]}>
              <ComplaintForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/mine"
          element={
            <ProtectedRoute roles={["citizen"]}>
              <MyComplaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints/all"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AllComplaints />
            </ProtectedRoute>
          }
        />
        <Route path="/aqi" element={<AQIPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
