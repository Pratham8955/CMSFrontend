import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Stateandcity from "../Admin/Stateandcity.json";
import "../../css/Admin/Admision.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://localhost:7133/api";

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
    StudentImg: null,
    tenthPassingYear: "",
    tenthPercentage: "",
    tenthmarksheet: null,
    twelfthSchool: "",
    twelfthPassingYear: "",
    twelfthPercentage: "",
    twelfthMarksheet: null,
    tenthSchool: ""
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false); // Loader state
  const navigate = useNavigate();

  useEffect(() => {
    // Load states from static JSON
    setStates(Object.keys(Stateandcity));

    const fetchInitialData = async () => {
      try {
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

  const handleStateChange = (event) => {
    const state = event.target.value;
    setSelectedState(state);
    setFormData((prevData) => ({ ...prevData, state }));

    if (state) {
      setCities(Stateandcity[state] || []);
    } else {
      setCities([]);
    }

    setSelectedCity("");
    setFormData((prevData) => ({ ...prevData, city: "" }));
  };

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    setFormData((prevData) => ({ ...prevData, city }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "phone") {
      if (/^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (["StudentImg", "tenthmarksheet", "twelfthMarksheet"].includes(name)) {
      if (files && files[0]) {
        setFormData({ ...formData, [name]: files[0] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader on submit

    const formDataToSubmit = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        formDataToSubmit.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/Register/register-student`,
        formDataToSubmit,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        Swal.fire("Success", response.data.message, "success").then(() => {
          // Optionally reset form or redirect here
          setFormData({
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
            StudentImg: null,
            tenthPassingYear: "",
            tenthPercentage: "",
            tenthmarksheet: null,
            twelfthSchool: "",
            twelfthPassingYear: "",
            twelfthPercentage: "",
            twelfthMarksheet: null,
            tenthSchool: ""
          });
          setSelectedState("");
          setSelectedCity("");
          setCities([]);
        });
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Registration failed!", "error");
    } finally {
      setLoading(false); // Hide loader after submit completes
    }
  };

  const maxDob = new Date(new Date().setFullYear(new Date().getFullYear() - 17))
    .toISOString()
    .split("T")[0];

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "10vh", background: "linear-gradient(to right, #f8f9fa, #e3f2fd)" }}
    >
      {loading && (
  <div className="admission-loader-overlay">
    <div className="admission-loader"></div>
  </div>
)}

      <form
        onSubmit={handleSubmit}
        className="p-4 rounded shadow-sm border bg-white"
        style={{ width: "1100px" }}
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
              maxLength={10}
            />
          </div>
        </div>

        {/* Email and student image */}
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
          <div className="col">
            <label className="form-label">Student Image</label>
            <input
              type="file"
              name="StudentImg"
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

        <div className="row mb-3">
          <div className="col">
            <label className="form-label">State</label>
            <select
              name="state"
              value={selectedState}
              onChange={handleStateChange}
              className="form-control"
              required
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <label className="form-label">City</label>
            <select
              name="city"
              value={selectedCity}
              onChange={handleCityChange}
              className="form-control"
              required
              disabled={!selectedState}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Department Dropdown */}
        <div className="row mb-3">
          <div className="col">
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
          <div className="col">
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
        </div>

        {/* 10th Details */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">10th School</label>
            <input
              type="text"
              name="tenthSchool"
              value={formData.tenthSchool}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col">
            <label className="form-label">10th Passing Year</label>
            <input
              type="text"
              name="tenthPassingYear"
              value={formData.tenthPassingYear}
              onChange={handleChange}
              className="form-control"
              maxLength={4}
              pattern="\d{4}"
              title="Enter 4 digit year"
            />
          </div>
          <div className="col">
            <label className="form-label">10th Percentage</label>
            <input
              type="number"
              name="tenthPercentage"
              value={formData.tenthPercentage}
              onChange={handleChange}
              className="form-control"
              min="0"
              max="100"
              step="0.01"
            />
          </div>
          <div className="col">
            <label className="form-label">10th Marksheet</label>
            <input
              type="file"
              name="tenthmarksheet"
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* 12th Details */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">12th School</label>
            <input
              type="text"
              name="twelfthSchool"
              value={formData.twelfthSchool}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col">
            <label className="form-label">12th Passing Year</label>
            <input
              type="text"
              name="twelfthPassingYear"
              value={formData.twelfthPassingYear}
              onChange={handleChange}
              className="form-control"
              maxLength={4}
              pattern="\d{4}"
              title="Enter 4 digit year"
            />
          </div>
          <div className="col">
            <label className="form-label">12th Percentage</label>
            <input
              type="number"
              name="twelfthPercentage"
              value={formData.twelfthPercentage}
              onChange={handleChange}
              className="form-control"
              min="0"
              max="100"
              step="0.01"
            />
          </div>
          <div className="col">
            <label className="form-label">12th Marksheet</label>
            <input
              type="file"
              name="twelfthMarksheet"
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="d-grid">
          <button type="submit" disabled={loading} className="btn btn-primary">
  {loading ? (
    <>
      <span className="admission-loader me-2" aria-hidden="true"></span>
      Submitting...
    </>
  ) : (
    "Submit Admission"
  )}
</button>

        </div>
      </form>
    </div>
  );
};

export default Admision;
