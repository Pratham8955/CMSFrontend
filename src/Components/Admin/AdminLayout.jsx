import React, { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import "../../css/Admin/AdminLayout.css";
import 'sweetalert2/dist/sweetalert2.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import logo from "../../assets/logo.png";
const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from the Admin Panel.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log me out",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate("/AdminandFacultyLogin");
      }
    });
  };

  const menuItems = [
    { label: "Dashboard", icon: <i className="bi bi-speedometer2"></i>, path: "/admin/AdminDashboard" },
    { label: "Departments", icon: <i className="bi bi-building"></i>, path: "/admin/departments" },
    { label: "Faculties", icon: <i className="bi bi-person-badge"></i>, path: "/admin/faculties" },
    { label: "Students", icon: <i className="bi bi-mortarboard"></i>, path: "/admin/students" },
    { label: "Admission", icon: <i className="bi bi-person-plus-fill"></i>, path: "/admin/admision" },
    { label: "Subject", icon: <i className="bi bi-book"></i>, path: "/admin/subjectManagement" },
    { label: "FeeStructure", icon: <i className="bi bi-currency-rupee"></i>, path: "/admin/feeStructureManagement" },
    { label: "Faculty Assignment", icon: <i className="bi bi-journal-bookmark"></i>, path: "/admin/faculty-assignment" },
    { label: "Feedback", icon: <i className="bi bi-chat-dots"></i>, path: "/admin/feedback" },

  ];

  return (
    <div className="d-flex admin-layout">
      {/* Sidebar */}
      <nav className={`sidebar d-flex flex-column ${isSidebarOpen ? "open" : "collapsed"}`}>
        <div className="logo-area d-flex align-items-center justify-content-between px-3 py-2">
          {isSidebarOpen && (
            <div className="admin-logo-wrapper d-flex align-items-center">
              <img
                src={logo}
                alt="Admin Logo"
                className="admin-logo"
              />
              <h5 className="text-white mb-0 ms-2">Admin Panel</h5>
            </div>
          )}
          <button
            className="btn btn-link text-white p-0 toggle-btn"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <i className="bi bi-list fs-4"></i>
          </button>
        </div>

        <ul className="nav flex-column px-2 mt-3">
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              className={`nav-item rounded ${location.pathname === item.path ? "active-link" : ""}`}
              onClick={() => navigate(item.path)}
              title={isSidebarOpen ? "" : item.label}
            >
              <button className="nav-btn d-flex align-items-center w-100 text-start text-white">
                <span className="me-3 icon fs-5">{item.icon}</span>
                {isSidebarOpen && <span className="flex-grow-1">{item.label}</span>}
              </button>
            </li>
          ))}

          <li
            className="nav-item mt-auto mb-3 rounded logout-btn"
            onClick={handleLogout}
            title={isSidebarOpen ? "" : "Logout"}
          >
            <button className="btn nav-btn d-flex align-items-center w-100 text-start text-danger fw-semibold p-3">
              <span className="me-3 icon fs-5"><i className="bi bi-box-arrow-right"></i></span>
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

export default AdminLayout;
