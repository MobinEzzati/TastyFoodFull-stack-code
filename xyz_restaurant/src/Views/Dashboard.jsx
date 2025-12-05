import React, { useState } from "react";
import { data, useNavigate } from "react-router-dom";
import logo from "/Users/mobinezzati/Desktop/fall2025/webAppDevelopment/xyz_restaurant/src/img/Logo.png" ; 
import { useEffect } from "react";

import { toast } from "react-toastify";


function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("👋 Logged out successfully!");
    navigate("/admin");
  };


  // Reusable validator
const isValidName = (name) => /^[A-Za-z]{2,}$/.test(name);
// only allows letters, at least 2 characters long


  const validatePassword = () => {
    let errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required.";
    }
  
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters.";
    }
  
    // 🚫 Prevent using the same password again
    if (passwordForm.newPassword === passwordForm.currentPassword) {
      errors.newPassword = "New password cannot be the same as the current password.";
    }
  
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      // ✅ Normally you'd call your backend API here
      setPasswordSuccess(true);
    }
  };
  // Staff data
  const [staff, setStaff] = useState([]);


  // Drivers data
  const [drivers, setDrivers] = useState([]);

  // Popup states
  const [showStaffPopup, setShowStaffPopup] = useState(false);
  const [newStaff, setNewStaff] = useState({ firstName: "", lastName: "", email:""});
  const [generatedStaff, setGeneratedStaff] = useState(null);
    // Handle Change Password
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [showStaffConfirm, setShowStaffConfirm] = useState(false);
  const [lastCreatedStaff, setLastCreatedStaff] = useState(null);

  const [showClientPopup, setShowClientPopup] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ firstName: "", lastName: "", number: "" });
  const [generatedClient, setGeneratedClient] = useState(null);

  const [showDriverPopup, setShowDriverPopup] = useState(false);
  const [newDriver, setNewDriver] = useState({ firstName: "", lastName: "" ,});
  const [generatedDriver, setGeneratedDriver] = useState(null);

  // Delete popups
  const [showDeleteStaffPopup, setShowDeleteStaffPopup] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");

  const [showDeleteClientPopup, setShowDeleteClientPopup] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");

  const [showDeleteDriverPopup, setShowDeleteDriverPopup] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");

  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [approvedClient, setApprovedClient] = useState(null);
  const [customers, setCustomers] = useState([]);


  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAction = (action) => {
    if (action === "Add Staff") setShowStaffPopup(true);
    else if (action === "Add Client") setShowClientPopup(true);
    else if (action === "Add Driver") setShowDriverPopup(true);
    else if (action === "Delete Staff") setShowDeleteStaffPopup(true);
    else if (action === "Delete Client") setShowDeleteClientPopup(true);
    else if (action === "Remove Driver") setShowDeleteDriverPopup(true);
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/staff/all")
      .then((res) => res.json())
      .then((data) => setStaff(data))
      .catch((err) => console.error("❌ Failed to load staff:", err));

      fetch("http://localhost:8080/api/drivers/all")
    .then((res) => res.json())
    .then((data) => setDrivers(data))
    .catch((err) => console.error("❌ Failed to load drivers:", err));

    fetch("http://localhost:8080/api/customers/all")
    .then((res) => res.json())
    .then((data)=> setCustomers(data))
    .catch((err) => console.error("❌ Failed to load Customers:", err));
  }, []);

  // --- Staff ---
  const handleStaffChange = (e) => {
    setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
  };

  // --- Driver ---
