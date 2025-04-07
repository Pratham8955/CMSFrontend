import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../css/AdminDepartments.css";

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [deptName, setDeptName] = useState("");
  const [headOfDept, setHeadOfDept] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDepartments();
    fetchFaculties();
  }, []);

  const fetchDepartments = () => {
    axios
      .get("http://localhost:5291/api/Department/GetDepartment")
      .then((res) => {
        if (res.data.success) {
          setDepartments(res.data.department || []);
        } else {
          Swal.fire("Error", "Failed to load departments.", "error");
        }
      })
      .catch((err) => {
        Swal.fire("Error", "Error loading departments.", "error");
        console.error(err);
      });
  };

  const fetchFaculties = () => {
    axios
      .get("http://localhost:5291/api/Faculties/GetFaculties")
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.faculty)) {
          setFacultyList(res.data.faculty);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      deptName: deptName.trim(),
      headOfDept: headOfDept || null,
    };

    try {
      if (isEditing && editingId !== null) {
        const res = await axios.post(
          `http://localhost:5291/api/Department/UpdateDepartment/${editingId}`,
          data
        );
        if (res.data.success) {
          Swal.fire("Success", "Department updated successfully!", "success");
        } else {
          Swal.fire("Error", "Failed to update department.", "error");
        }
      } else {
        const res = await axios.post(
          "http://localhost:5291/api/Department/AddDepartment",
          { deptId: 0, ...data }
        );
        if (res.data.success) {
          Swal.fire("Success", "Department added successfully!", "success");
        } else {
          Swal.fire("Error", "Failed to add department.", "error");
        }
      }

      setDeptName("");
      setHeadOfDept("");
      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
      fetchDepartments();
    } catch (error) {
      Swal.fire("Error", "Error submitting department.", "error");
      console.error(error);
    }
  };

  const handleDelete = async (deptId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.delete(
        `http://localhost:5291/api/Department/DeleteDepartment`,
        { params: { id: deptId } }
      );
      if (res.data.success) {
        Swal.fire("Deleted!", "Department has been deleted.", "success");
        fetchDepartments();
      } else {
        Swal.fire("Error", "Failed to delete department.", "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error", "Error deleting department.", "error");
    }
  };

  const handleEdit = (dept) => {
    setDeptName(dept.deptName);
    setHeadOfDept(dept.headOfDept || "");
    setEditingId(dept.deptId);
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Departments Management</h2>

      {!showForm && (
        <button onClick={() => setShowForm(true)} className="admin-button">
          Add New Department
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label>Department Name:</label>
            <input
              type="text"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Head of Department (Optional):</label>
            <select
              value={headOfDept}
              onChange={(e) => setHeadOfDept(e.target.value)}
              className="form-select"
            >
              <option value="">-- None --</option>
              {facultyList.map((faculty, index) => (
                <option key={index} value={faculty.facultyName}>
                  {faculty.facultyName}
                </option>
              ))}
            </select>
          </div>

          <div className="button-group">
            <button type="submit" className="admin-button save-btn">
              {isEditing ? "Update Department" : "Save Department"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
                setEditingId(null);
                setDeptName("");
                setHeadOfDept("");
              }}
              className="admin-button close-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <h3 style={{ marginTop: "40px" }}>Existing Departments</h3>
      <table className="table-container">
        <thead>
          <tr>
            <th>Department Name</th>
            <th>Head of Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "20px" }}>
                No departments found
              </td>
            </tr>
          ) : (
            departments.map((dept, index) => (
              <tr key={index}>
                <td>{dept.deptName}</td>
                <td>{dept.headOfDept || "N/A"}</td>
                <td>
                  <button
                    className="admin-button edit-btn"
                    onClick={() => handleEdit(dept)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-button delete-btn"
                    onClick={() => handleDelete(dept.deptId)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDepartments;
