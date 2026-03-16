import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import "./Users.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { fetchUsers(); }, []);
  useEffect(() => { applyFilter(); }, [users, search, filter]);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoading(false);
  };

  const applyFilter = () => {
    let result = [...users];
    if (filter === "active") result = result.filter((u) => !u.isBlocked);
    else if (filter === "blocked") result = result.filter((u) => u.isBlocked);
    if (search.trim() !== "") {
      result = result.filter(
        (u) =>
          u.username?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  };

  const handleBlock = async (userId) => {
    setActionLoading(userId);
    try {
      await updateDoc(doc(db, "users", userId), { isBlocked: true });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isBlocked: true } : u)));
    } catch (err) {
      alert("Failed to block user. Please try again.");
    }
    setActionLoading(null);
  };

  const handleUnblock = async (userId) => {
    setActionLoading(userId);
    try {
      await updateDoc(doc(db, "users", userId), { isBlocked: false });
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isBlocked: false } : u)));
    } catch (err) {
      alert("Failed to unblock user. Please try again.");
    }
    setActionLoading(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  if (loading) return <div className="loading-screen">Loading users...</div>;

  return (
    <div className="page-container">
      <div className="page-title">Users</div>

      <div className="card">
        <div className="users-toolbar">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="users-search"
          />
          <div className="users-filters">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All ({users.length})
            </button>
            <button
              className={`filter-btn ${filter === "active" ? "active" : ""}`}
              onClick={() => setFilter("active")}
            >
              Active ({users.filter((u) => !u.isBlocked).length})
            </button>
            <button
              className={`filter-btn ${filter === "blocked" ? "active" : ""}`}
              onClick={() => setFilter("blocked")}
            >
              Blocked ({users.filter((u) => u.isBlocked).length})
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="no-results">No users found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Last Seen</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className={user.isBlocked ? "blocked-row" : ""}>
                  <td>{user.username || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>{formatDate(user.lastSeen)}</td>
                  <td>
                    <span className={`badge ${user.isBlocked ? "badge-red" : "badge-green"}`}>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td>
                    {user.isBlocked ? (
                      <button
                        className="btn-green"
                        onClick={() => handleUnblock(user.id)}
                        disabled={actionLoading === user.id}
                      >
                        {actionLoading === user.id ? "Wait..." : "Unblock"}
                      </button>
                    ) : (
                      <button
                        className="btn-red"
                        onClick={() => handleBlock(user.id)}
                        disabled={actionLoading === user.id}
                      >
                        {actionLoading === user.id ? "Wait..." : "Block"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Users;