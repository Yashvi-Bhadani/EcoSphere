<<<<<<< HEAD
const metrics = [
  { label: "Carbon emissions", value: "18.4 tCO2e", change: "-8.2% vs last month" },
  { label: "Energy usage", value: "42,900 kWh", change: "+3.5% vs last month" },
  { label: "Waste recycled", value: "71%", change: "+6.1% recycling rate" },
  { label: "Goals on track", value: "12 / 15", change: "80% completion" },
];

const modules = [
  {
    title: "Carbon Emissions",
    description: "Track emissions by source, department, and reporting period.",
    accent: "#2563eb",
  },
  {
    title: "Energy Consumption",
    description: "Monitor electricity, fuel, and utility usage with trend analysis.",
    accent: "#059669",
  },
  {
    title: "Waste Management",
    description: "Record waste streams, disposal methods, and recycling rates.",
    accent: "#f59e0b",
  },
  {
    title: "Environmental Goals",
    description: "Manage targets, progress, and completion status across departments.",
    accent: "#7c3aed",
  },
];

const highlights = [
  "Role-based access for admin, manager, and employee flows.",
  "Clean REST APIs for CRUD, filters, search, and reporting.",
  "Responsive layout ready for production dashboard work.",
  "Built to fit the EcoSphere environment module backend.",
];

function App() {
  const shell = {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 28%), radial-gradient(circle at top right, rgba(5, 150, 105, 0.14), transparent 26%), linear-gradient(180deg, #06111f 0%, #0f172a 50%, #111827 100%)",
    color: "#e5eefc",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding: "32px 20px 48px",
    boxSizing: "border-box",
  };

  const container = {
    maxWidth: 1240,
    margin: "0 auto",
    display: "grid",
    gap: 24,
  };

  const card = {
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    borderRadius: 24,
    boxShadow: "0 24px 80px rgba(2, 6, 23, 0.35)",
    backdropFilter: "blur(18px)",
  };

  const button = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "14px 18px",
    borderRadius: 999,
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
    color: "#06111f",
    background: "linear-gradient(135deg, #60a5fa, #34d399)",
    boxShadow: "0 12px 30px rgba(59, 130, 246, 0.28)",
  };

  return (
    <main style={shell}>
      <div style={container}>
        <section style={{ ...card, padding: 28 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(96, 165, 250, 0.12)",
                  color: "#93c5fd",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                Environment Module
              </div>
              <h1 style={{ fontSize: "clamp(2.4rem, 5vw, 4.5rem)", lineHeight: 1.02, margin: 0 }}>
                ESG operations built for measurable environmental performance.
              </h1>
              <p style={{ maxWidth: 680, fontSize: 18, lineHeight: 1.7, color: "#bfdbfe", margin: "18px 0 28px" }}>
                Track carbon emissions, energy usage, waste streams, and environmental goals from a single,
                production-ready environment workspace.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <button type="button" style={button}>
                  Open Environment Dashboard
                </button>
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: 999,
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    color: "#cbd5e1",
                    background: "rgba(15, 23, 42, 0.42)",
                    fontWeight: 600,
                  }}
                >
                  REST APIs connected
                </div>
              </div>
            </div>

            <div
              style={{
                borderRadius: 28,
                overflow: "hidden",
                background:
                  "linear-gradient(180deg, rgba(15, 118, 110, 0.36) 0%, rgba(14, 165, 233, 0.08) 100%)",
                border: "1px solid rgba(148, 163, 184, 0.18)",
                padding: 18,
              }}
            >
              <div
                style={{
                  borderRadius: 24,
                  background: "linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.72))",
                  padding: 20,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                  <div>
                    <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>Live summary</div>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>Environmental KPI snapshot</div>
                  </div>
                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: 999,
                      background: "rgba(34, 197, 94, 0.14)",
                      color: "#86efac",
                      fontWeight: 700,
                      fontSize: 13,
                      height: "fit-content",
                    }}
                  >
                    Healthy trend
                  </div>
                </div>

          import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/register" element={<Login mode="register" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login mode="login" />} />
        <Route path="/register" element={<Login mode="register" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
>>>>>>> d64d38a (frontend added for authentication module)
  );
}

export default App;
