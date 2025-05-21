import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/StudentLogin.css";
import studentImage from "../assets/LoginImg.png";

const API_BASE_URL = "https://localhost:7133/api";

const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/Register/loginStudent`, formData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("roleId", response.data.roleId);
        Swal.fire("Success", "Login successful!", "success");
        navigate(response.data.redirectUrl);
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Invalid credentials!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center position-relative student-login-container">
      {loading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75 z-3">
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="row w-100">
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
          <img src={studentImage} alt="Student" className="student-login-img" />
        </div>

        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <form onSubmit={handleSubmit} className="student-login-form w-75">
            <h2 className="text-center mb-4 text-primary fw-bold">🎓 Student Login</h2>

            <div className="form-group mb-3">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="form-control student-login-input"
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
                className="form-control student-login-input"
                required
              />
            </div>

            <button type="submit" className="student-login-button" disabled={loading}>
              {loading ? "Please wait..." : "Sign In"}
            </button>

            <div className="student-login-links mt-3 d-flex justify-content-between">
              <a href="/studentForgetPassword">Forgot password?</a>
              
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
