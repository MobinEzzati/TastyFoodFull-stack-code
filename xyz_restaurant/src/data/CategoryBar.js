
import React, { useState } from "react";

function CategoryBar({ onSelectCategory }) {
    const categories = ["All", "Burger", "Chicken", "Pizza"];
    const [active, setActive] = useState("All");
  
    return (
      <div style={styles.container }>
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
      justifyContent: "center",   // ✅ centers buttons horizontally
      gap: "12px",
      padding: "10px",
      margintop:"20px",
      flexWrap: "wrap",           // ✅ makes it responsive (wraps on small screens)
    },
    button: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };
  
  export default CategoryBar;
