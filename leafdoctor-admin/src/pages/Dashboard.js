import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalScans: 0,
    healthyScans: 0,
    unhealthyScans: 0,
    highConfidenceScans: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const users = usersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const totalUsers = users.length;
        const activeUsers = users.filter((u) => !u.isBlocked).length;
        const blockedUsers = users.filter((u) => u.isBlocked).length;

        const scansSnap = await getDocs(collection(db, "history"));
        const scans = scansSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const totalScans = scans.length;
        const healthyScans = scans.filter((s) => s.isHealthy === true).length;
        const unhealthyScans = scans.filter((s) => s.isHealthy === false).length;
        const highConfidenceScans = scans.filter((s) => s.confidence >= 80).length;

        setStats({
          totalUsers,
          activeUsers,
          blockedUsers,
          totalScans,
          healthyScans,
          unhealthyScans,
          highConfidenceScans,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const getPercent = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  if (loading) {
    return <div className="loading-screen">Loading dashboard...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-title">Dashboard</div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Users</div>
          <div className="stat-value green">{stats.activeUsers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Blocked Users</div>
          <div className="stat-value red">{stats.blockedUsers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Scans</div>
          <div className="stat-value">{stats.totalScans}</div>
        </div>
      </div>

      <div className="health-card">
        <div className="health-card-title">Scan Health Overview</div>

        <div className="progress-item">
          <div className="progress-top">
            <span className="progress-label">Healthy scans</span>
            <span className="progress-count green">
              {stats.healthyScans} / {stats.totalScans}
            </span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar green"
              style={{ width: `${getPercent(stats.healthyScans, stats.totalScans)}%` }}
            ></div>
          </div>
          <div className="progress-percent">
            {getPercent(stats.healthyScans, stats.totalScans)}%
          </div>
        </div>

        <div className="progress-item">
          <div className="progress-top">
            <span className="progress-label">Unhealthy scans</span>
            <span className="progress-count red">
              {stats.unhealthyScans} / {stats.totalScans}
            </span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar red"
              style={{ width: `${getPercent(stats.unhealthyScans, stats.totalScans)}%` }}
            ></div>
          </div>
          <div className="progress-percent">
            {getPercent(stats.unhealthyScans, stats.totalScans)}%
          </div>
        </div>

        <div className="progress-item">
          <div className="progress-top">
            <span className="progress-label">High confidence scans (80%+)</span>
            <span className="progress-count">
              {stats.highConfidenceScans} / {stats.totalScans}
            </span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar light-green"
              style={{ width: `${getPercent(stats.highConfidenceScans, stats.totalScans)}%` }}
            ></div>
          </div>
          <div className="progress-percent">
            {getPercent(stats.highConfidenceScans, stats.totalScans)}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;