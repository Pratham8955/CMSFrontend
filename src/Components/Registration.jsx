import React, { useState ,useEffect} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate} from "react-router-dom";

const API_BASE_URL = "https://localhost:7133/api"; 
const STATE_API_URL = "https://api.countrystatecity.in/v1/countries/IN/states";
const CITY_API_URL = "https://api.countrystatecity.in/v1/countries/IN/states";
const API_KEY = "T29vSlpCbVFpd1FsN3hoOURUVHFkTXkzZnJjT2VpMzBkWTdTYWljbA=="; // Replace with your API key

const Registration = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    address:"",
    city:"",
    state:"",
    phone:"",
    deptId:"",
    currentSemester:"",
  });

  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");


 //States Api Call Online
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
  
    // Update formData with selected state
    setFormData((prevData) => ({
      ...prevData,
      state: stateCode,
    }));
  
    setSelectedCity(""); // Reset city selection when state changes
    try {
      const response = await axios.get(`${CITY_API_URL}/${stateCode}/cities`, {
        headers: { "X-CSCAPI-KEY": API_KEY },
      });
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  
//Fetch Department
const [departments, setDepartments] = useState([]);

useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const response = await axios.get("https://localhost:7133/api/Admin/GetDepartment");

      if (response.data.success) {
        setDepartments(response.data.department); // Use "department" instead of "Department"
      } else {
        console.error("Failed to fetch departments:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  fetchDepartments();
}, []);


//FetchSemester
const [semesters, setsemesters] = useState([]);

useEffect(() => {
  const fetchSemesters = async () => {
    try {
      const response = await axios.get("https://localhost:7133/api/Admin/GetSemester");

      if (response.data.success) {
        setsemesters(response.data.semsester); 
      } else {
        console.error("Failed to fetch departments:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  fetchSemesters();
}, []);


  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send OTP API Call
  const sendOtp = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Register/send-otp`, 
        { email: formData.email }, 
        { withCredentials: true }  // ✅ Ensure cookies are sent
      );
  
      if (response.data.success) {
        setIsOtpSent(true);
        Swal.fire("Success", response.data.message, "success");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to send OTP!", "error");
    }
  };
  
  //Verify-otp
  const verifyOtp = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Register/verify-otp`, 
        { email: formData.email, otp: otp }, 
        { withCredentials: true }  // ✅ Ensure cookies are sent
      );
  
      if (response.data.success) {
        setIsOtpVerified(true);
        setIsOtpSent(false);
        Swal.fire("Success", response.data.message, "success");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Invalid or expired OTP!", "error");
    }
  };
  

  // Register User API Call
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isOtpVerified) {
      Swal.fire("Error", "Please verify OTP before registering!", "error");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/Register/register-student`, {
        studentName:formData.studentName,
        email: formData.email,
        password:formData.password,
        dob:formData.dob,
        gender:formData.gender,
        address:formData.address,
        city:formData.city,
        state:formData.state,
        phone:formData.phone,
        deptId:formData.deptId,
        currentSemester:formData.currentSemester,
        groupId: 3,
      });

      if (response.data.success) {
        Swal.fire("Success",response.data.message, "success").then(() => {
          navigate("/Login"); // Redirect to login page
        });
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Registration failed!", "error");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-4 rounded shadow-sm border bg-white"
        style={{
          width: "400px",
          border: "1px solid #ddd",
        }}
      >
        <h3 className="text-center mb-3 text-primary">
          Student Registration
        </h3>
  
        {/* Username */}
        <div className="mb-2">
          <label className="form-label">Student Name</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
  
        {/* Email */}
        <div className="mb-2">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
            required
            disabled={isOtpSent || isOtpVerified}
          />
        </div>
  
        {/* OTP Field */}
        {isOtpSent && !isOtpVerified && (
          <div className="mb-2">
            <label className="form-label">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="form-control"
              required
            />
            <button type="button" className="btn btn-primary w-100 mt-2" onClick={verifyOtp}>
              Verify OTP
            </button>
          </div>
        )}
  
        {/* Password */}
        <div className="mb-2">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
  
        {/* Date of Birth */}
        <div className="mb-2">
          <label className="form-label">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
  
        {/* Gender */}
        <div className="mb-2">
          <label className="form-label">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
  
        {/* Address */}
        <div className="mb-2">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
  
        <div className="mb-2">
          <label className="form-label">State</label>
          <select className="form-control" value={selectedState} onChange={handleStateChange} required>
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.iso2} value={state.iso2}>{state.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="form-label">City</label>
          <select
  className="form-control"
  value={selectedCity}
  onChange={(e) => {
    setSelectedCity(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      city: e.target.value,
    }));
  }}
  required
  disabled={!selectedState}
>
  <option value="">Select City</option>
  {cities.map((city) => (
    <option key={city.id} value={city.name}>{city.name}</option>
  ))}
</select>

        </div>
  
        
  
        {/* Phone */}
        <div className="mb-2">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
  
        {/* Department ID */}
        <div className="mb-2">
  <label className="form-label">Department Name</label>
  <select
    name="deptId"
    value={formData.deptId}
    onChange={handleChange}
    className="form-control"
    required
  >
    <option value="">Select Department</option>
    {departments.map((dept) => (
      <option key={dept.deptId} value={dept.deptId}>
        {dept.deptName}
      </option>
    ))}
  </select>
</div>



  
        {/* Current Semester Dropdown */}
<div className="mb-2">
  <label className="form-label">Current Semester</label>
  <select
    name="currentSemester"
    value={formData.currentSemester}
    onChange={handleChange}
    className="form-control"
    required
  >
    <option value="">Select Semester</option>
    {semesters.map((semester) => (
      <option key={semester.semId} value={semester.semId}>
        {semester.semName}
      </option>
    ))}
  </select>
</div>

  
        {/* Send OTP Button */}
        {!isOtpSent && !isOtpVerified && (
          <button type="button" className="btn btn-outline-primary w-100 mb-2" onClick={sendOtp}>
            Send OTP
          </button>
        )}
  
        {/* Register Button (Appears Only After OTP Verification) */}
        {isOtpVerified && (
          <button type="submit" className="btn btn-success w-100">
            Register
              </button>
        )}
      </form>
    </div>
  );
  
};

export default Registration;
