
import { useEffect, useState } from "react";
import { Users, UserCheck, UserX, ShieldCheck, RefreshCw } from "lucide-react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    adminUsers: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/users/stats");
      setStats(response.data.stats);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "blue"
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: UserCheck,
      color: "green"
    },
    {
      title: "Inactive Users",
      value: stats.inactiveUsers,
      icon: UserX,
      color: "red"
    },
    {
      title: "Administrators",
      value: stats.adminUsers,
      icon: ShieldCheck,
      color: "purple"
    }
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h2>Growth Tech Admin</h2>
          <p>Welcome back, {user?.name}</p>
        </div>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-title">
          <div>
            <h1>Dashboard Overview</h1>
            <p>Monitor your users and account activity.</p>
          </div>

           <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
  <Link to="/admin/users" className="refresh-button">
    Manage Users
  </Link>

  <button className="refresh-button" onClick={fetchStats} disabled={loading}>
    <RefreshCw size={16} /> Refresh
  </button>
</div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <p className="loading-text">Loading dashboard...</p>
        ) : (
          <div className="stats-grid">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div className="stat-card" key={card.title}>
                  <div className={`stat-icon ${card.color}`}>
                    <Icon size={24} />
                  </div>

                  <div>
                    <p>{card.title}</p>
                    <h2>{card.value}</h2>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
