import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const username = localStorage.getItem("staffUsername"); // logged-in user

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      setMessage("⚠️ Please fill in both fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            oldPassword: currentPassword,  // 🔥 FIXED
            newPassword: newPassword,
          }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage("❌ " + data.message);
        return;
      }

      setMessage("✅ Password updated successfully!");

      // Optional: logout automatically
      setTimeout(() => {
        localStorage.clear();
        navigate("/staff");
      }, 1500);
    } catch (e) {
      setMessage("🚨 Server error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔑 Change Password</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          {message && <p style={styles.message}>{message}</p>}

          <button type="submit" style={styles.button}>
            Update Password
          </button>
        </form>

        <button style={styles.backBtn} onClick={() => navigate("/staffpanel")}>
          ← Back
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    width: "450px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    position: "relative",
  },
  title: {
    fontSize: "26px",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  field: { textAlign: "left" },
  label: {
    fontWeight: "bold",
    display: "block",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    background: "#ff5722",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
  backBtn: {
    marginTop: "20px",
    background: "transparent",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
  },
  message: {
    color: "red",
    fontSize: "14px",
  },
};
