import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../css/AdminDepartments.css";

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [deptName, setDeptName] = useState("");
  const [headOfDept, setHeadOfDept] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [FacultyListforEdit, setFacultyListforEdit] = useState([]);

  // Modal control
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Editing
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDepartments();
    fetchFaculties();
  }, []);

  const fetchDepartments = () => {
    axios
      .get("https://localhost:7133/api/Department/GetDepartment")
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
      .get("https://localhost:7133/api/Faculties/GetFaculties")
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.faculty)) {
          setFacultyList(res.data.faculty);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchFacultiesByDepartment = async (deptId) => {
      try {
        const response = await axios.get(
          `https://localhost:7133/api/CommonApi/GetFacultyByDepartment/${deptId}`
        );
        setFacultyListforEdit(response.data.faculty || []);
      } catch (error) {
        alert("Failed to load faculty list.");
      }
    };


  // Open Add Modal & reset form
  const openAddModal = () => {
    setDeptName("");
    setHeadOfDept("");
    setEditingId(null);
    setShowAddModal(true);
  };

  // Open Edit Modal with data
  const openEditModal = (dept) => {
    setDeptName(dept.deptName);
    setHeadOfDept(dept.headOfDept?.toString() || "");
    setEditingId(dept.deptId);
    fetchFacultiesByDepartment(dept.deptId);
    setShowEditModal(true);
  };

  // Close modals and reset form
  const closeModals = () => {
    setDeptName("");
    setHeadOfDept("");
    setEditingId(null);
    setShowAddModal(false);
    setShowEditModal(false);
  };

  // Submit handler for both add and edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!deptName.trim()) {
      Swal.fire("Warning", "Department name is required.", "warning");
      return;
    }

    const data = {
      deptName: deptName.trim(),
      headOfDept: headOfDept ? parseInt(headOfDept) : null,
    };

    try {
      if (editingId !== null) {
        // Update department
        const res = await axios.post(
          `https://localhost:7133/api/Department/UpdateDepartment/${editingId}`,
          data
        );
        if (res.data.success || res.status === 204) {
          Swal.fire("Success", "Department updated successfully!", "success");
        } else {
          Swal.fire("Error", "Failed to update department.", "error");
        }
      } else {
        // Add department
        const res = await axios.post(
          "https://localhost:7133/api/Department/AddDepartment",
          { deptId: 0, ...data }
        );
        if (res.data.success) {
          Swal.fire("Success", "Department added successfully!", "success");
        } else {
          Swal.fire("Error", "Failed to add department.", "error");
        }
      }

      closeModals();
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
        `https://localhost:7133/api/Department/DeleteDepartment`,
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

  return (
    <div className="admin-container">
      <h2 className="admin-title">Departments Management</h2>

      <button onClick={openAddModal} className="admin-button">
        Add New Department
      </button>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Department</h3>
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

              <div className="button-group">
                <button type="submit" className="admin-button save-btn">
                  Save Department
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  className="admin-button close-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Department Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Department</h3>
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
    {FacultyListforEdit.map((faculty) => (
      <option key={faculty.facultyId} value={faculty.facultyId}>
        {faculty.facultyName}
      </option>
    ))}
  </select>
</div>


              <div className="button-group">
                <button type="submit" className="admin-button save-btn">
                  Update Department
                </button>
                <button
                  type="button"
                  onClick={closeModals}
                  className="admin-button close-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
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
            departments.map((dept) => (
              <tr key={dept.deptId}>
                <td>{dept.deptName}</td>
                <td>
                  {
                    facultyList.find((f) => f.facultyId === dept.headOfDept)
                      ?.facultyName || "N/A"
                  }
                </td>
                <td>
                  <button
                    className="admin-button edit-btn"
                    onClick={() => openEditModal(dept)}
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
