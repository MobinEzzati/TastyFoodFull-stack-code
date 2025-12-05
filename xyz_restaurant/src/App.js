import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RestaurantHome from "./Views/RestaurantHome";  
import AdminLogin from "./Views/AdminLogin";
import Dashboard from "./Views/Dashboard";
import StaffLogin from "./Views/StaffLogin";
import StaffPanel from "./Views/StaffPanel";
import CustomerLogin from "./Views/CustomerLogin";
import CustomerRegister from "./Views/CustomerRegister";
import ChangePassword from "./Views/ChangePassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RestaurantHome />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/staff" element={<StaffLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />   
        <Route path="/staffpanel" element={<StaffPanel />} /> 
        <Route path="/customerlogin" element={<CustomerLogin />} />
        <Route path="/customerregister" element={<CustomerRegister />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/restaurantHome" element={<RestaurantHome />} />
      </Routes>

      {/* Toast container must be outside the Routes */}
      <ToastContainer position="top-center" autoClose={2500} />
    </>
  );
}

export default function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