const handleDriverChange = (e) => {
  setNewDriver({ ...newDriver, [e.target.name]: e.target.value });
};


  // inside Dashboard.js (your file)
  const generateStaffCredentials = async () => {
    const { firstName, lastName, email } = newStaff;
  
    if (!firstName || !lastName || !email) {
      alert("⚠️ Please enter first name, last name, and email");
      return;
    }
  
    if (!isValidName(firstName) || !isValidName(lastName)) {
      alert("❌ Names must contain only letters and be at least 2 characters.");
      return;
    }
  
    try {
      const res = await fetch(
        `http://localhost:8080/api/staff/create?firstName=${firstName}&lastName=${lastName}`,
        { method: "POST" }
      );
  
      if (!res.ok) {
        const err = await res.text();
        alert("❌ " + err);
        return;
      }
  
      const staffCreated = await res.json();
  
      // Show credentials in popup
      setLastCreatedStaff({
        username: staffCreated.username,
        password: "(sent to email)",
      });
  
      // Add to UI table
      setStaff([...staff, staffCreated]);
  
      // Close + confirm
      setShowStaffPopup(false);
      setShowStaffConfirm(true);
  
      // Reset form
      setNewStaff({ firstName: "", lastName: "", email: "" });
  
    } catch (err) {
      console.error(err);
      alert("Server Error ❌");
    }
  };
  

  

  const handleDeleteStaff = () => {
    if (!selectedStaff) return;
  
    const staffToDelete = staff.find(
      (s) => s.loginCredential.username === selectedStaff
    );
  
    if (!staffToDelete) {
      alert("❌ Staff not found.");
      return;
    }
  
    if (!window.confirm(`Are you sure you want to delete staff: ${selectedStaff}?`)) {
      return;
    }
  
    fetch(`http://localhost:8080/api/staff/delete/${staffToDelete.staffId}`, {
      method: "DELETE",
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.text();
          alert("❌ Delete failed: " + err);
          return;
        }
  
        alert("🗑️ Staff deleted successfully!");
  
        setStaff(staff.filter((s) => s.staffId !== staffToDelete.staffId));
        setShowDeleteStaffPopup(false);
        setSelectedStaff("");
      })
      .catch((err) => {
        alert("🚨 Server Error");
        console.log(err);
      });
  };
  
  

  // --- Client ---
  const handleClientChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };


  const handleDeleteClient = () => {
    if (!selectedClient) return;
    if (window.confirm(`Are you sure you want to delete this client: ${selectedClient}?`)) {
      setShowDeleteClientPopup(false);
    }
  };

  const generateDriverData = async () => {
    const { firstName, lastName } = newDriver;
  
    if (!firstName || !lastName) {
      toast.warn("⚠️ Enter first & last name");
      return;
    }
  
    try {
      const url = `http://localhost:8080/api/drivers/add?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}`;
  
      const res = await fetch(url, { method: "POST" });
  
      if (!res.ok) {
        const errorMsg = await res.text();
        toast.error(errorMsg || "Failed to add driver.");
        return;
      }
  
      const driverCreated = await res.json();
  
      toast.success("🚀 Driver added successfully!");
  
      // Update UI
      setDrivers([...drivers, driverCreated]);
  
      // Close popup + reset
      setShowDriverPopup(false);
      setNewDriver({ firstName: "", lastName: "" });
  
    } catch (err) {
      console.error(err);
      toast.error("🚨 Server Error");
    }
  };

  const handleDeleteDriver = async () => {
    if (!selectedDriver) return;
  
    const unique = selectedDriver.trim();
  
    console.log("Selected:", `"${selectedDriver}"`);
    console.log("Trimmed:", `"${unique}"`);
    console.log("Available drivers:", drivers.map(d => `"${d.driverUnique}"`));
  
    // Find driver safely
    const driverToDelete = drivers.find(
      d => d.driverUnique.trim().toLowerCase() === unique.toLowerCase()
    );
  
    if (!driverToDelete) {
      toast.error("❌ Driver not found (value mismatch)");
      return;
    }
  
    if (!window.confirm(`Are you sure you want to remove driver: ${driverToDelete.driverUnique}?`)) {
      return;
    }
  
    try {
      const res = await fetch(
        `http://localhost:8080/api/drivers/delete/${encodeURIComponent(driverToDelete.driverUnique.trim())}`,
        { method: "DELETE" }
      );
  
      if (!res.ok) {
        const msg = await res.text();
        toast.error("❌ Delete failed: " + msg);
        return;
      }
  
      // Update UI safely
      setDrivers(
        drivers.filter(
          d => d.driverUnique.trim().toLowerCase() !== unique.toLowerCase()
        )
      );
  
      setSelectedDriver("");
      setShowDeleteDriverPopup(false);
  
      toast.success("🗑️ Driver removed");
  
    } catch (err) {
      console.error(err);
      toast.error("🚨 Server error");
    }
  };


  
  const approveCustomer = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/customers/approve/${id}`, {
        method: "POST"
      });
  
      if (!res.ok) {
        const err = await res.text();
        toast.error("❌ Approval failed: " + err);
        return;
      }
  
      const updated = await res.json();
  
      // update UI with backend value
      setCustomers(prev =>
        prev.map(c =>
          c.customerNumber === id ? updated : c
        )
      );
  
      toast.success("✅ Customer approved!");
    } catch (err) {
      console.error(err);
      toast.error("🚨 Server error");
    }
  };
  
  
  
  

  const handleChangePasswordClick = () => {
    setShowChangePassword(true);
    setPasswordSuccess(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const toggleDriverActive = async (driverUnique) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/drivers/toggle/${driverUnique}`,
        { method: "POST" }
      );
  
      if (!res.ok) {
        toast.error("Update failed");
        return;
      }
  
      const updated = await res.json();
  
      setDrivers(prev =>
        prev.map(d => (d.driverUnique === driverUnique ? updated : d))
      );
  
      toast.success("Driver updated!");
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };
  
  
  

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
  <div style={styles.left}>
    <img src={logo} alt="Logo" style={styles.logo} />
  </div>
  <div style={styles.center}>
    <h2 style={styles.title}>Admin Panel</h2>
  </div>
  <div style={styles.right}>
    {/* <button style={styles.logout} onClick={handleChangePasswordClick}>
      Change Password
    </button> */}
    <button style={styles.logout} onClick={handleLogout}>
      Logout
    </button>
    <span style={{ fontWeight: "bold", color: "#333" }}>👤 Admin </span>
    
  </div>
