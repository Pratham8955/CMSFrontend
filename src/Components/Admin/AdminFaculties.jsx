import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../css/AdminFaculties.css";

const AdminFaculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(""); // NEW
  const [formData, setFormData] = useState({
    facultyName: "",
    email: "",
    doj: "",
    gender: "",
    qualification: "",
    experience: "",
    deptId: "",
    image: null,
  });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchFaculties();
    fetchDepartments();
  }, []);

  const fetchFaculties = async () => {
    try {
      const res = await axios.get("https://localhost:7133/api/Faculties/GetFaculties");
      if (res.data.success) {
        setFaculties(res.data.faculty || res.data.Faculty);
      } else {
        Swal.fire("Error", "Failed to load faculties.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error loading faculties.", "error");
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("https://localhost:7133/api/Department/GetDepartment");
      if (res.data.success) {
        setDepartments(res.data.department || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("facultyName", formData.facultyName);
    data.append("email", formData.email);
    data.append("doj", formData.doj);
    data.append("gender", formData.gender);
    data.append("qualification", formData.qualification);
    data.append("experience", formData.experience);
    data.append("deptId", formData.deptId);
    if (formData.image) {
      data.append("facultyImg", formData.image);
    }

    try {
      if (isEditing) {
        const res = await axios.post(
          `https://localhost:7133/api/Faculties/UpdateFaculty/${editingId}`,
          data
        );

        if (res.status === 204) {
          Swal.fire("Success", "Faculty updated successfully!", "success");
        } else {
          Swal.fire("Error", "Failed to update faculty.", "error");
        }
      } else {
        const res = await axios.post(
          "https://localhost:7133/api/Faculties/AddFaculty",
          data
        );

        if (res.data.success) {
          Swal.fire("Success", res.data.message || "Faculty added successfully!", "success");
        } else {
          Swal.fire("Error", res.data.message || "Failed to add faculty.", "error");
        }
      }

      resetForm();
      fetchFaculties();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error submitting faculty form.", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      facultyName: "",
      email: "",
      doj: "",
      gender: "",
      qualification: "",
      experience: "",
      deptId: "",
      image: null,
    });
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (faculty) => {
    setFormData({
      facultyName: faculty.facultyName,
      email: faculty.email,
      doj: faculty.doj,
      gender: faculty.gender,
      qualification: faculty.qualification,
      experience: faculty.experience,
      deptId: faculty.deptId,
      image: null,
    });
    setEditingId(faculty.facultyId);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (facultyId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.delete(
        `https://localhost:7133/api/Faculties/DeleteFaculty`,
        { params: { id: facultyId } }
      );

      if (res.status === 204) {
        Swal.fire("Deleted!", "Faculty deleted successfully.", "success");
        fetchFaculties();
      } else {
        Swal.fire("Error", "Failed to delete faculty.", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error deleting faculty.", "error");
    }
  };

  const filteredFaculties = faculties.filter(
    (faculty) => !selectedDept || faculty.deptId.toString() === selectedDept
  );

  return (
    <div className="admin-container">
      <h2 className="admin-title">Faculty Management</h2>

      {!showForm && (
        <div className="top-controls" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => setShowForm(true)} className="admin-button">
            Add New Faculty
          </button>
          <select
            className="form-select"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            style={{ maxWidth: "250px" }}
          >
            <option value="">Filter by Department</option>
            {departments.map((dept) => (
              <option key={dept.deptId} value={dept.deptId}>
                {dept.deptName}
              </option>
            ))}
          </select>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          {/* Form fields same as before */}
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="facultyName" value={formData.facultyName} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <label>Date of Joining:</label>
            <input type="date" name="doj" value={formData.doj} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <label>Gender:</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required className="form-select">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Qualification:</label>
            <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <label>Experience:</label>
            <input type="text" name="experience" value={formData.experience} onChange={handleChange} required className="form-input" />
          </div>

          <div className="form-group">
            <label>Department:</label>
            <select name="deptId" value={formData.deptId} onChange={handleChange} required className="form-select">
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.deptId} value={dept.deptId}>
                  {dept.deptName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Faculty Image:</label>
            <input type="file" name="facultyImg" accept="image/*" onChange={handleChange} className="form-input" />
          </div>

          <div className="button-group">
            <button type="submit" className="admin-button save-btn">
              {isEditing ? "Update Faculty" : "Save Faculty"}
            </button>
            <button type="button" onClick={resetForm} className="admin-button close-btn">
              
              Cancel
            </button>
          </div>
        </form>
      )}

      <h3 style={{ marginTop: "40px" }}>Existing Faculties</h3>
      <table className="table-container">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>DOJ</th>
            <th>Qualification</th>
            <th>Experience</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFaculties.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                No faculty found
              </td>
            </tr>
          ) : (
            filteredFaculties.map((faculty, index) => (
              <tr key={index}>
                <td>{faculty.facultyName}</td>
                <td>{faculty.email}</td>
                <td>{faculty.gender}</td>
                <td>{faculty.doj}</td>
                <td>{faculty.qualification}</td>
                <td>{faculty.experience}</td>
                <td>{departments.find((d) => d.deptId === faculty.deptId)?.deptName || "N/A"}</td>
                <td>
                  <div className="action-buttons">
                    <button className="admin-button edit-btn" onClick={() => handleEdit(faculty)}>Edit</button>
                    <button className="admin-button delete-btn" onClick={() => handleDelete(faculty.facultyId)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFaculties;