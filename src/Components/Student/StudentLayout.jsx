import React, { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  FaUserGraduate,
  FaSignOutAlt,
  FaBars,
  FaTachometerAlt,
  FaMoneyBillAlt,
  FaBookOpen,
  FaBell
} from "react-icons/fa";
import Swal from "sweetalert2";
import { BsPersonBadge } from "react-icons/bs";
import "../../css/Faculty/FacultyLayout.css"; // Reuse same layout CSS
import logo from "../../assets/logo.png"; // Replace with your actual logo filename

const StudentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/login");
        Swal.fire("Logged out!", "You have been logged out.", "success");
      }
    });
  };

  const menuItems = [
    { label: "Dashboard", icon: FaTachometerAlt, path: "/student/Studentdashboard" },
    { label: "Profile", icon: FaUserGraduate, path: "/student/profile" },
    { label: "Fees", icon: FaMoneyBillAlt, path: "/student/fees" },
    { label: "Materials", icon: FaBookOpen, path: "/student/material" },
    { label: "Notifications", icon: FaBell, path: "/student/studentNotifications" },
    { label: "Faculties", icon: BsPersonBadge, path: "/student/faculty" },
  ];

  return (
    <div className="d-flex admin-layout">
      {/* Sidebar */}
      <nav className={`sidebar d-flex flex-column ${isSidebarOpen ? "open" : "collapsed"}`}>
        <div className="logo-area d-flex align-items-center justify-content-between px-3 py-2">
          {isSidebarOpen && (
            <div className="faculty-logo-wrapper d-flex align-items-center">
              <img
                src={logo}
                alt="Faculty Logo"
                className="faculty-logo"
              />
              <h5 className="text-white mb-0 ms-2">Student Panel</h5>
            </div>
          )}
          <button
            className="btn btn-link text-white p-0 toggle-btn"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <FaBars size={24} />
          </button>
        </div>

        <ul className="nav flex-column px-2 mt-3">
          {menuItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <li
                key={idx}
                className={`nav-item mb-1 rounded ${location.pathname === item.path ? "active-link" : ""}`}
                onClick={() => navigate(item.path)}
                title={isSidebarOpen ? "" : item.label}
              >
                <button className=" nav-btn d-flex align-items-center w-100 text-start text-white">
                  <span className="me-3 icon fs-5">
                    <IconComponent />
                  </span>
                  {isSidebarOpen && <span className="flex-grow-1">{item.label}</span>}
                </button>
              </li>
            );
          })}

          <li
            className="nav-item mt-auto mb-3 rounded logout-btn"
            onClick={handleLogout}
            title={isSidebarOpen ? "" : "Logout"}
          >
            <button className="btn nav-btn d-flex align-items-center w-100 text-start text-danger fw-semibold">
              <span className="me-3 icon fs-5">
                <FaSignOutAlt />
              </span>
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-grow-1 p-4 bg-light min-vh-100">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