</header>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <button style={styles.actionBtn} onClick={() => handleAction("Add Staff")}>
          Add New Staff
        </button>

        <button style={styles.actionBtn} onClick={() => handleAction("Delete Staff")}>
          Delete Staff
        </button>
        <button style={styles.actionBtn} onClick={() => handleAction("Add Driver")}>
          Add Driver
        </button>
        <button style={styles.actionBtn} onClick={() => handleAction("Remove Driver")}>
          Remove Driver
        </button>
      </div>

      {/* Tables */}
      <div style={styles.tablesContainer}>
        {/* Staff */}
        <div style={styles.tableContainer}>
          <h3 style={styles.tableTitle}>Staff</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.tableHeader}>FirstName</th>
                <th style={styles.tableHeader}>LastName</th>
                <th style={styles.tableHeader}>UserName</th>
              </tr>
            </thead>
            <tbody>
  {staff.map((user) => (
    <tr key={user.staffId} style={styles.tableRow}>

      {/* ID */}
      <td style={styles.tableCell}>
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "600",
            color: "#fff",
            backgroundColor: user.active ? "#4caf50" : "#f44336",
          }}
        >
          {user.active ? "Active" : "Inactive"}
        </span>
      </td>

      {/* First Name */}
      <td style={styles.tableCell}>{user.firstName}</td>

      {/* Last Name */}
      <td style={styles.tableCell}>{user.lastName}</td>

      {/* Username */}
      <td style={styles.tableCell}>
        {user.loginCredential?.username}
      </td>

      {/* Active Status */}
    

    </tr>
  ))}
</tbody>
          </table>
        </div>

        {/* Customers
         Table */}
         


  

