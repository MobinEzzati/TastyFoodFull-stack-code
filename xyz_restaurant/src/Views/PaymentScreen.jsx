import React, { useState } from "react";
import OrderTracking from "/Users/mobinezzati/Desktop/fall2025/webAppDevelopment/xyz_restaurant/src/Component/OrderTracking.jsx";
import axios from "axios";

// ✅ Import logos
import mastercardLogo from "../img/MasterCard.png";
import visaLogo from "../img/visaLogo.png";
import paypalLogo from "../img/paypalLogo.png";
import discoverLogo from "../img/discoverLogo.png";

function PaymentScreen({ onClose, cartItems }) {
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [hoveredMethod, setHoveredMethod] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);

  // 🔑 Frequent Eater code UI state
  const [customerCode, setCustomerCode] = useState("");
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [usedDiscount, setUsedDiscount] = useState(false); // UI flag for discount applied
  const [customerName, setCustomerName] = useState(null);  // just to show in success screen later
  const [skipPaymentMethod, setSkipPaymentMethod] = useState(false);


  const [formData, setFormData] = useState({
    deliveryFirstName: "",
    deliveryLastName: "",
    deliveryPhone: "",
    deliveryStreet: "",
    deliveryCity: "",
    deliveryState: "",
    deliveryZipcode: "",
    cardNumber: "",
    firstName: "",
    lastName: "",
    expiration: "",
    cvc: "",
    buildingNumber: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const [errors, setErrors] = useState({});

  const states = ["CA", "NY", "TX", "FL", "IL", "MA", "MN" ,"Other"];
  const paymentMethods = [
    { name: "MasterCard", logo: mastercardLogo },
    { name: "Visa", logo: visaLogo },
    { name: "PayPal", logo: paypalLogo },
    { name: "Discover", logo: discoverLogo },
  ];

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const addMinutes = (date, mins) =>
    new Date(new Date(date).getTime() + mins * 60000);

  // ✅ Delivery validation
  const validateDelivery = () => {
    let newErrors = {};
    if (!/^[A-Za-z]{2,}$/.test(formData.deliveryFirstName))
      newErrors.deliveryFirstName = "First name must be at least 2 letters.";
    if (!/^[A-Za-z]{2,}$/.test(formData.deliveryLastName))
      newErrors.deliveryLastName = "Last name must be at least 2 letters.";
    const phone = formData.deliveryPhone.replace(/\D/g, "");
    if (!/^[1-9]\d{9}$/.test(phone))
      newErrors.deliveryPhone = "Phone must be 10 digits.";
    if (!formData.deliveryStreet)
      newErrors.deliveryStreet = "Street is required.";
    if (!formData.deliveryCity) newErrors.deliveryCity = "City is required.";
    if (!formData.deliveryState) newErrors.deliveryState = "State is required.";
    if (!/^\d{5}$/.test(formData.deliveryZipcode))
      newErrors.deliveryZipcode = "Zipcode must be 5 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitDelivery = (e) => {
    e.preventDefault();
    if (validateDelivery()) setStep(2);
  };

  // ✅ Payment validation
  const validatePayment = () => {
    let newErrors = {};
    if (!/^[1-9]\d{15}$/.test(formData.cardNumber))
      newErrors.cardNumber = "Card number must be 16 digits.";
    if (!/^[A-Za-z]{2,}$/.test(formData.firstName))
      newErrors.firstName = "First name must be at least 2 letters.";
    if (!/^[A-Za-z]{2,}$/.test(formData.lastName))
      newErrors.lastName = "Last name must be at least 2 letters.";
    if (!formData.expiration) {
      newErrors.expiration = "Expiration date is required.";
    } else {
      const today = new Date();
      const exp = new Date(formData.expiration + "-01");
      if (exp < today) newErrors.expiration = "Card is expired.";
    }
    if (!/^\d{3}$/.test(formData.cvc))
      newErrors.cvc = "CVC must be 3 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔄 UI-only: pretend to send order, same as before
  const handleSubmitPayment = (e) => {
    e.preventDefault();

    if (!cartItems || cartItems.length === 0) {
      alert("⚠️ Add items before placing order.");
      return;
    }

    if (validatePayment()) {
      const orderRequest = {
        customerName: `${formData.deliveryFirstName} ${formData.deliveryLastName}`,
        customerPhone: formData.deliveryPhone,
        tipAmount: formData.tipAmount,

        deliveryAddress: {
          streetNumber: formData.buildingNumber,
          unitNumber: "",
          buildingName: "",
          city: formData.deliveryCity,
          state: formData.deliveryState,
          zipCode: formData.deliveryZipcode,
          country: "USA",
        },

        items: cartItems.map((item) => ({
          menuItemId: item.itemId, // MUST be itemId from backend
          quantity: item.qty,
        })),
      };

      console.log("REQ:", orderRequest);

      axios
        .post("http://localhost:8080/api/orders/create", orderRequest)
        .then((res) => {
          console.log("Order created:", res.data);
          setLastOrder(res.data);
          setCustomerName(orderRequest.customerName);
          setStep(3);
        })
        .catch((err) => {
          console.error("Order error:", err);
          alert("Order failed to save. Check backend logs.");
        });
    }
  };

  const fetchCustomerByCode = async () => {
    if (!customerCode.trim()) return;
  
    setLoadingCustomer(true);
    setErrors({});
  
    try {
      // 1️⃣ Fetch customer by unique code
      const customerRes = await axios.get(
        `http://localhost:8080/api/customers/code/${customerCode.trim()}`
      );
  
      const customer = customerRes.data;
      console.log("Fetched customer:", customer);
  
      if (!customer.approved) {
        alert("❌ This customer is not approved yet.");
        setLoadingCustomer(false);
        return;
      }
  
      // 2️⃣ Autofill delivery info from customer
      setFormData((prev) => ({
        ...prev,
        deliveryFirstName: customer.firstName,
        deliveryLastName: customer.lastName,
        deliveryPhone: customer.phoneNumber,
        deliveryStreet: customer.deliveryAddress?.streetNumber || "",
        deliveryCity: customer.deliveryAddress?.city || "",
        deliveryState: customer.deliveryAddress?.state || "",
        deliveryZipcode: customer.deliveryAddress?.zipCode || ""
      }));
  
      // ⭐ Save name for success screen
      setCustomerName(`${customer.firstName} ${customer.lastName}`);
  
      // 3️⃣ Fetch saved credit card (if exists)
      try {
        const cardRes = await axios.get(
          `http://localhost:8080/api/cards/customer/${customer.customerNumber}`
        );
  
        const card = cardRes.data;
        console.log("Fetched saved card:", card);
  
        // Autofill billing + card info
        setFormData((prev) => ({
          ...prev,
          firstName: customer.firstName,
          lastName: customer.lastName,
          cardNumber: card.cardNumber,
          expiration: card.expiryDate,   // must be yyyy-MM format
          cvc: card.cvv,
          buildingNumber: customer.deliveryAddress?.streetNumber || "",
          street: customer.deliveryAddress?.street || "",
          city: customer.deliveryAddress?.city || "",
          state: customer.deliveryAddress?.state || "",
          zipcode: customer.deliveryAddress?.zipCode || "",
        }));
  
        // Skip payment method selection since card is saved
        setSkipPaymentMethod(true);
        setSelectedMethod("Saved Card");
  
      } catch (cardErr) {
        console.log("No saved card for this customer.");
        setSkipPaymentMethod(false);
      }
  
      // 4️⃣ Discount UI flag (backend will compute real discount)
      if (customer.points >= 100) {
        setUsedDiscount(true);
        alert("🎉 You have 100+ points! A 10% discount will be applied.");
      } else {
        setUsedDiscount(false);
      }
  
    } catch (err) {
      alert("❌ Customer not found for this code.");
      console.error(err);
      setUsedDiscount(false);
    }
  
    setLoadingCustomer(false);
  };
  


  // 📊 For success screen: compute bill & points (UI only)
  const billBeforeCharges = cartItems?.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  ) || 0;
  const pointsEarnedThisOrder = Math.floor(billBeforeCharges); // 1 point per dollar (UI-only)

  // ✅ Success screen
  if (step === 3 && lastOrder) {
    const orderDate = new Date(lastOrder.orderDateTime).toLocaleString();
    const eta = addMinutes(lastOrder.orderDateTime, 30).toLocaleTimeString(
      [],
      { hour: "2-digit", minute: "2-digit" }
    );

    return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <h2 style={styles.title}>🎉 Order Placed Successfully!</h2>

          {customerName && (
            <p>
              <strong>Customer:</strong> {customerName}
            </p>
          )}
          <p>
            <strong>Order ID:</strong> {lastOrder.orderId}
          </p>
          <p>
            <strong>Order Date & Time:</strong> {orderDate}
          </p>
          <p>
            <strong>Estimated Delivery Time:</strong> {eta}
          </p>

          <hr />

          {/* Bonus UI: points & discount info */}
          <h3>Reward Summary (UI)</h3>
          <p>
            <strong>Bill before service & tip:</strong>{" "}
            ${billBeforeCharges.toFixed(2)}
          </p>
          <p>
            <strong>Points earned this order:</strong>{" "}
            {pointsEarnedThisOrder} pts
          </p>
          <p>
            <strong>Discount applied:</strong>{" "}
            {usedDiscount ? "✅ 10% discount (UI – real calculation in backend later)" : "None this order"}
          </p>

          {/* Delivery progress */}
          <OrderTracking deliveryTime={eta} />

          <button style={styles.primaryBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  // 🧾 Main modal (steps 1 & 2)
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Steps */}
        <div style={styles.steps}>
          <div
            style={{ ...styles.step, ...(step >= 1 ? styles.activeStep : {}) }}
          >
            1. Delivery
          </div>
          <div
            style={{ ...styles.step, ...(step >= 2 ? styles.activeStep : {}) }}
          >
            2. Payment
          </div>
          <div
            style={{ ...styles.step, ...(step >= 3 ? styles.activeStep : {}) }}
          >
            3. Success
          </div>
        </div>

        {/* Step 1: Delivery + Frequent Eater Number section */}
        {step === 1 && (
          <>
            {/* Frequent Eater Box (UI) */}
            <div
              style={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                background: "#fff8f2",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Have a Frequent Eater Number?</h3>

              <input
                type="text"
                placeholder="Enter your unique code (e.g. FE1234)"
                value={customerCode}
                onChange={(e) => setCustomerCode(e.target.value)}
                style={styles.input}
              />

              <button
                style={styles.primaryBtn}
                onClick={fetchCustomerByCode}
                disabled={!customerCode || loadingCustomer}
              >
                {loadingCustomer ? "Loading..." : "Autofill My Info"}
              </button>

              {usedDiscount && (
                <p style={{ color: "green", fontSize: "13px" }}>
                  ✅ Discount will be applied for this order (UI only, backend
                  later).
                </p>
              )}
            </div>

            <h2 style={styles.title}>Delivery Address</h2>
            <form style={styles.form} onSubmit={handleSubmitDelivery}>
              <input
                style={styles.input}
                name="deliveryFirstName"
                placeholder="First Name"
                value={formData.deliveryFirstName}
                onChange={handleChange}
              />
              {errors.deliveryFirstName && (
                <p style={styles.error}>{errors.deliveryFirstName}</p>
              )}

              <input
                style={styles.input}
                name="deliveryLastName"
                placeholder="Last Name"
                value={formData.deliveryLastName}
                onChange={handleChange}
              />
              {errors.deliveryLastName && (
                <p style={styles.error}>{errors.deliveryLastName}</p>
              )}

              <input
                style={styles.input}
                name="deliveryPhone"
                placeholder="Phone"
                value={formData.deliveryPhone}
                onChange={handleChange}
              />
              {errors.deliveryPhone && (
                <p style={styles.error}>{errors.deliveryPhone}</p>
              )}

              <input
                style={styles.input}
                name="deliveryStreet"
                placeholder="Street"
                value={formData.deliveryStreet}
                onChange={handleChange}
              />
              {errors.deliveryStreet && (
                <p style={styles.error}>{errors.deliveryStreet}</p>
              )}


<input
  style={styles.input}
  name="buildingNumber"              // 🔁 changed from "deliveryBuilding"
  placeholder="Building Number"
  value={formData.buildingNumber}
  onChange={handleChange}
/>
              {errors.buildingNumber && (
                <p style={styles.error}>{errors.buildingNumber}</p>
              )}



              <input
                style={styles.input}
                name="deliveryCity"
                placeholder="City"
                value={formData.deliveryCity}
                onChange={handleChange}
              />
              {errors.deliveryCity && (
                <p style={styles.error}>{errors.deliveryCity}</p>
              )}

              <select
                style={styles.input}
                name="deliveryState"
                value={formData.deliveryState}
                onChange={handleChange}
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              {errors.deliveryState && (
                <p style={styles.error}>{errors.deliveryState}</p>
              )}

              <input
                style={styles.input}
                name="deliveryZipcode"
                placeholder="Zipcode"
                value={formData.deliveryZipcode}
                onChange={handleChange}
              />
              {errors.deliveryZipcode && (
                <p style={styles.error}>{errors.deliveryZipcode}</p>
              )}

              <button type="submit" style={styles.primaryBtn}>
                Continue to Payment ➡️
              </button>
            </form>
          </>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <>
            {(!selectedMethod && !skipPaymentMethod) ? (
              <>
                <h2 style={styles.title}>Select Payment Method</h2>
                <div style={styles.methodList}>
                  {paymentMethods.map((m) => {
                    const isSelected = selectedMethod === m.name;
                    const isHovered = hoveredMethod === m.name;
                    return (
                      <div
                        key={m.name}
                        style={{
                          ...styles.methodCard,
                          ...(isHovered ? styles.methodCardHover : {}),
                          ...(isSelected ? styles.methodCardSelected : {}),
                        }}
                        onMouseEnter={() => setHoveredMethod(m.name)}
                        onMouseLeave={() => setHoveredMethod(null)}
                        onClick={() => setSelectedMethod(m.name)}
                      >
                        <img
                          src={m.logo}
                          alt={m.name}
                          style={styles.logoImg}
                        />
                        <span>{m.name}</span>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  style={styles.secondaryBtn}
                  onClick={() => setStep(1)}
                >
                  ⬅ Back
                </button>
              </>
            ) : (
              <>
                <h2 style={styles.title}>{selectedMethod} Payment Info</h2>
                <form style={styles.form} onSubmit={handleSubmitPayment}>
  {/* CARD NUMBER */}
  <input
    style={styles.input}
    name="cardNumber"
    placeholder="Card Number (16 digits)"
    value={formData.cardNumber}
    onChange={handleChange}
  />
  {errors.cardNumber && <p style={styles.error}>{errors.cardNumber}</p>}

  {/* CARD FIRST NAME */}
  <input
    style={styles.input}
    name="firstName"
    placeholder="First Name"
    value={formData.firstName}
    onChange={handleChange}
  />
  {errors.firstName && <p style={styles.error}>{errors.firstName}</p>}

  {/* CARD LAST NAME */}
  <input
    style={styles.input}
    name="lastName"
    placeholder="Last Name"
    value={formData.lastName}
    onChange={handleChange}
  />
  {errors.lastName && <p style={styles.error}>{errors.lastName}</p>}

  {/* EXPIRATION */}
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <label htmlFor="expiration" style={styles.label}>
      Exp. Month/Year
    </label>
    <input
      id="expiration"
      style={styles.input}
      type="month"
      name="expiration"
      value={formData.expiration}
      onChange={handleChange}
    />
  </div>
  {errors.expiration && <p style={styles.error}>{errors.expiration}</p>}

  {/* CVC */}
  <input
    style={styles.input}
    name="cvc"
    placeholder="CVC"
    value={formData.cvc}
    onChange={handleChange}
  />
  {errors.cvc && <p style={styles.error}>{errors.cvc}</p>}

  {/* ---------------------------- */}
  {/* ⭐ BILLING ADDRESS SECTION ⭐ */}
  {/* ---------------------------- */}
  <h3 style={{ marginTop: "15px" }}>Billing Address</h3>

  <input
    style={styles.input}
    name="street"
    placeholder="Street"
    value={formData.street}
    onChange={handleChange}
  />

  <input
    style={styles.input}
    name="buildingNumber"
    placeholder="Building Number"
    value={formData.buildingNumber}
    onChange={handleChange}
  />

  <input
    style={styles.input}
    name="city"
    placeholder="City"
    value={formData.city}
    onChange={handleChange}
  />

  <select
    style={styles.input}
    name="state"
    value={formData.state}
    onChange={handleChange}
  >
    <option value="">Select State</option>
    {["CA", "NY", "TX", "FL", "IL", "MA","MN", "Other"].map((s) => (
      <option key={s}>{s}</option>
    ))}
  </select>

  <input
    style={styles.input}
    name="zipcode"
    placeholder="Zipcode"
    value={formData.zipcode}
    onChange={handleChange}
  />

  {/* BUTTONS */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
      marginTop: "15px",
    }}
  >
    <button
      type="button"
      style={styles.secondaryBtn}
      onClick={() => setStep(1)}
    >
      ⬅ Back
    </button>

    <button type="submit" style={{ ...styles.primaryBtn, flex: 1 }}>
      Pay Now 💳
    </button>
  </div>
</form>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ✅ Styles (same as before, with label added)
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
  },
  steps: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  step: {
    flex: 1,
    textAlign: "center",
    padding: "8px",
    borderRadius: "6px",
    background: "#eee",
    margin: "0 5px",
    fontSize: "14px",
    fontWeight: "500",
  },
  activeStep: { background: "#ff5722", color: "#fff" },
  title: { textAlign: "center", marginBottom: "15px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
  },
  primaryBtn: {
    marginTop: "15px",
    padding: "12px",
    backgroundColor: "#ff5722",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
  secondaryBtn: {
    marginTop: "15px",
    padding: "10px 14px",
    backgroundColor: "transparent",
    color: "#ff5722",
    border: "2px solid #ff5722",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  methodList: { display: "flex", flexDirection: "column", gap: "12px" },
  methodCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    fontSize: "16px",
    backgroundColor: "#fff",
  },
  methodCardHover: {
    transform: "scale(1.03)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  methodCardSelected: {
    border: "2px solid #ff5722",
    backgroundColor: "#fff7f3",
    transform: "scale(1.05)",
    boxShadow: "0 6px 18px rgba(255,87,34,0.3)",
  },
  logoImg: {
    width: "50px",
    height: "30px",
    objectFit: "contain",
    marginRight: "10px",
  },
  error: { color: "red", fontSize: "12px", margin: 0 },
  label: { fontSize: "13px", fontWeight: "500" },
};

export default PaymentScreen;
