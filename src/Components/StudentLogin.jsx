import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/StudentLogin.css";
import studentImage from "../assets/LoginImg.png";
import logo from "../assets/logo.png";
import { API_BASE_URL } from "../config/api";

const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome back!",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate(response.data.redirectUrl || "/student/Studentdashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.data.message || "Invalid credentials",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Invalid email or password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="row g-0">
          {/* Left Illustration Column */}
          <div className="col-md-6 auth-illustration-col">
            <img
              src={studentImage}
              alt="Student Portal"
              className="auth-illustration-img"
            />
            <div className="text-center mt-3 d-none d-md-block">
              <h5 className="fw-bold text-primary mb-1">Campus Wave</h5>
              <p className="text-muted small mb-0">Student Academic & Learning Portal</p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="col-md-6 auth-form-col">
            <div className="auth-header">
              {logo && <img src={logo} alt="Campus Wave Logo" className="auth-logo" />}
              <h2 className="auth-title">
                <i className="bi bi-mortarboard-fill text-primary"></i> Student Login
              </h2>
              <p className="auth-subtitle">Sign in to access your courses, fees & materials</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="student-email">Email Address</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-envelope-at auth-input-icon"></i>
                  <input
                    id="student-email"
                    type="email"
                    name="email"
                    placeholder="student@campuswave.edu"
                    value={formData.email}
                    onChange={handleChange}
                    className="auth-input"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="auth-form-group">
                <label className="auth-label" htmlFor="student-password">Password</label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-shield-lock auth-input-icon"></i>
                  <input
                    id="student-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="auth-input pe-5"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}></i>
                  </button>
                </div>
              </div>

              {/* Forgot Password Row */}
              <div className="auth-action-row">
                <Link to="/studentForgetPassword" className="auth-forgot-link">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <i className="bi bi-arrow-right-short fs-5"></i>
                  </>
                )}
              </button>

              {/* Switch to Admin/Faculty & Back to Home */}
              <div className="auth-switch-box">
                <div>
                  Are you a faculty member or admin?
                  <Link to="/AdminandFacultyLogin" className="auth-switch-link">
                    Admin / Faculty Login
                  </Link>
                </div>
                <div className="mt-2">
                  <Link to="/" className="text-muted small text-decoration-none">
                    <i className="bi bi-arrow-left me-1"></i>Back to Home
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
