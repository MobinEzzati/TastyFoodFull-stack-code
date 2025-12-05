import React, { useEffect, useState } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
import foodData from "../data/foodData";
import CategoryBar from "../data/CategoryBar";
import MenuCard from "../Component/MenuCard"
import FoodModal from "../Component/FoodModal";
import CartDrawer from "../Component/CartDrawer";
import PaymentScreen from "../Views/PaymentScreen";
import logo from "../img/Logo.png"

function RestaurantHome() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartCount, setCartCount] = useState(0);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]); 


  const filteredData =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  
      useEffect(() => {
        axios.get("http://localhost:8080/api/menu/all")
          .then(response => {
            console.log("Menu API response:", response.data);   // 👈 print here
            setMenuItems(response.data);   // store backend menu data
          })
          .catch(error => {
            console.error("Error fetching menu:", error);
          });
      }, []);

  const handleAddToCart = (item, qty) => {
    setCartCount(cartCount + qty);
    setCartItems((prev) => {
      const existing = prev.find((p) => p.name === item.name);
      if (existing) {
        return prev.map((p) =>
          p.name === item.name ? { ...p, qty: p.qty + qty } : p
        );
      }
      return [...prev, { ...item, qty }];
    });
  };

  const handleRemoveItem = (title) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.name === title ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
    setCartCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const styles = {
    button: {
      padding: "8px 16px",
      border: "none",
      borderRadius: "6px",
      backgroundColor: "#ff5722",
      color: "white",
      fontWeight: "bold",
      cursor: "pointer",
    },
  };

  return (
    <div>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "20px",
          padding: "0 40px",
        }}
      >
        {/* Left: Buttons */}
        <div style={{ display: "flex", gap: "10px", flex: 1 }}>

        <button style={styles.button} onClick={() => navigate("/customerRegister")}>
  Customer Registeration
</button>

                
          <button style={styles.button} onClick={() => navigate("/admin")}>
            Admin Login
          </button>
          <button style={styles.button} onClick={() => navigate("/staff")}>
  Staff Login
</button>

        </div>
        <img
    src= {logo}
    alt="TastyFood Logo"
    style={{ height: "80px", width: "80px", borderRadius: "50%" }}
  />

        {/* Center: Title */}
        <h1 style={{ margin: 0, flex: 2, textAlign: "center" }}>
          TastyFood Restaurant
        </h1>

        {/* Right: Basket */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => setIsCartOpen(true)}
          >
            <span style={{ fontSize: "28px" }}>🛒</span>
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-10px",
                  backgroundColor: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "3px 7px",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={() => {
          setIsCartOpen(false);
          setIsPaymentOpen(true);
        }}
      />

      {/* Category bar */}
      <CategoryBar onSelectCategory={setSelectedCategory} />

      {/* Food items */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "30px",
          justifyContent: "center",
        }}
      >
        {filteredData.map((item, i) => (
          <MenuCard key={i} item={item} onSelect={setSelectedFood} />
        ))}
      </div>

      {/* Popup modal */}
      {selectedFood && (
        <FoodModal
          item={selectedFood}
          onClose={() => setSelectedFood(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Payment screen */}
      {isPaymentOpen && (
  <PaymentScreen
   // ✅ pass order items
    onClose={() => {
      setIsPaymentOpen(false);
      setCartItems([]);   // ✅ clear cart after payment
      setCartCount(0);    // ✅ reset cart badge
    }}
  
    cartItems={cartItems}
  />
)


      }
    </div>
  );
}

export default RestaurantHome;
