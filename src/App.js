// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './css/global.css';

// Public Components
import Home from "./Components/Home";
import AdminandFacultyLogin from "./Components/AdminandFacultyLogin";
import StudentLogin from "./Components/StudentLogin";
import Registration from "./Components/Registration";
import Navbar from "./Components/Navbar";
import Courses from "./Components/Courses";
import Contact from "./Components/Contact";
import AboutUS from "./Components/AboutUS";
import Footer from "./Components/Footer";

// Dashboards
import Studentdashboard from "./Components/Student/Studentdashboard";
import FacultyDashboard from "./Components/Faculty/FacultyDashboard";
import AdminDashboard from "./Components/Admin/AdminDashboard";

// Admin Sub Pages
import AdminDepartments from "./Components/Admin/AdminDepartments";
import AdminFaculties from "./Components/Admin/AdminFaculties";
import AdminStudents from "./Components/Admin/AdminStudents";
import AdminLayout from "./Components/Admin/AdminLayout";
import FacultyAssignment from "./Components/Admin/FacultyAssignment";

// Protected Route Wrapper
import ProtectedRoute from "./Components/ProtectedRoute";

// AppWrapper handles conditional Navbar/Footer
const AppWrapper = () => {
  const location = useLocation();

  const hiddenRoutes = [
    "/student/Studentdashboard",
    "/faculty/facultydashboard",
    "/admin/AdminDashboard",
    "/admin/departments",
    "/admin/faculties",
    "/admin/students",
    "/admin/faculty-assignment",
   
  ];

  const shouldHideNavbar = hiddenRoutes.includes(location.pathname);
  const shouldHideFooter = hiddenRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/aboutUs" element={<AboutUS />} />
        <Route path="/Login" element={<StudentLogin />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/AdminandFacultyLogin" element={<AdminandFacultyLogin />} />

        {/* Student Dashboard */}
        <Route
          path="/student/Studentdashboard"
          element={
            <ProtectedRoute allowedRole="3">
              <Studentdashboard />
            </ProtectedRoute>
          }
        />

        {/* Faculty Dashboard */}
        <Route
          path="/faculty/facultydashboard"
          element={
            <ProtectedRoute allowedRole="2">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Layout with Nested Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="1">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="AdminDashboard" element={<AdminDashboard />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="faculties" element={<AdminFaculties />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="faculty-assignment" element={<FacultyAssignment />} />
        </Route>
      </Routes>

      {!shouldHideFooter && <Footer />}
    </>
  );
};

// Main App component
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