{/* ✅ Approval Popup */}
{showApprovalPopup && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <h3>✅ Client Approved</h3>
      <p>
        Email will be sent to <strong>{approvedClient?.number}</strong> with a
        unique Frequent Eater number.
      </p>
      <button
        style={styles.generateBtn}
        onClick={() => setShowApprovalPopup(false)}
      >
        OK
      </button>
    </div>
  </div>
)}


        {/* Drivers */}
        <div style={styles.tableContainer}>
          <h3 style={styles.tableTitle}>Drivers</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                  <th style={styles.tableHeader}>firstName</th>
                  <th style={styles.tableHeader}>lastName</th>
                  <th style={styles.tableHeader}>isActive</th>
                  <th style={styles.tableHeader}>changeStatus</th>
              </tr>
            </thead>
            <tbody>

  {drivers.map((driver) => (
  <tr key={driver.driverId} style={styles.tableRow}>

    <td style={styles.tableCell}>{driver.firstName}</td>
    <td style={styles.tableCell}>{driver.lastName}</td>

    {/* Status Label */}
    <td style={styles.tableCell}>
      <span
        style={{
          padding: "4px 8px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: "600",
          color: "#fff",
          backgroundColor: driver.active ? "#4caf50" : "#f44336",
        }}
      >
        {driver.active ? "Active" : "Inactive"}
      </span>
    </td>

    {/* Toggle Button */}
    <td style={styles.tableCell}>
      <button
        style={{
          ...styles.generateBtn,
          background: driver.active ? "#f44336" : "#4caf50",
        }}
        onClick={() => toggleDriverActive(driver.driverUnique)}
      >
        {driver.active ? "Deactivate" : "Activate"}
      </button>
    </td>

  </tr>
))}
</tbody>
          </table>
        </div>
      </div>


      <div style={styles.tableContainer}>
  <h3 style={styles.tableTitle}>Customers</h3>

  <table style={styles.table}>
    <thead>
      <tr>
        <th style={styles.tableHeader}>Full Name</th>
        <th style={styles.tableHeader}>Phone</th>
        <th style={styles.tableHeader}>Email</th>
        <th style={styles.tableHeader}>Delivery Address</th>
        <th style={styles.tableHeader}>Billing Address</th>
        <th style={styles.tableHeader}>Credit Card</th>
        <th style={styles.tableHeader}>Approve</th>
        <th style={styles.tableHeader}>Reward Code</th>
      </tr>
    </thead>

    <tbody>
      {customers.map((c) => (
        <tr key={c.customerNumber} style={styles.tableRow}>

          <td style={styles.tableCell}>
            {c.firstName} {c.lastName}
          </td>

          <td style={styles.tableCell}>{c.phoneNumber}</td>

          <td style={styles.tableCell}>{c.email}</td>

          {/* Delivery Address */}
          <td style={styles.tableCell}>
            {c.deliveryAddress
              ? `${c.deliveryAddress.buildingName} ${c.deliveryAddress.streetNumber}, ${c.deliveryAddress.city}, ${c.deliveryAddress.state} ${c.deliveryAddress.zipCode}`
              : "-"}
          </td>

          {/* Billing Address */}
          <td style={styles.tableCell}>
            {c.billingAddress
              ? `${c.billingAddress.buildingName} ${c.billingAddress.streetNumber}, ${c.billingAddress.city}, ${c.billingAddress.state} ${c.billingAddress.zipCode}`
              : "-"}
          </td>

          {/* Credit Card Masked */}
          <td style={styles.tableCell}>
            {c.creditCard
              ? `**** **** **** ${c.creditCard.cardNumber}`
              : "No Card"}
          </td>

          {/* Approval Toggle */}
          <td style={styles.tableCell}>
            <button
              style={{
                padding: "4px 8px",
                background: c.approved ? "#f44336" : "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => approveCustomer(c.customerNumber)}
            >
              {c.approved ? "Revoke" : "Approve"}
            </button>
          </td>

          {/* Reward Code */}
          <td style={styles.tableCell}>
            {c.rewardNumber ? <strong>{c.rewardNumber}</strong> : "-"}
          </td>

        </tr>
      ))}
    </tbody>
  </table>
</div>

      
            {/* Add Staff Popup */}
        {showStaffPopup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Add New Staff</h3>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={newStaff.firstName}
              onChange={handleStaffChange}
              style={styles.input}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={newStaff.lastName}
              onChange={handleStaffChange}
              style={styles.input}
            />
            <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={newStaff.email}
                onChange={handleStaffChange}
                style={styles.input}
            />


            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button style={styles.generateBtn} onClick={generateStaffCredentials}>
                Add
              </button>
              <button
                style={styles.closeBtn}
                onClick={() => setShowStaffPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

            {/* Staff Added Confirmation Popup */}
      {showStaffConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>✅ Staff Added Successfully</h3>
            <p><strong>Username:</strong> {lastCreatedStaff?.username}</p>
            <p><em>Password was generated internally and not shown here, and will send to your email.</em></p>
            <button
              style={styles.generateBtn}
              onClick={() => setShowStaffConfirm(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}


{showDeleteStaffPopup && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <h3>Delete Staff</h3>

      <select
  value={selectedStaff}
  onChange={(e) => setSelectedStaff(e.target.value)}
  style={styles.input}
>
  <option value="">-- Select Staff --</option>
  {staff.map((user) => (
    <option key={user.staffId} value={user.loginCredential.username}>
      {user.loginCredential.username}
    </option>
  ))}
</select>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button style={styles.generateBtn} onClick={handleDeleteStaff}>Yes</button>
        <button style={styles.closeBtn} onClick={() => setShowDeleteStaffPopup(false)}>No</button>
      </div>
    </div>
  </div>
)}
      


      {/* Add Driver Popup */}
{showDriverPopup && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <h3>Add New Driver</h3>
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={newDriver.firstName}
        onChange={handleDriverChange}
        style={styles.input}
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={newDriver.lastName}
        onChange={handleDriverChange}
        style={styles.input}
      />
      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button style={styles.generateBtn} onClick={generateDriverData}>
          Add
        </button>
        <button
          style={styles.closeBtn}
          onClick={() => setShowDriverPopup(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

   {/* ✅ Change Password Popup */}
{showChangePassword && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <h3>Change Password</h3>
      {passwordSuccess ? (
        <>
          <p style={{ color: "green" }}>✅ Password successfully changed!</p>
          <button
            style={styles.generateBtn}
            onClick={() => setShowChangePassword(false)}
          >
            Close
          </button>
        </>
      ) : (
        <form style={{ display: "flex", flexDirection: "column" }} onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            placeholder="Current Password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            style={styles.input}
          />
          {passwordErrors.currentPassword && <p style={{ color: "red" }}>{passwordErrors.currentPassword}</p>}
          
          <input
            type="password"
            placeholder="New Password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            style={styles.input}
          />
          {passwordErrors.newPassword && <p style={{ color: "red" }}>{passwordErrors.newPassword}</p>}
          
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            style={styles.input}
          />
          {passwordErrors.confirmPassword && <p style={{ color: "red" }}>{passwordErrors.confirmPassword}</p>}
          
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button type="submit" style={styles.generateBtn}>Update 🔒</button>
            <button type="button" style={styles.closeBtn} onClick={() => setShowChangePassword(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  </div>
)}









      {/* Delete Client Popup */}
      {showDeleteClientPopup && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Delete Client</h3>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              style={styles.input}
            >
              <option value="">-- Select Client --</option>
             
            </select>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button style={styles.generateBtn} onClick={handleDeleteClient}>Yes</button>
              <button style={styles.closeBtn} onClick={() => setShowDeleteClientPopup(false)}>No</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Driver Popup */}
      {showDeleteDriverPopup && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <h3>Remove Driver</h3>

      <select
        value={selectedDriver}
        onChange={(e) => setSelectedDriver(e.target.value)}
        style={styles.input}
      >
        <option value="">-- Select Driver --</option>

        {drivers.map((d) => (
          <option key={d.driverId} value={d.driverUnique}>
            {d.driverUnique.trim()}
          </option>
        ))}

      </select>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button style={styles.generateBtn} onClick={handleDeleteDriver}>Yes</button>
        <button style={styles.closeBtn} onClick={() => setShowDeleteDriverPopup(false)}>No</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#f9f9f9" },
  header: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    alignItems: "center",
    background: "#ff5722",
    color: "white",
    padding: "10px 20px",
  },
  left: { justifySelf: "start" },
  center: { justifySelf: "center" },

  right: { justifySelf: "end",  display: "flex",  gap: "10px" },

  logo: { width: "50px", height: "50px" },
  title: { margin: 0, fontSize: "22px", fontWeight: "bold" },
  logout: {
    background: "white",
    color: "#ff5722",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  toolbar: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    padding: "20px",
    background: "#fff",
  },
  actionBtn: {
    padding: "10px 15px",
    border: "1px solid #ff5722",
    background: "white",
    color: "#ff5722",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  tablesContainer: {
    display: "flex",
    justifyContent: "space-around",
    gap: "20px",
    padding: "20px",
    flexWrap: "wrap",
  },
  tableContainer: {
    flex: 1,
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    overflowX: "auto",
    padding: "15px",
    minWidth: "250px",
  },
  tableTitle: { marginBottom: "10px", textAlign: "center", color: "#ff5722" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableRow: { borderBottom: "1px solid black" },
  tableCell: { padding: "8px 12px" },
  tableHeader: {
    borderBottom: "2px solid black",
    textAlign: "left",
    padding: "8px 12px",
    background: "#f2f2f2",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "400px",
    textAlign: "center",
  },
  input: {
    width: "90%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  generateBtn: {
    background: "#ff5722",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  closeBtn: {
    background: "#ccc",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Dashboard;
