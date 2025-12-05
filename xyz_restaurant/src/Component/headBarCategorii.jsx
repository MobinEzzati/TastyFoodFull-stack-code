import React, { useState } from "react";

function CategoryBar({ onSelectCategory }) {
  const categories = ["All", "Burger", "Chicken", "Pizza"];
  const [active, setActive] = useState("All");

  return (
    <div style={styles.container}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            setActive(cat);
            onSelectCategory(cat.toLowerCase());
          }}
          style={{
            ...styles.button,
            backgroundColor: active === cat ? "#ff5722" : "#eee",
            color: active === cat ? "white" : "black",
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    overflowX: "auto",
    gap: "12px",
    padding: "10px",
    scrollbarWidth: "none", // hide scrollbar in Firefox
  },
  button: {
    flex: "0 0 auto",
    padding: "10px 20px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default CategoryBar;
