import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/AdminandFacultyLogin.css";
import facultyImage from "../assets/facultylogin.png";

const API_BASE_URL = "https://localhost:7133/api";

const AdminandFacultyLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    try {
      const response = await axios.post(`${API_BASE_URL}/Register/loginFaculty`, formData);
      if (response.data.success) {
        const { token, roleId } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("roleId", roleId);

        Swal.fire("Success", "Login successful!", "success");

        // Redirect based on roleId
        if (roleId === 1) {
          navigate("../admin/AdminDashboard");
        } else if (roleId === 2) {
          navigate("../Faculty/FacultyDashboard");
        }
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Invalid credentials!", "error");
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center admin-faculty-login-container position-relative">
      {loading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75 z-3">
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="row w-100">
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
          <img src={facultyImage} alt="Faculty" className="admin-faculty-login-img" />
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <form onSubmit={handleSubmit} className="admin-faculty-login-form w-75">
            <h2 className="text-center mb-4 text-primary fw-bold">👨‍🏫 Admin / Faculty Login</h2>

            <div className="form-group mb-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="form-control admin-faculty-login-input"
                required
              />
            </div>

            <div className="form-group mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="form-control admin-faculty-login-input"
                required
              />
            </div>

            <button type="submit" className="admin-faculty-login-button" disabled={loading}>
              {loading ? "Please wait..." : "Sign In"}
            </button>

            <div className="admin-faculty-login-links mt-3 d-flex justify-content-between">
           
             
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminandFacultyLogin;
