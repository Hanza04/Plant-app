import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Sidebar.css";

function Sidebar({ admin, setAdmin }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setAdmin(null);
    navigate("/login");
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/users", label: "Users", icon: "👥" },
    { path: "/scans", label: "Scans", icon: "🔍" },
    { path: "/feedback", label: "Feedback", icon: "💬" },
  ];

  const getInitials = (email) => {
    if (!email) return "AD";
    return email.substring(0, 2).toUpperCase();
  };

  const getFirstName = (email) => {
    if (!email) return "Admin";
    return email.split("@")[0];
  };

  return (
    <div className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🌿</div>
        <span className="sidebar-logo-text">LeafDoctor</span>
      </div>

      {/* Nav Links */}
      <nav className="sidebar-nav">
        <p className="sidebar-nav-label">Main Menu</p>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`sidebar-nav-item ${location.pathname === link.path ? "active" : ""}`}
          >
            <span className="sidebar-nav-icon">{link.icon}</span>
            <span className="sidebar-nav-text">{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Admin Profile at Bottom */}
      <div className="sidebar-footer">
        <div className="sidebar-profile" onClick={() => setShowProfile(!showProfile)}>
          <div className="sidebar-avatar">{getInitials(admin?.email)}</div>
          <div className="sidebar-profile-info">
            <div className="sidebar-profile-name">{getFirstName(admin?.email)}</div>
            <div className="sidebar-profile-role">{admin?.role}</div>
          </div>
          <span className="sidebar-profile-arrow">{showProfile ? "▲" : "▼"}</span>
        </div>

        {/* Profile Dropdown */}
        {showProfile && (
          <div className="sidebar-dropdown">
            <div className="sidebar-dropdown-header">
              <div className="sidebar-dropdown-welcome">Welcome, {getFirstName(admin?.email)}</div>
              <div className="sidebar-dropdown-email">{admin?.email}</div>
              <div className="sidebar-dropdown-badge">{admin?.role}</div>
            </div>
            <div className="sidebar-dropdown-divider"></div>
            <div className="sidebar-dropdown-item">
              <span>📧</span>
              <span>{admin?.email}</span>
            </div>
            <div className="sidebar-dropdown-item">
              <span>🛡️</span>
              <span>Role: {admin?.role}</span>
            </div>
            <div className="sidebar-dropdown-item">
              <span>🔑</span>
              <span>Reset Password</span>
            </div>
            <div className="sidebar-dropdown-divider"></div>
            <div className="sidebar-dropdown-item logout" onClick={handleLogout}>
              <span>🚪</span>
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;