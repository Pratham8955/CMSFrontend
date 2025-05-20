import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://localhost:7133/api";
const STATE_API_URL = "https://api.countrystatecity.in/v1/countries/IN/states";
const CITY_API_URL = "https://api.countrystatecity.in/v1/countries/IN/states";
const API_KEY = "T29vSlpCbVFpd1FsN3hoOURUVHFkTXkzZnJjT2VpMzBkWTdTYWljbA==";

const Admision = () => {
  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    dob: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    phone: "",
    deptId: "",
    currentSemester: "",
    image: null,
    tenthPassingYear: "",
    tenthPercentage: "",
    tenthmarksheet: null,
    twelfthSchool: "",
    tewelfthPassingYear: "",
    tewelfthPercentage: "",
    tewelfthMarksheet: null,
    tenthSchool: ""
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch States
        const stateRes = await axios.get(STATE_API_URL, {
          headers: { "X-CSCAPI-KEY": API_KEY },
        });
        setStates(stateRes.data);

        // Fetch Departments
        const deptRes = await axios.get(`${API_BASE_URL}/Department/GetDepartment`);
        if (deptRes.data.success) {
          setDepartments(deptRes.data.department || deptRes.data.Department);
        }

        // Fetch Semesters
        const semRes = await axios.get(`${API_BASE_URL}/CommonApi/GetSemester`);
        if (semRes.data.success) {
          setSemesters(semRes.data.semester || semRes.data.Semester);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // When State changes, fetch cities and update state
  const handleStateChange = async (event) => {
    const stateCode = event.target.value;
    setSelectedState(stateCode);
    setFormData((prevData) => ({ ...prevData, state: stateCode }));
    setSelectedCity("");
    setCities([]); // clear previous cities

    if (!stateCode) return;

    try {
      const response = await axios.get(`${CITY_API_URL}/${stateCode}/cities`, {
        headers: { "X-CSCAPI-KEY": API_KEY },
      });
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    }
  };

  // Handle other form changes, including city select updating selectedCity state
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (["image", "tenthmarksheet", "tewelfthMarksheet"].includes(name)) {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, [name]: file });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "city") {
      setSelectedCity(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        formDataToSubmit.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/Register/register-student`, formDataToSubmit, {
        headers: { "Content-Type": "multipart/form-data" },
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
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", background: "linear-gradient(to right, #f8f9fa, #e3f2fd)" }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-4 rounded shadow-sm border bg-white"
        style={{ width: "600px" }}
      >
        <h3 className="text-center mb-4 text-primary">🎓Student Registration</h3>

        {/* Student Name and Phone */}
        <div className="row mb-3">
          <div className="col">
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
          <div className="col">
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
        </div>

        {/* Email */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>

        {/* DOB and Gender */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="form-control"
              required
              max={maxDob}
            />
          </div>
          <div className="col">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="mb-3">
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

        {/* State Dropdown */}
        <div className="mb-3">
          <label className="form-label">State</label>
          <select
            name="state"
            value={selectedState}
            onChange={handleStateChange}
            className="form-control"
            required
          >
            <option value="">Select State</option>
            {Array.isArray(states) &&
              states.map((state) => (
                <option key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </option>
              ))}
          </select>
        </div>

        {/* City Dropdown */}
        <div className="mb-3">
          <label className="form-label">City</label>
          <select
            name="city"
            value={selectedCity}
            onChange={handleChange}
            className="form-control"
            required
            disabled={!selectedState}
          >
            <option value="">Select City</option>
            {Array.isArray(cities) &&
              cities.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
          </select>
        </div>

        {/* Department Dropdown */}
        <div className="mb-3">
          <label className="form-label">Department</label>
          <select
            name="deptId"
            value={formData.deptId}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Department</option>
            {Array.isArray(departments) &&
              departments.map((dept) => (
                <option key={dept.deptId} value={dept.deptId}>
                  {dept.deptName}
                </option>
              ))}
          </select>
        </div>

        {/* Semester Dropdown */}
        <div className="mb-3">
          <label className="form-label">Semester</label>
          <select
            name="currentSemester"
            value={formData.currentSemester}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select Semester</option>
            {Array.isArray(semesters) &&
              semesters.map((sem) => (
                <option key={sem.semId} value={sem.semId}>
                  {sem.semName}
                </option>
              ))}
          </select>
        </div>

        {/* 10th Details */}
        <h5>10th Details</h5>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              name="tenthSchool"
              value={formData.tenthSchool}
              onChange={handleChange}
              className="form-control"
              placeholder="10th School"
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="tenthPassingYear"
              value={formData.tenthPassingYear}
              onChange={handleChange}
              className="form-control"
              placeholder="10th Passing Year"
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="tenthPercentage"
              value={formData.tenthPercentage}
              onChange={handleChange}
              className="form-control"
              placeholder="10th %%"
            />
          </div>
          <div className="col">
            <input
              type="file"
              name="tenthmarksheet"
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* 12th Details */}
        <h5>12th Details</h5>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              name="twelfthSchool"
              value={formData.twelfthSchool}
              onChange={handleChange}
              className="form-control"
              placeholder="12th School"
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="tewelfthPassingYear"
              value={formData.tewelfthPassingYear}
              onChange={handleChange}
              className="form-control"
              placeholder="12th Passing Year"
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="tewelfthPercentage"
              value={formData.tewelfthPercentage}
              onChange={handleChange}
              className="form-control"
              placeholder="12th %%"
            />
          </div>
          <div className="col">
            <input
              type="file"
              name="tewelfthMarksheet"
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* Profile Image */}
        <div className="mb-3">
          <label className="form-label">Profile Image</label>
          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-success w-100 mt-3">
          Register
        </button>
      </form>
    </div>
  );
};

export default Admision;
