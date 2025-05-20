import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../../css/AdminDepartments.css";

const SubjectManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // For expanding department subjects
  const [expandedDeptId, setExpandedDeptId] = useState(null);

  // For edit form
  const [editSubjectId, setEditSubjectId] = useState(null);
  const [editSubjectName, setEditSubjectName] = useState("");
  const [editDeptId, setEditDeptId] = useState("");
  const [editSemId, setEditSemId] = useState("");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalDept, setModalDept] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);

  // Add form inputs for modal
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSemId, setNewSemId] = useState("");

  useEffect(() => {
    fetchDepartments();
    fetchSemesters();
    fetchSubjects();
  }, []);

  const fetchDepartments = () => {
    fetch("https://localhost:7133/api/Department/GetDepartment")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.department) {
          setDepartments(data.department);
        } else {
          setDepartments([]);
          Swal.fire("Error", "Failed to fetch departments", "error");
        }
      })
      .catch(() => {
        setDepartments([]);
        Swal.fire("Error", "Error fetching departments", "error");
      });
  };

  const fetchSemesters = () => {
    fetch("https://localhost:7133/api/CommonApi/GetSemester")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.semester) {
          setSemesters(data.semester);
        } else {
          setSemesters([]);
          Swal.fire("Error", "Failed to fetch semesters", "error");
        }
      })
      .catch(() => {
        setSemesters([]);
        Swal.fire("Error", "Error fetching semesters", "error");
      });
  };

  const fetchSubjects = () => {
    fetch("https://localhost:7133/api/Subject/GetSubjects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.subject) {
          setSubjects(data.subject);
        } else {
          setSubjects([]);
          Swal.fire("Error", "Failed to fetch subjects", "error");
        }
      })
      .catch(() => {
        setSubjects([]);
        Swal.fire("Error", "Error fetching subjects", "error");
      });
  };

  // Add new subject for a given department (deptId)
  const handleAddSubject = (deptId) => {
    if (!newSubjectName || !newSemId) {
      Swal.fire(
        "Warning",
        "Please select semester and enter subject name",
        "warning"
      );
      return;
    }

    const subjectData = {
      subjectName: newSubjectName.trim(),
      deptId: parseInt(deptId, 10),
      semId: parseInt(newSemId, 10),
    };

    fetch("https://localhost:7133/api/Subject/AddSubjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subjectData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Swal.fire("Success", data.message || "Subject added successfully!", "success");
          setNewSubjectName("");
          setNewSemId("");
          setShowAddModal(false);
          fetchSubjects();
        } else {
          Swal.fire("Error", data.message || "Failed to add subject", "error");
        }
      })
      .catch(() => {
        Swal.fire("Error", "Error adding subject", "error");
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://localhost:7133/api/Subject/DeleteSubject/${id}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (res.ok) {
              Swal.fire("Deleted!", "Subject has been deleted.", "success");
              fetchSubjects();
            } else {
              Swal.fire("Error", "Failed to delete subject", "error");
            }
          })
          .catch(() => {
            Swal.fire("Error", "Error deleting subject", "error");
          });
      }
    });
  };

  // Edit form handlers
  const startEdit = (subject) => {
    setEditSubjectId(subject.subjectId);
    setEditSubjectName(subject.subjectName);
    setEditDeptId(subject.deptId.toString());
    setEditSemId(subject.semId.toString());
    setShowAddModal(false); // close add modal if open
    setShowEditModal(true); // open edit modal
  };

  const cancelEdit = () => {
    setEditSubjectId(null);
    setEditSubjectName("");
    setEditDeptId("");
    setEditSemId("");
    setShowEditModal(false);
  };

  const saveEdit = () => {
    if (!editSubjectName || !editDeptId || !editSemId) {
      Swal.fire("Warning", "Please fill all fields to update the subject", "warning");
      return;
    }

    const updatedSubject = {
      subjectName: editSubjectName.trim(),
      deptId: parseInt(editDeptId, 10),
      semId: parseInt(editSemId, 10),
    };

    fetch(`https://localhost:7133/api/Subject/UpdateSubject/${editSubjectId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedSubject),
    })
      .then((res) => {
        if (res.ok) {
          Swal.fire("Success", "Subject updated successfully", "success");
          cancelEdit();
          fetchSubjects();
        } else {
          Swal.fire("Error", "Failed to update subject", "error");
        }
      })
      .catch(() => {
        Swal.fire("Error", "Error updating subject", "error");
      });
  };

  // Toggle department expansion on click
  const toggleDeptExpand = (deptId) => {
    setExpandedDeptId(expandedDeptId === deptId ? null : deptId);
    // Close modals on department toggle
    setShowAddModal(false);
    cancelEdit();
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Subject Management</h2>

      <div className="department-list" style={{ marginTop: "2rem" }}>
        {departments.map((dept) => (
          <div
            key={dept.deptId}
            className="department-item"
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              marginBottom: "1rem",
              padding: "0.75rem 1rem",
              cursor: "pointer",
              backgroundColor: expandedDeptId === dept.deptId ? "#f9f9f9" : "#fff",
            }}
          >
            <div
              onClick={() => toggleDeptExpand(dept.deptId)}
              style={{ fontWeight: "bold", fontSize: "1.1rem" }}
            >
              {dept.deptName}
            </div>

            {expandedDeptId === dept.deptId && (
              <div style={{ marginTop: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "1rem",
                  }}
                >
                  <button
                    className="admin-button add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalDept(dept);
                      setShowAddModal(true);
                      setNewSubjectName("");
                      setNewSemId("");
                      cancelEdit(); // close edit modal if open
                    }}
                  >
                    Add Subject
                  </button>
                </div>

                {subjects.filter((subj) => subj.deptId === dept.deptId).length === 0 ? (
                  <p>No subjects added in this department yet.</p>
                ) : (
                  <table
                    className="admin-table"
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#f5f5f5" }}>
                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                          Subject Name
                        </th>
                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                          Semester
                        </th>
                        <th style={{ padding: "8px", border: "1px solid #ddd" }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects
                        .filter((subj) => subj.deptId === dept.deptId)
                        .map((subject) => {
                          const semester = semesters.find(
                            (sem) => sem.semId === subject.semId
                          );
                          return (
                            <tr key={subject.subjectId}>
                              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                {subject.subjectName}
                              </td>
                              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                {semester ? semester.semName : ""}
                              </td>
                              <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                                <button
                                  className="admin-button edit-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(subject);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="admin-button delete-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(subject.subjectId);
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    ))}
  </div>

  {/* Add Subject Modal */}
  {showAddModal && modalDept && (
    <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "400px" }}
      >
        <h3>Add Subject to {modalDept.deptName}</h3>
        <label>
          Subject Name:
          <input
            type="text"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            className="admin-input"
          />
        </label>
        <label>
          Semester:
          <select
            value={newSemId}
            onChange={(e) => setNewSemId(e.target.value)}
            className="admin-select"
          >
            <option value="">Select semester</option>
            {semesters.map((sem) => (
              <option key={sem.semId} value={sem.semId}>
                {sem.semName}
              </option>
            ))}
          </select>
        </label>

        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
          <button
            className="admin-button cancel-btn"
            onClick={() => setShowAddModal(false)}
          >
            Cancel
          </button>
          <button
            className="admin-button save-btn"
            onClick={() => handleAddSubject(modalDept.deptId)}
            style={{ marginLeft: "1rem" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Edit Subject Modal */}
  {showEditModal && (
    <div className="modal-overlay" onClick={cancelEdit}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "400px" }}
      >
        <h3>Edit Subject</h3>
        <label>
          Subject Name:
          <input
            type="text"
            value={editSubjectName}
            onChange={(e) => setEditSubjectName(e.target.value)}
            className="admin-input"
          />
        </label>
        <label>
          Department:
          <select
            value={editDeptId}
            onChange={(e) => setEditDeptId(e.target.value)}
            className="admin-select"
          >
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept.deptId} value={dept.deptId}>
                {dept.deptName}
              </option>
            ))}
          </select>
        </label>
        <label>
          Semester:
          <select
            value={editSemId}
            onChange={(e) => setEditSemId(e.target.value)}
            className="admin-select"
          >
            <option value="">Select semester</option>
            {semesters.map((sem) => (
              <option key={sem.semId} value={sem.semId}>
                {sem.semName}
              </option>
            ))}
          </select>
        </label>

        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
          <button className="admin-button cancel-btn" onClick={cancelEdit}>
            Cancel
          </button>
          <button
            className="admin-button save-btn"
            onClick={saveEdit}
            style={{ marginLeft: "1rem" }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )}
</div>
);
};

export default SubjectManagement;