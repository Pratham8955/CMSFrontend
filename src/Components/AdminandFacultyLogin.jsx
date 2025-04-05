import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE_URL = "https://localhost:7133/api";

const AdminandFacultyLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/Register/loginFaculty`, formData,{withCredentials: true});
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
                localStorage.setItem("roleId", response.data.roleId);

        Swal.fire("Success", "Login successful!", "success");
        navigate(response.data.redirectUrl);
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.log(error)
            setError(error.response?.data?.message || "Login failed. Please try again.");
      Swal.fire("Error", "Invalid credentials!", "error");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <form onSubmit={handleSubmit} className="p-4 rounded shadow-sm border bg-white" style={{ width: "400px" }}>
        <h3 className="text-center mb-3 text-primary">Student Login</h3>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default AdminandFacultyLogin;