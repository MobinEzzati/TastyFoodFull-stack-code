import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 

function CustomerRegister() {
  const states = ["CA", "NY", "TX", "FL", "IL", "WA", "Other"];
  
  const [formData, setFormData] = useState({
    firstName:"",
    lastName:"",
    deliveryPhone: "",
    email: "",
    
    deliveryStreet: "",
    deliveryCity: "",
    deliveryState: "",
    deliveryZipcode: "",
  
    billingStreet: "",
    billingCity: "",
    billingState: "",
    billingZipcode: "",
  
    cardNumber: "",
    expiration: "",
    cvc: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateRegistration = () => {
    let newErrors = {};
  
    if (!/^[A-Za-z\s]{2,}$/.test(formData.firstName))
      newErrors.firstName = "First name must be at least 2 letters.";
  
    if (!/^[A-Za-z\s]{2,}$/.test(formData.lastName))
      newErrors.lastName = "Last name must be at least 2 letters.";
  
    const phone = formData.deliveryPhone.replace(/\D/g, "");
    if (!/^[1-9]\d{9}$/.test(phone))
      newErrors.deliveryPhone = "Phone must be 10 digits.";

    if (!formData.billingStreet) newErrors.billingStreet = "Billing street is required.";
if (!formData.billingCity) newErrors.billingCity = "Billing city is required.";
if (!formData.billingState) newErrors.billingState = "Billing state is required.";

if (!/^\d{5}$/.test(formData.billingZipcode))
  newErrors.billingZipcode = "Billing zipcode must be 5 digits.";
  
    if (!validateEmail(formData.email))
      newErrors.email = "Invalid email address.";
  
    if (!formData.deliveryStreet) newErrors.deliveryStreet = "Street is required.";
    if (!formData.deliveryCity) newErrors.deliveryCity = "City is required.";
    if (!formData.deliveryState) newErrors.deliveryState = "State is required.";
    if (!/^\d{5}$/.test(formData.deliveryZipcode))
      newErrors.deliveryZipcode = "Zipcode must be 5 digits.";
  
    if (!/^[1-9]\d{15}$/.test(formData.cardNumber))
      newErrors.cardNumber = "Card number must be 16 digits and cannot start with 0.";
  
    if (!formData.expiration)
      newErrors.expiration = "Expiration date is required.";
    else {
      const today = new Date();
      const exp = new Date(formData.expiration + "-01");
      if (exp < today) newErrors.expiration = "Card is expired.";
    }
  
    if (!/^\d{3}$/.test(formData.cvc))
      newErrors.cvc = "CVC must be 3 digits.";
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
 
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegistration()) return;
  
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.deliveryPhone,
      email: formData.email,
    
      deliveryAddress: {
        street: formData.deliveryStreet,
        city: formData.deliveryCity,
        state: formData.deliveryState,
        zip: formData.deliveryZipcode,
        unit: "",
        building: ""
      },
    
      billingAddress: {
        street: formData.billingStreet,
        city: formData.billingCity,
        state: formData.billingState,
        zip: formData.billingZipcode,
        unit: "",
        building: ""
      },
    
      cardNumber: formData.cardNumber,
      expiryDate: formData.expiration,
      cvv: formData.cvc
    };
  
    try {
      const res = await fetch("http://localhost:8080/api/customers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const errText = await res.text();
        toast.error("❌ Registration failed: " + errText);
        return;
      }
  
      const data = await res.json();
      if (data.creditCard.verified === false) {
        toast.error("❌ Card was declined.");
        return;
      }
      
      // If approved:
      toast.success("🎉 Registration successful! Credit card approved!")
  
      // ✅ SUCCESS MESSAGE HERE
      toast.success("🎉 Registration submitted successfully!");
  
      // Optional small delay before redirect
      setTimeout(() => navigate("/RestaurantHome"), 1500);
  
    } catch (err) {
      toast.error("🚨 Server error");
      console.error(err);
    }
  };
  
  return (
    <div style={styles.container}>
      <h2>📝 Customer Registration</h2>
  
      <form onSubmit={handleRegister} style={styles.form}>
  
        {/* --- BASIC INFO --- */}
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          style={styles.input}
        />
        {errors.firstName && <p style={styles.error}>{errors.firstName}</p>}
  
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          style={styles.input}
        />
        {errors.lastName && <p style={styles.error}>{errors.lastName}</p>}
  
        <input
          type="text"
          placeholder="Phone"
          value={formData.deliveryPhone}
          onChange={(e) => setFormData({ ...formData, deliveryPhone: e.target.value })}
          style={styles.input}
        />
        {errors.deliveryPhone && <p style={styles.error}>{errors.deliveryPhone}</p>}
  
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={styles.input}
        />
        {errors.email && <p style={styles.error}>{errors.email}</p>}
  
        {/* --- DELIVERY ADDRESS --- */}
        <h3>📦 Delivery Address</h3>
  
        <input
          type="text"
          placeholder="Street"
          value={formData.deliveryStreet}
          onChange={(e) => setFormData({ ...formData, deliveryStreet: e.target.value })}
          style={styles.input}
        />
        {errors.deliveryStreet && <p style={styles.error}>{errors.deliveryStreet}</p>}
  
        <input
          type="text"
          placeholder="City"
          value={formData.deliveryCity}
          onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
          style={styles.input}
        />
        {errors.deliveryCity && <p style={styles.error}>{errors.deliveryCity}</p>}
  
        <select
          value={formData.deliveryState}
          onChange={(e) => setFormData({ ...formData, deliveryState: e.target.value })}
          style={styles.input}
        >
          <option value="">Select State</option>
          {states.map((s, index) => (
            <option key={index} value={s}>{s}</option>
          ))}
        </select>
        {errors.deliveryState && <p style={styles.error}>{errors.deliveryState}</p>}
  
        <input
          type="text"
          placeholder="Zipcode"
          value={formData.deliveryZipcode}
          onChange={(e) => setFormData({ ...formData, deliveryZipcode: e.target.value })}
          style={styles.input}
        />
        {errors.deliveryZipcode && (
          <p style={styles.error}>{errors.deliveryZipcode}</p>
        )}
  
        {/* --- BILLING ADDRESS --- */}
        <h3>💳 Billing Address</h3>
  
        <input
          type="text"
          placeholder="Billing Street"
          value={formData.billingStreet}
          onChange={(e) => setFormData({ ...formData, billingStreet: e.target.value })}
          style={styles.input}
        />
  
        <input
          type="text"
          placeholder="Billing City"
          value={formData.billingCity}
          onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
          style={styles.input}
        />
  
        <select
          value={formData.billingState}
          onChange={(e) => setFormData({ ...formData, billingState: e.target.value })}
          style={styles.input}
        >
          <option value="">Select State</option>
          {states.map((s, index) => (
            <option key={index} value={s}>{s}</option>
          ))}
        </select>
  
        <input
          type="text"
          placeholder="Billing Zipcode"
          value={formData.billingZipcode}
          onChange={(e) => setFormData({ ...formData, billingZipcode: e.target.value })}
          style={styles.input}
        />
  
        {/* --- PAYMENT --- */}
        <h3>💰 Payment Details</h3>
  
        <input
          type="text"
          placeholder="Card Number"
          value={formData.cardNumber}
          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
          style={styles.input}
        />
        {errors.cardNumber && <p style={styles.error}>{errors.cardNumber}</p>}
  
        <input
          type="month"
          value={formData.expiration}
          onChange={(e) => setFormData({ ...formData, expiration: e.target.value })}
          style={styles.input}
        />
        {errors.expiration && <p style={styles.error}>{errors.expiration}</p>}
  
        <input
          type="text"
          placeholder="CVC"
          value={formData.cvc}
          onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
          style={styles.input}
        />
        {errors.cvc && <p style={styles.error}>{errors.cvc}</p>}
  
        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "30px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fff",
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
  error: { color: "red", fontSize: "13px", margin: 0 },
};

export default CustomerRegister;
