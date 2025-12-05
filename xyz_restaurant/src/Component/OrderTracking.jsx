import React from "react";

function OrderTracking({ deliveryTime }) {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Order Tracking</h2>

      {/* Progress row */}
      <div style={styles.progressRow}>
        {/* Step 1 */}
        <div style={styles.step}>
          <div style={styles.icon}>✅</div>
          <p style={styles.label}>Order sent to Tasty Food</p>
        </div>

        <div style={styles.line}></div>

        {/* Step 2 */}
        <div style={styles.step}>
          <div style={styles.icon}>👨‍🍳</div>
          <p style={styles.label}>Preparing food...</p>
          <p style={styles.time}>~15 min left</p>
        </div>

        <div style={styles.line}></div>

        {/* Step 3 */}
        <div style={styles.step}>
          <div style={styles.icon}>🍽️</div>
          <p style={styles.label}>Enjoy your meal!</p>
        </div>
      </div>

      {/* Delivery info */}
      <div style={styles.deliveryBox}>
        <h3>📅 Delivery Info</h3>
        <p>
          Estimated delivery:{" "}
          <strong>{deliveryTime || "Today at 7:30 PM"}</strong>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "30px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: "40px",
    fontSize: "24px",
  },
  progressRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  step: {
    flex: 1,
    textAlign: "center",
  },
  icon: {
    fontSize: "40px",
    marginBottom: "10px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  time: {
    fontSize: "12px",
    color: "#555",
  },
  line: {
    flex: 0.5,
    height: "2px",
    backgroundColor: "#ccc",
    margin: "0 10px",
  },
  deliveryBox: {
    marginTop: "40px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
};

export default OrderTracking;
