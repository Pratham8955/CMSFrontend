// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Home from "./Components/Home";
import AdminandFacultyLogin from "./Components/AdminandFacultyLogin";
import StudentLogin from "./Components/StudentLogin";
import Registration from "./Components/Registration";
import Navbar from "./Components/Navbar";
import Courses from "./Components/Courses";
import Contact from "./Components/Contact";
import AboutUS from "./Components/AboutUS";
import Studentdashboard from "./Components/Student/Studentdashboard";
import FacultyDashboard from "./Components/Faculty/FacultyDashboard";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import Footer from "./Components/Footer";
import ProtectedRoute from "./Components/ProtectedRoute";

const AppWrapper = () => {
  const location = useLocation();

  const hideNavbarRoutes = [
    "/student/Studentdashboard",
    "/faculty/facultydashboard",
    "/admin/admindashboard"
  ];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/aboutUs" element={<AboutUS />} />
        <Route path="/Login" element={<StudentLogin />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/AdminandFacultyLogin" element={<AdminandFacultyLogin />} />

        {/* ✅ Protected dashboards */}
        <Route
          path="/student/Studentdashboard"
          element={
            <ProtectedRoute allowedRole="3">
              <Studentdashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/facultydashboard"
          element={
            <ProtectedRoute allowedRole="2">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/admindashboard"
          element={
            <ProtectedRoute allowedRole="1">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
