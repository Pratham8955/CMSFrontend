import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../css/AdminFaculties.css";

const AdminFaculties = () => {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    facultyName: "",
    email: "",
    doj: "",
    gender: "",
    qualification: "",
    experience: "",
    password: "",
    deptId: "",
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        const res = await axios.post(
          `https://localhost:7133/api/Faculties/UpdateFaculty/${editingId}`,
          formData
        );

        if (res.status === 204) {
          Swal.fire("Success", "Faculty updated successfully!", "success");
        } else {
          Swal.fire("Error", "Failed to update faculty.", "error");
        }
      } else {
        const res = await axios.post(
          "https://localhost:7133/api/Faculties/AddFaculty",
          formData
        );

        if (res.data.success) {
          Swal.fire("Success", "Faculty added successfully!", "success");
        } else {
          Swal.fire("Error", "Failed to add faculty.", "error");
        }
      }

      setFormData({
        facultyName: "",
        email: "",
        doj: "",
        gender: "",
        qualification: "",
        experience: "",
        password: "",
        deptId: "",
      });

      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
      fetchFaculties();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error submitting faculty form.", "error");
    }
  };

  const handleEdit = (faculty) => {
    setFormData({ ...faculty });
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

  return (
    <div className="admin-container">
      <h2 className="admin-title">Faculty Management</h2>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="admin-button">
          Add New Faculty
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="facultyName"
              value={formData.facultyName}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Date of Joining:</label>
            <input
              type="date"
              name="doj"
              value={formData.doj}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Qualification:</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Experience:</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          {!isEditing && (
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <label>Department:</label>
            <select
              name="deptId"
              value={formData.deptId}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.deptId} value={dept.deptId}>
                  {dept.deptName}
                </option>
              ))}
            </select>
          </div>

          <div className="button-group">
            <button type="submit" className="admin-button save-btn">
              {isEditing ? "Update Faculty" : "Save Faculty"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
                setEditingId(null);
                setFormData({
                  facultyName: "",
                  email: "",
                  doj: "",
                  gender: "",
                  qualification: "",
                  experience: "",
                  password: "",
                  deptId: "",
                });
              }}
              className="admin-button close-btn"
            >
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
          {faculties.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                No faculty found
              </td>
            </tr>
          ) : (
            faculties.map((faculty, index) => (
              <tr key={index}>
                <td>{faculty.facultyName}</td>
                <td>{faculty.email}</td>
                <td>{faculty.gender}</td>
                <td>{faculty.doj}</td>
                <td>{faculty.qualification}</td>
                <td>{faculty.experience}</td>
                <td>
                  {
                    departments.find((d) => d.deptId === faculty.deptId)
                      ?.deptName || "N/A"
                  }
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="admin-button edit-btn"
                      onClick={() => handleEdit(faculty)}
                    >
                      Edit
                    </button>
                    <button
                      className="admin-button delete-btn"
                      onClick={() => handleDelete(faculty.facultyId)}
                    >
                      Delete
                    </button>
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
