import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../css/StudentLogin.css";
import studentImage from "../assets/LoginImg.png";

const API_BASE_URL = "https://localhost:7133/api";

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
        <div className="loading-overlay">
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="row w-100 justify-content-center">
        <div className="col-lg-10 col-xl-8">
          <div className="row shadow rounded-4 overflow-hidden bg-white">
            <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light">
              <img src={studentImage} alt="Student" className="student-login-img" />
            </div>

            <div className="col-md-6 p-4 d-flex align-items-center justify-content-center">
              <form onSubmit={handleSubmit} className="student-login-form w-100">
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

                <div className="form-group mb-4 position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control student-login-input pe-5"
                    required
                  />
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"} position-absolute`}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#6c757d"
                    }}
                  ></i>
                </div>

                {/* Button and link on same row with 30px spacing */}
                <div className="d-flex align-items-center" style={{ width: "60%" }}>
                  <button type="submit" className="btn student-login-button" disabled={loading}>
                    {loading ? "Please wait..." : "Sign In"}
                  </button>

                  <a href="/studentForgetPassword" className="forgot-password-link">
                    Forgot password?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
