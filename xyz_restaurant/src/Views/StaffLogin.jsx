import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../img/Logo.png"

function StaffLogin() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    const username = formData.username.trim();
    const password = formData.password.trim();
  
    if (!username || !password) {
      setError("⚠️ Please enter both username and password.");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await res.json();
  
      // ❌ incorrect login
      if (!res.ok || data.success === false) {
        setError("❌ " + (data.message || "Invalid credentials"));
        return;
      }
  
      // ✅ success
      localStorage.setItem("staffLoggedIn", "true");
      localStorage.setItem("staffUsername", data.username);
      localStorage.setItem("isAdmin", data.isAdmin);
  
      navigate("/staffpanel");
    } catch (err) {
      setError("🚨 Server error");
    }
  };
  
  
  
  
  

  const handlePasswordReset = () => {
    alert("🔑 Password reset option coming soon...");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* 🔙 Back to Menu */}
        <button style={styles.backBtn} onClick={() => navigate("/")}>
          ← Back to Menu
        </button>

        {/* Logo + Welcome */}
        <div style={styles.header}>
          <img src= {logo} alt="Restaurant Logo" style={styles.logo} />
          <h2 style={styles.welcome}>Welcome to Staff Login</h2>
        </div>

        {/* Form wrapper (keeps it small inside the big card) */}
        <div style={styles.formWrapper}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              Username
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your username"
              />
            </label>

            <label style={styles.label}>
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your password"
              />
            </label>

            {error && <p style={styles.error}>{error}</p>}

            <button type="submit" style={styles.button}>
              Login
            </button>
          </form>
        </div>

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
    padding: "50px",
    borderRadius: "12px",
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
    width: "800px", // ✅ same as admin
    textAlign: "center",
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "transparent",
    border: "none",
    color: "#007bff",
    fontSize: "18px",
    cursor: "pointer",
  },
  header: { marginBottom: "25px" },
  logo: { width: "90px", height: "90px", marginBottom: "15px" },
  welcome: { fontSize: "22px", fontWeight: "bold" },

  formWrapper: {
    maxWidth: "400px",
    margin: "0 auto",
  },

  form: { display: "flex", flexDirection: "column", gap: "20px" },
  label: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    fontSize: "15px",
    fontWeight: "bold",
    width: "100%",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    marginTop: "6px",
    fontSize: "14px",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#ff5722",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  error: { color: "red", fontSize: "13px" },
  note: { marginTop: "20px", color: "red", fontSize: "14px" },
  changePassword: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default StaffLogin;
