import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const STATUSES = {
  PENDING: "PENDING",
  ASSIGNED: "ASSIGNED",
  DELIVERED: "DELIVERED",
};



const fmtMoney = (n) => {
  if (n == null || isNaN(n)) return "$0.00";
  return `$${Number(n).toFixed(2)}`;
};

const fmtDateTime = (d) =>
  new Date(d).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function StaffPanel() {
  const navigate = useNavigate();

  

  const [filter, setFilter] = useState(STATUSES.PENDING);
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);


  // ✅ Staff name from localStorage
  const [staffName, setStaffName] = useState("");

  const filtered = useMemo(() => {
    if (filter === "All") return orders;
    return orders.filter((o) => o.orderStatus === filter);
  }, [orders, filter]);

  const totalQty = (items) => items.reduce((s, i) => s + i.qty, 0);
  

  useEffect(() => {
    // 1️⃣ Load orders from backend
    fetch("http://localhost:8080/api/orders/all")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(o => ({
          id: o.orderId,
          customerName: o.customerName,
          orderDateTime: o.orderDateTime,
          eta: o.eta,
  
          // address object from backend
          deliveryAddress: o.deliveryAddress,
  
          // 2️⃣ Fix: properly convert orderItems to readable format
          items: (o.orderItems || []).map(item => ({
            name: item.menuItem.name,
            qty: item.quantity,
            subtotal: item.subtotal
          })),
  
          total: o.grandTotal,
          driver: o.driver,
          orderStatus: o.orderStatus,
          deliveredAt: o.deliveredAt
        }));
  
        setOrders(mapped);
      })
      .catch(err => console.error("Failed to load orders", err));

      fetch("http://localhost:8080/api/drivers/all")
      .then(res => res.json())
      .then(data => {
        const activeDrivers = data.filter(d => d.active === true);
        setDrivers(activeDrivers);
      })
      .catch(err => console.error("Failed to load drivers", err));
  
    // 2️⃣ Load staff username from localStorage
    const username = localStorage.getItem("staffUsername");
    if (username) setStaffName(username);
  
  }, []);

   

  useEffect(() => {
    console.log("Drivers updated:", drivers);
  }, [drivers]);
  

  const assignDriver = (orderId, driverId) => {
    fetch(`http://localhost:8080/api/orders/${orderId}/assignDriver?driverId=${driverId}`, {
      method: "POST",
    })
      .then(res => res.text())
      .then(() => {
        const assigned = drivers.find(d => d.driverId === Number(driverId));
  
        setOrders(prev =>
          prev.map(o =>
            o.id === orderId
              ? {
                  ...o,
                  driver: assigned,
                  orderStatus: STATUSES.ASSIGNED
                }
              : o
          )
        );
      })
      .catch(err => console.error("Driver assign error:", err));
  };
  

  const markDelivered = (orderId) => {
    fetch(`http://localhost:8080/api/orders/${orderId}/deliver`, {
      method: "POST",
    })
      .then(() => {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, orderStatus: STATUSES.DELIVERED, deliveredAt: new Date().toISOString() }
              : o
          )
        );
      })
      .catch((err) => console.error("Delivery error:", err));
  };

  const handleLogout = async () => {
    const username = localStorage.getItem("staffUsername");

  if (username) {
    await fetch(`http://localhost:8080/api/auth/logout?username=${username}`, {
      method: "POST"
    });
  }

  localStorage.removeItem("staffLoggedIn");
  localStorage.removeItem("staffUsername");
  localStorage.removeItem("isAdmin");

  navigate("/staff");
  };

  const handleChangePassword = () => {
    console.log("going to change Password")
    navigate("/change-password");
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>📦 Staff Panel — Orders</h2>
          <div style={styles.subHeader}>⚡ Assign drivers and mark orders delivered.</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontWeight: "600", color: "#333" }}>👤 {staffName}</span>

          <button onClick={handleChangePassword} style={styles.changeBtn}>
            🔑 Change Password
          </button>

          <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 Logout
          </button>
        </div>
      </header>

      {/* ✅ Filters (Incoming → Delivered → All) */}
      <div style={styles.tabs}>
        {[
          { key: STATUSES.PENDING, label: "Incoming Orders" },
          { key: STATUSES.ASSIGNED, label: "Assigned Driver" },
          { key: STATUSES.DELIVERED, label: "Delivered" },
          { key: "All", label: "All" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            style={{ ...styles.tab, ...(filter === t.key ? styles.tabActive : {}) }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Placed</th>
              <th>ETA</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Driver</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
              <td>{o.id}</td>
              <td>{fmtDateTime(o.orderDateTime)}</td>
              <td>{o.eta ? fmtDateTime(o.eta) : "—"}</td>
            
              {/* FIX: Show actual customer name */}
              <td>{o.customerName}</td>
            
              {/* FIX: Items count */}
              <td>
              {o.items.map(i => `${i.name} x${i.qty}`).join(", ")}
</td>
            
              {/* FIX: Money safe */}
              <td>{fmtMoney(o.total)}</td>
            
              {/* FIX: Driver */}
              <td>
        {o.orderStatus === STATUSES.PENDING ? (
          <div style={{ display: "flex", gap: 6 }}>
        <select
          onChange={(e) => assignDriver(o.id, e.target.value)}
          style={{ padding: "4px 8px", borderRadius: 6 }}
          defaultValue=""
        >
          <option value="" disabled>Assign Driver</option>
          {drivers.map(d => (
             <option key={d.driverId} value={d.driverId}>
             {d.firstName} {d.lastName}
           </option>
         ))}
        </select>
        </div>
      ) : (
          <span>{o.driver ? o.driver.firstName : "—"}</span>
      )}
        </td>
            
              {/* FIX: Status */}
              <td>{o.orderStatus}</td>
            
              <td style={{ textAlign: "right" }}>
                {o.orderStatus !== STATUSES.DELIVERED ? (
                  <button style={styles.smallBtn} onClick={() => markDelivered(o.id)}>
                    Mark Delivered
                  </button>
                ) : (
                  <div style={{ fontSize: 11, color: "#666", lineHeight: "1.4" }}>
                    ✅ Delivered<br />
                    <span style={{ fontStyle: "italic" }}>
                      {fmtDateTime(o.deliveredAt)}
                    </span>
                  </div>
                )}
              </td>
            </tr>
            
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----- Styles -----
const styles = {
  page: { padding: 20, fontFamily: "Inter, system-ui, Arial, sans-serif" },
  header: {
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subHeader: { fontSize: 16, fontWeight: "600", color: "#ff5722", marginTop: "6px" },
  tabs: { display: "flex", gap: 10, marginBottom: 15 },
  card: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  select: { padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc" },
  smallBtn: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #ddd",
    background: "#ff5722",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 12,
  },
  logoutBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    background: "#ff4444",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  changeBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    background: "#ff5722",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  tab: {
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
  },
  tabActive: { background: "#ffefe7", borderColor: "#ff5722", color: "#ff5722" },
};
