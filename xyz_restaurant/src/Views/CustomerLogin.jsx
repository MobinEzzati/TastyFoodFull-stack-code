import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomerLogin() {
  const [uniqueId, setUniqueId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Login Validation
  const validateCustomerLogin = () => {
    let newErrors = {};
    if (!uniqueId || uniqueId.trim().length < 5) {
      newErrors.uniqueId = "Unique number must be at least 5 characters.";
    }
    setError(newErrors.uniqueId || "");
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateCustomerLogin()) return;
    localStorage.setItem("customerId", uniqueId);
    navigate("/"); // back to home
  };

  return (
    <div style={styles.container}>
      <h2>👤 Customer Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Enter Unique Number"
          value={uniqueId}
          onChange={(e) => setUniqueId(e.target.value)}
          style={styles.input}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
      <p>
        New user?{" "}
        <span
          style={{ color: "#ff5722", cursor: "pointer" }}
          onClick={() => navigate("/customerregister")}
        >
          Register here
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fff",
    textAlign: "center",
  },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#ff5722",
    border: "none",
    color: "#fff",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default CustomerLogin;
