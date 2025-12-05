import React, { useState } from "react";

function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onPlaceOrder }) {
  const [tip, setTip] = useState(0);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const serviceCharge = subtotal * 0.08;
  const total = subtotal + serviceCharge + tip;

  const handleTipPercent = (percent) => {
    setTip((subtotal * percent) / 100);
  };

  const handlePlaceOrder = () => {
    // ✅ Trigger the order placement callback without unique number logic
    onPlaceOrder();
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <h2>Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <>
            <ul style={styles.list}>
              {cartItems.map((item, i) => (
                <li key={i} style={styles.listItem}>
                  <span>
                    {item.name} (x{item.qty})
                  </span>
                  <div style={styles.itemRight}>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                    <button
                      onClick={() => onRemoveItem(item.name)}
                      style={styles.trashBtn}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* ✅ Subtotal */}
            <div style={styles.row}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {/* ✅ Service Charge */}
            <div style={styles.row}>
              <span>Service Charge (8%)</span>
              <span>${serviceCharge.toFixed(2)}</span>
            </div>

            {/* ✅ Tip Section */}
            <div style={{ marginTop: "12px" }}>
              <strong>How much do you want to tip?</strong>
              <div style={styles.tipButtons}>
                <button onClick={() => handleTipPercent(5)}>5%</button>
                <button onClick={() => handleTipPercent(10)}>10%</button>
                <button onClick={() => handleTipPercent(15)}>15%</button>
              </div>
              <input
                type="number"
                placeholder="Custom tip"
                value={tip}
                onChange={(e) => setTip(Number(e.target.value))}
                style={styles.tipInput}
              />
            </div>

            {/* ✅ Total */}
            <div style={styles.totalRow}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          <button
            style={{
              ...styles.placeOrder,
              backgroundColor: cartItems.length === 0 ? "#ccc" : "#ff5722",
              cursor: cartItems.length === 0 ? "not-allowed" : "pointer",
            }}
            disabled={cartItems.length === 0}
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "flex-end",
  },
  drawer: {
    background: "#fff",
    width: "340px",
    height: "100%",
    padding: "20px",
    boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: "15px 0",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    paddingBottom: "10px",
    borderBottom: "1px solid #ddd",
  },
  itemRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  trashBtn: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "16px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "6px",
    fontSize: "14px",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: "12px",
    borderTop: "2px solid #000",
    fontWeight: "bold",
    fontSize: "16px",
    marginTop: "12px",
  },
  tipButtons: {
    display: "flex",
    gap: "8px",
    marginTop: "6px",
  },
  tipInput: {
    marginTop: "8px",
    width: "100%",
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  footer: {
    borderTop: "1px solid #ddd",
    paddingTop: "10px",
    marginTop: "10px",
  },
  placeOrder: {
    padding: "10px",
    backgroundColor: "#ff5722",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
  },
};

export default CartDrawer;
