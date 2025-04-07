import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Registrationimg from "../assets/Registrationimg.png";

const API_BASE_URL = "http://localhost:5291/api";
const STATE_API_URL = "https://api.countrystatecity.in/v1/countries/IN/states";
const CITY_API_URL = "https://api.countrystatecity.in/v1/countries/IN/states";
const API_KEY = "T29vSlpCbVFpd1FsN3hoOURUVHFkTXkzZnJjT2VpMzBkWTdTYWljbA==";

const Registration = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    deptId: "",
    currentSemester: "",
  });

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [departments, setDepartments] = useState([]);
  const [semesters, setsemesters] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(STATE_API_URL, {
          headers: { "X-CSCAPI-KEY": API_KEY },
        });
        setStates(response.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  const handleStateChange = async (event) => {
    const stateCode = event.target.value;
    setSelectedState(stateCode);
    setFormData((prevData) => ({ ...prevData, state: stateCode }));
    setSelectedCity("");

    try {
      const response = await axios.get(`${CITY_API_URL}/${stateCode}/cities`, {
        headers: { "X-CSCAPI-KEY": API_KEY },
      });
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Department/GetDepartment`);
        if (response.data.success) {
          setDepartments(response.data.department);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/CommonApi/GetSemester`);
        if (response.data.success) {
          setsemesters(response.data.semester);
        }
      } catch (error) {
        console.error("Error fetching semesters:", error);
      }
    };
    fetchSemesters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,}$/;
    return regex.test(password);
  };

  const sendOtp = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Register/send-otp`, { email: formData.email }, { withCredentials: true });
      if (response.data.success) {
        setIsOtpSent(true);
        Swal.fire("Success", response.data.message, "success");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Failed to send OTP!", "error");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Register/verify-otp`, { email: formData.email, otp }, { withCredentials: true });
      if (response.data.success) {
        setIsOtpVerified(true);
        setIsOtpSent(false);
        Swal.fire("Success", response.data.message, "success");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Invalid or expired OTP!", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      Swal.fire("Error", "Please verify OTP before registering!", "error");
      return;
    }

    if (!validatePassword(formData.password)) {
      Swal.fire("Error", "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.", "error");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/Register/register-student`, {
        ...formData,
        groupId: 3,
      });

      if (response.data.success) {
        Swal.fire("Success", response.data.message, "success").then(() => {
          navigate("/Login");
        });
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Registration failed!", "error");
    }
  };

  const maxDob = new Date(new Date().setFullYear(new Date().getFullYear() - 17)).toISOString().split("T")[0];

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "linear-gradient(to right, #f8f9fa, #e3f2fd)" }}>
      <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
        <img src={Registrationimg} alt="Student" className="student-login-img" />
      </div>

      <form onSubmit={handleSubmit} className="p-4 rounded shadow-sm border bg-white" style={{ width: "600px" }}>
        <h3 className="text-center mb-4 text-primary">🎓Student Registration</h3>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Student Name</label>
            <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} className="form-control" placeholder="Enter your full name" required />
          </div>
          <div className="col">
            <label className="form-label">Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control" placeholder="Enter your phone number" required />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Enter your email address" required disabled={isOtpSent || isOtpVerified} />
          </div>
          <div className="col">
            <label className="form-label">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" placeholder="Create a strong password" required />
          </div>
        </div>

        {isOtpSent && !isOtpVerified && (
          <div className="mb-3">
            <label className="form-label">Enter OTP</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="form-control" placeholder="Enter OTP sent to your email" required />
            <button type="button" className="btn btn-primary w-100 mt-2" onClick={verifyOtp}>Verify OTP</button>
          </div>
        )}

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="form-control" required max={maxDob} />
          </div>
          <div className="col">
            <label className="form-label">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="form-control" required>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" placeholder="Enter your address" required />
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">State</label>
            <select className="form-control" value={selectedState} onChange={handleStateChange} required>
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.iso2} value={state.iso2}>{state.name}</option>
              ))}
            </select>
          </div>
          <div className="col">
            <label className="form-label">City</label>
            <select className="form-control" value={selectedCity} onChange={(e) => {
              setSelectedCity(e.target.value);
              setFormData((prevData) => ({ ...prevData, city: e.target.value }));
            }} required disabled={!selectedState}>
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>{city.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Department</label>
            <select name="deptId" value={formData.deptId} onChange={handleChange} className="form-control" required>
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.deptId} value={dept.deptId}>{dept.deptName}</option>
              ))}
            </select>
          </div>
          <div className="col">
            <label className="form-label">Current Semester</label>
            <select name="currentSemester" value={formData.currentSemester} onChange={handleChange} className="form-control" required>
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem.semId} value={sem.semId}>{sem.semName}</option>
              ))}
            </select>
          </div>
        </div>

        {!isOtpSent && !isOtpVerified && (
          <button type="button" className="btn btn-outline-primary w-100 mb-2" onClick={sendOtp}>Send OTP</button>
        )}

        {isOtpVerified && (
          <button type="submit" className="btn btn-success w-100">Register</button>
        )}
      </form>
    </div>
  );
};

export default Registration;