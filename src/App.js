import React from "react";
import Home from "./Components/Home";
// import AdminDashboard from "./Components/Admin/AdminDashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <div className="App">
      {/* <h1>Hello React</h1> */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/aboutUs" element={<AboutUS />} />
          <Route path="/Login" element={<StudentLogin />} />
          <Route path="/register" element={<Registration />} />
          <Route
            path="/student/Studentdashboard"
            element={<Studentdashboard />}
          />
          <Route
            path="/faculty/facultydashboard"
            element={<FacultyDashboard />}
          />
          <Route path="/admin/admindashboard" element={<AdminDashboard />} />

          <Route
            path="/AdminandFacultyLogin"
            element={<AdminandFacultyLogin />}
          />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
