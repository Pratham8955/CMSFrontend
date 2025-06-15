// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  matchPath,
} from "react-router-dom";
import "./css/global.css";

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
import Admision from "./Components/Admin/Admision";
import SubjectManagement from "./Components/Admin/SubjectManagement";
import FeeStructureManagement from "./Components/Admin/FeeStructureManagement";
// Protected Route Wrapper
import ProtectedRoute from "./Components/ProtectedRoute";
import Unauthorize from "./Components/Unauthorize";
import Profile from "./Components/Student/Profile";
import StudentLayout from "./Components/Student/StudentLayout";
import Fees from "./Components/Student/Fees";
import FeePayment from "./Components/Student/FeePayment";
import StudentNotifications from "./Components/Student/StudentNotifications";
import FacultyLayout from "./Components/Faculty/FacultyLayout";
import FacultyProfile from "./Components/Faculty/FacultyProfile";
import AssignedSubjects from "./Components/Faculty/AssignedSubjects";
import ContentUpload from "./Components/Faculty/ContentUpload";
import StudentForgetPass from "./Components/StudentForgetPass";
import FacultyForgetPass from "./Components/FacultyForgetPass";
import Material from "./Components/Student/Material";
import FeeStatus from "./Components/Faculty/FeeStatus";
import Notifications from "./Components/Faculty/Notifications";
import Faculty from "./Components/Student/Faculty";

// AppWrapper handles conditional Navbar/Footer
const AppWrapper = () => {
  const location = useLocation();

  const hiddenRoutes = [
    "/student/Studentdashboard",
    "/student/profile",
    "/student/fees",
    "/student/payment",
    "/student/material",
    "/student/faculty",
    "/student/studentNotifications",
    "/faculty/facultydashboard",
    "/faculty/Fees-Status",
    "/faculty/profile",
    "/faculty/AssignedSubjects",
    "/faculty/ContentUpload",
    "/faculty/notification",
    "/admin/AdminDashboard",
    "/admin/departments",
    "/admin/faculties",
    "/admin/students",
    "/admin/faculty-assignment",
    "/studentForgetPassword",
    "/facultyForgetPassword",
    "/admin/admision/:studentId?",
    "/admin/subjectManagement",
    "/admin/feeStructureManagement",
  ];

  const shouldHideNavbar = hiddenRoutes.some((route) =>
    matchPath({ path: route, end: true }, location.pathname)
  );
  const shouldHideFooter = shouldHideNavbar;
  return (
    <>
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/studentForgetPassword" element={<StudentForgetPass />} />
        <Route path="/facultyForgetPassword" element={<FacultyForgetPass />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/aboutUs" element={<AboutUS />} />
        <Route path="/Login" element={<StudentLogin />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/unauthorized" element={<Unauthorize />} />
        <Route
          path="/AdminandFacultyLogin"
          element={<AdminandFacultyLogin />}
        />

        {/* Student Dashboard */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="3">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="profile" element={<Profile />} />
          <Route path="fees" element={<FeePayment />} />
          <Route path="payment" element={<Fees />} />
          <Route path="material" element={<Material />} />
          <Route path="faculty" element={<Faculty />} />
          <Route path="studentNotifications" element={<StudentNotifications />} />

          <Route path="Studentdashboard" element={<Studentdashboard />} />
        </Route>

        {/* Faculty Dashboard */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRole="2">
              <FacultyLayout />
            </ProtectedRoute>
          }
          facultydashboard
        >
          <Route path="profile" element={<FacultyProfile />} />
          <Route path="AssignedSubjects" element={<AssignedSubjects />} />
          <Route path="ContentUpload" element={<ContentUpload />} />
          <Route path="facultydashboard" element={<FacultyDashboard />} />
          <Route path="Fees-Status" element={<FeeStatus />} />
          <Route path="notification" element={<Notifications />} />
        </Route>

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
          <Route path="admision/:studentId?" element={<Admision />} />
          <Route path="subjectManagement" element={<SubjectManagement />} />
          <Route
            path="feeStructureManagement"
            element={<FeeStructureManagement />}
          />

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
