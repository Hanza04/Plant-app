import React, { useEffect, useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Scans from "./pages/Scans";
import Feedback from "./pages/Feedback";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminDoc = await getDoc(doc(db, "admin", user.uid));
        if (adminDoc.exists()) {
          setAdmin({ uid: user.uid, ...adminDoc.data() });
        } else {
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center",
        alignItems: "center", height: "100vh", fontSize: "18px", color: "#00904a" }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      {admin && <Navbar admin={admin} setAdmin={setAdmin} />}
      <Routes>
        <Route path="/login" element={admin ? <Navigate to="/dashboard" /> : <Login setAdmin={setAdmin} />} />
        <Route path="/dashboard" element={<ProtectedRoute admin={admin}><Dashboard /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute admin={admin}><Users /></ProtectedRoute>} />
        <Route path="/scans" element={<ProtectedRoute admin={admin}><Scans /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute admin={admin}><Feedback /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={admin ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;