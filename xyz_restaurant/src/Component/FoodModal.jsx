import React, { useState } from "react";

function FoodModal({ item, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  if (!item) return null; // no food selected

  const increase = () => setQuantity(quantity + 1);
  const decrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.close} onClick={onClose}>✖</button>
        <img src={item.image_url} alt={item.name} style={styles.image} />
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        <p><strong>Calories:</strong> 520 kcal</p>
        <p><strong>Popularity:</strong> 87%</p>

        {/* Quantity Controls */}
        <div style={styles.controls}>
          <button onClick={decrease} style={styles.counterBtn}>−</button>
          <input type="text" readOnly value={quantity} style={styles.input} />
          <button onClick={increase} style={styles.counterBtn}>+</button>
        </div>

        {/* Add to Cart */}
        <button
          style={styles.addBtn}
          onClick={() => {
            onAddToCart(item, quantity);
            onClose();
          }}
        >
          Add {quantity} to Cart (${quantity * 9.99})
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex", justifyContent: "center", alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "10px",
    borderRadius: "12px",
    width: "400px",
    textAlign: "center",
    position: "relative",
  },
  close: {
    position: "absolute", top: "10px", right: "10px",
    border: "none", background: "transparent", fontSize: "20px", cursor: "pointer",
  },
  image: { width: "100%", borderRadius: "10px", marginBottom: "15px" },
  controls: { 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    margin: "15px 0",
    gap: "12px"
  },
  counterBtn: { 
    backgroundColor: "#ff5722", 
    color: "white", 
    border: "none",
    borderRadius: "50%",
    width: "40px", 
    height: "40px", 
    fontSize: "20px", 
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    transition: "transform 0.2s, background 0.2s",
  },
  counterBtnHover: {
    backgroundColor: "#e64a19",
    transform: "scale(1.1)",
  },
  input: { 
    width: "50px", 
    height: "40px",
    textAlign: "center", 
    fontSize: "16px",
    border: "1px solid #ccc", 
    borderRadius: "6px",
  },
  addBtn: {
    backgroundColor: "#ff5722",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
    marginTop: "15px",
    boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
    transition: "background 0.3s",
  },
};


export default FoodModal;
