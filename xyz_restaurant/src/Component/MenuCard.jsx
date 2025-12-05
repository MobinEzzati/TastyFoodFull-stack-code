import React from "react";

function MenuCard({ item, onSelect }) {
  return (
    <div style={styles.card} onClick={() => onSelect(item)}>
      <img src={item.image_url} alt={item.name} style={styles.image} />
      <h3 style={styles.title}>{item.name}</h3>
      {/* <p style={styles.description}>{item.description}</p> */}
      <p style={styles.price}>${item.price.toFixed(2)}</p>
      <span style={styles.category}>{item.category}</span>
    </div>
  );
}

const styles = {
  card: {
    width: "220px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "transform 0.2s ease",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  title: { margin: "10px 0 5px 0" },
  description: { fontSize: "14px", color: "#555" },
  category: {
    display: "inline-block",
    marginTop: "8px",
    padding: "4px 10px",
    backgroundColor: "#ff5722",
    color: "white",
    borderRadius: "12px",
    fontSize: "12px",
    textTransform: "capitalize",
  },
};

export default MenuCard;
