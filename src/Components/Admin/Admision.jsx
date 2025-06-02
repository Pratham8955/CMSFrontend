import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Stateandcity from "../Admin/Stateandcity.json";
import "../../css/Admin/Admision.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://localhost:7133/api";

const Admision = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Detect if edit mode by checking if location.state?.student exists
  const editStudent = location.state?.student;

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
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    // console.log("Edit student gender:", editStudent.gender);
    setStates(Object.keys(Stateandcity));

    const fetchInitialData = async () => {
      try {
        const deptRes = await axios.get(`${API_BASE_URL}/Department/GetDepartment`);
        if (deptRes.data.success) {
          setDepartments(deptRes.data.department || deptRes.data.Department);
        }

        const semRes = await axios.get(`${API_BASE_URL}/CommonApi/GetSemester`);
        if (semRes.data.success) {
          setSemesters(semRes.data.semester || semRes.data.Semester);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();

    if (editStudent) {
      // Pre-fill form data for edit, except files (which can't be prefilled)
      setFormData({
        studentName: editStudent.studentName || "",
        email: editStudent.email || "",
        dob: editStudent.dob ? editStudent.dob.split("T")[0] : "", // Format date if needed
        gender: editStudent.gender || "",
        address: editStudent.address || "",
        city: editStudent.city || "",
        state: editStudent.state || "",
        phone: editStudent.phone || "",
        deptId: editStudent.deptId || "",
        currentSemester: editStudent.currentSemester || "",
        StudentImg: null,
        StudentImgPath: editStudent.studentImg || "",
        tenthPassingYear: editStudent.tenthPassingYear || "",
        tenthPercentage: editStudent.tenthPercentage || "",
        tenthmarksheet: null,
        tenthMarksheetPath: editStudent.tenthMarksheet || "",
        twelfthSchool: editStudent.twelfthSchool || "",
        twelfthPassingYear: editStudent.twelfthPassingYear || "",
        twelfthPercentage: editStudent.twelfthPercentage || "",
        twelfthMarksheet: null,
        twelfthMarksheetPath: editStudent.twelfthMarksheet || "",
        tenthSchool: editStudent.tenthSchool || ""
      });

      // Set selected state and cities dropdown accordingly
      setSelectedState(editStudent.state || "");
      setCities(editStudent.state ? Stateandcity[editStudent.state] || [] : []);
      setSelectedCity(editStudent.city || "");
    }
  }, [editStudent]);

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
    setLoading(true);

    const formDataToSubmit = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      // Skip file fields and path fields (we'll handle them separately)
      if (!['StudentImg', 'tenthmarksheet', 'twelfthMarksheet'].includes(key) &&
        !key.endsWith('Path')) {
        if (value !== null && value !== "") {
          formDataToSubmit.append(key, value);
        }
      }
    });
    // Handle student image
    if (formData.StudentImg) {
      formDataToSubmit.append('StudentImg', formData.StudentImg);
    } else if (formData.StudentImgPath) {
      formDataToSubmit.append('StudentImgPath', formData.StudentImgPath);
    }

    // Handle 10th marksheet
    if (formData.tenthmarksheet) {
      formDataToSubmit.append('tenthmarksheet', formData.tenthmarksheet);
    } else if (formData.tenthMarksheetPath) {
      formDataToSubmit.append('TenthMarksheetPath', formData.tenthMarksheetPath);
    }


    // Handle 12th marksheet
    if (formData.twelfthMarksheet) {
      formDataToSubmit.append('twelfthMarksheet', formData.twelfthMarksheet);
    } else if (formData.twelfthMarksheetPath) {
      formDataToSubmit.append('TwelfthMarksheetPath', formData.twelfthMarksheetPath);
    }


    try {
      let response;

      if (editStudent && editStudent.studentId) {
        // Edit mode - PUT request to update student (adjust endpoint if needed)
        formDataToSubmit.append("studentId", editStudent.studentId); // pass id in form data if needed

        response = await axios.put(
          `${API_BASE_URL}/Student/updateStudents/${editStudent.studentId}`,
          formDataToSubmit,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // Add mode - POST request to add student
        response = await axios.post(
          `${API_BASE_URL}/Register/register-student`,
          formDataToSubmit,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      if (response.status === 200 || response.status === 204) {
        Swal.fire("Successfully updated", response.data.message, "success").then(() => {
          navigate("/admin/students");
        });
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Operation failed!", "error");
    } finally {
      setLoading(false);
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
        <h3 className="text-center mb-4 text-primary">
          {editStudent ? "✏️ Edit Student Details" : "🎓 Student Registration"}
        </h3>

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
              accept="image/*"
            />
            {formData.StudentImgPath && !formData.StudentImg && (
              <div className="mt-2">
                <small>Current: {formData.StudentImgPath.split('/').pop()}</small>
              </div>
            )}
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
              max={maxDob}
              className="form-control"
              required
            />
          </div>
          <div className="col">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>

            </select>
          </div>
        </div>

        {/* Address, State, City */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control"
              rows={2}
              required
            />
          </div>
          <div className="col">
            <label className="form-label">State</label>
            <select
              name="state"
              value={selectedState}
              onChange={handleStateChange}
              className="form-select"
              required
            >
              <option value="">Select State</option>
              {states.map((stateName) => (
                <option key={stateName} value={stateName}>
                  {stateName}
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
              className="form-select"
              required
              disabled={!selectedState}
            >
              <option value="">Select City</option>
              {cities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Department and Semester */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">Department</label>
            <select
              name="deptId"
              value={formData.deptId}
              onChange={handleChange}
              className="form-select"
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
          <div className="col">
            <label className="form-label">Current Semester</label>
            <select
              name="currentSemester"
              value={formData.currentSemester}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem.semesterId} value={sem.semId}>
                  {sem.semName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 10th Details */}
        <div className="row mb-3">
          <div className="col">
            <label className="form-label">10th Marksheet</label>
            <input
              type="file"
              name="tenthmarksheet"
              onChange={handleChange}
              className="form-control"
              accept=".pdf"
            />
            {formData.tenthMarksheetPath && !formData.tenthmarksheet && (
              <div className="mt-2">
                <small>Current: {formData.tenthMarksheetPath.split('/').pop()}</small>
              </div>
            )}
          </div>
          <div className="col">
            <label className="form-label">10th Passing Year</label>
            <input
              type="number"
              name="tenthPassingYear"
              value={formData.tenthPassingYear}
              onChange={handleChange}
              className="form-control"
              min="1900"
              max={new Date().getFullYear()}
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
            <label className="form-label">10th School</label>
            <input
              type="text"
              name="tenthSchool"
              value={formData.tenthSchool}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* 12th Details */}
        <div className="row mb-3">
          {/* 12th Marksheet */}
          <div className="col">
            <label className="form-label">12th Marksheet</label>
            <input
              type="file"
              name="twelfthMarksheet"
              onChange={handleChange}
              className="form-control"
              accept=".pdf"
            />
            {formData.twelfthMarksheetPath && !formData.twelfthMarksheet && (
              <div className="mt-2">
                <small>Current: {formData.twelfthMarksheetPath.split('/').pop()}</small>
              </div>
            )}
          </div>
          <div className="col">
            <label className="form-label">12th Passing Year</label>
            <input
              type="number"
              name="twelfthPassingYear"
              value={formData.twelfthPassingYear}
              onChange={handleChange}
              className="form-control"
              min="1900"
              max={new Date().getFullYear()}
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
            <label className="form-label">12th School</label>
            <input
              type="text"
              name="twelfthSchool"
              value={formData.twelfthSchool}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {editStudent ? "Update Student" : "Register Student"}
          </button>
          &nbsp;&nbsp;
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/adminstudents")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};


export default Admision;

// issue here