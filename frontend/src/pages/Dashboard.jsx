import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-shell">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <div className="auth-badge">EcoSphere</div>
            <h2>Welcome back, {user?.firstName || user?.email || 'there'}.</h2>
            <p>You are now signed in and protected by the secure authentication flow.</p>
          </div>
          <button type="button" className="secondary-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="field-grid">
          <div>
            <strong>Email</strong>
            <p>{user?.email}</p>
          </div>
          <div>
            <strong>Role</strong>
            <p>{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
