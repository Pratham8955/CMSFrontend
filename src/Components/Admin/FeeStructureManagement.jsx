import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "../../css/Admin/FeeStructureManagement.css"
const FeeStructureManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);

  const [expandedDeptId, setExpandedDeptId] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [modalDept, setModalDept] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editFeeStructure, setEditFeeStructure] = useState(null);

  const [newSemId, setNewSemId] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const [editSemId, setEditSemId] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const [feeStructuresfortype, setFeeStructuresfortype] = useState([]);
  const [selectedFeeStructureId, setSelectedFeeStructureId] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    fetchDepartments();
    fetchSemesters();
    fetchFeeStructures();
  }, []);


  useEffect(() => {
    const feeStructuresfortype = async () => {
      try {
        const response = await axios.get('https://localhost:7133/api/FeeStructure/getUnassignedFeeStructures');
        if (response.data.success) {
          setFeeStructuresfortype(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching fee structures:', error);
      }
    };

    feeStructuresfortype();
  }, []);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!selectedFeeStructureId) {
  //     setSubmitMessage('Please select a fee structure');
  //     return;
  //   }

  //   setLoading(true);
  //   setSubmitMessage('');

  //   try {
  //     const payload = {
  //       feeStructureId: parseInt(selectedFeeStructureId, 10)
  //     };

  //     const response = await axios.post(
  //       'http://localhost:5291/api/StudentFeesType/addStudentFeeType',
  //       payload
  //     );

  //     if (response.data.success) {
  //       setSubmitMessage('Fee added successfully!');
  //       setSelectedFeeStructureId('');
  //       setTimeout(() => {
  //         setSubmitMessage('');
  //       }, 3000);
  //     } else {
  //       setSubmitMessage('Failed to add fee: ' + response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('Submit error:', error);
  //     setSubmitMessage('An error occurred while submitting.');
  //   }

  //   setLoading(false);
  // };


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

  const fetchFeeStructures = () => {
    fetch("https://localhost:7133/api/FeeStructure/getFeeStructure")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.feeStruct) {
          setFeeStructures(data.feeStruct);
        } else {
          setFeeStructures([]);
          Swal.fire("Error", "Failed to fetch fee structures", "error");
        }
      })
      .catch(() => {
        setFeeStructures([]);
        Swal.fire("Error", "Error fetching fee structures", "error");
      });
  };

  const handleAddFeeStructure = (deptId) => {
    if (!newSemId || !newAmount) {
      Swal.fire("Warning", "Please select semester and enter amount", "warning");
      return;
    }

    const data = {
      deptId: parseInt(deptId, 10),
      semId: parseInt(newSemId, 10),
      defaultAmount: parseFloat(newAmount),
      feeStructureDescription: "",
    };

    fetch("https://localhost:7133/api/FeeStructure/addFeeStructure", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Swal.fire("Success", data.message || "Fee Structure added successfully!", "success");
          setNewAmount("");
          setNewSemId("");
          setShowAddModal(false);
          fetchFeeStructures();
        } else {
          Swal.fire("Error", data.message || "Failed to add fee structure", "error");
        }
      })
      .catch(() => {
        Swal.fire("Error", "Error adding fee structure", "error");
      });
  };

  const handleDeleteFeeStructure = (feeStructureId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this deletion!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://localhost:7133/api/FeeStructure/deleteFeeStructure/${feeStructureId}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (res.status === 204) {
              Swal.fire("Deleted!", "Fee structure has been deleted.", "success");
              fetchFeeStructures();
            } else if (res.status === 404) {
              Swal.fire("Not Found", "Fee structure not found. It may have already been deleted.", "info");
            } else {
              return res.text().then((msg) => {
                Swal.fire("Error", msg || "Unexpected error occurred.", "error");
              });
            }
          })
          .catch(() => {
            Swal.fire("Error", "Error deleting fee structure.", "error");
          });
      }
    });
  };

  const openEditModal = (feeStructure) => {
    setEditFeeStructure(feeStructure);
    setEditSemId(feeStructure.semId.toString());
    setEditAmount(feeStructure.defaultAmount.toString());
    setModalDept(departments.find((d) => d.deptId === feeStructure.deptId));
    setShowEditModal(true);
  };

  const handleUpdateFeeStructure = () => {
    if (!editSemId || !editAmount) {
      Swal.fire("Warning", "Please select semester and enter amount", "warning");
      return;
    }

    const data = {
      deptId: editFeeStructure.deptId,
      semId: parseInt(editSemId, 10),
      defaultAmount: parseFloat(editAmount),
      feeStructureDescription: editFeeStructure.feeStructureDescription || "",
      feeStructureId: editFeeStructure.feeStructureId,
    };

    fetch(`https://localhost:7133/api/FeeStructure/updateFeeStructure/${editFeeStructure.feeStructureId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          Swal.fire("Success", "Fee structure updated successfully!", "success");
          setShowEditModal(false);
          fetchFeeStructures();
        } else {
          res.text().then((msg) => {
            Swal.fire("Error", msg || "Failed to update fee structure", "error");
          });
        }
      })
      .catch(() => {
        Swal.fire("Error", "Error updating fee structure", "error");
      });
  };

  return (
    <div className="admincontainer" style={{ maxWidth: "1300px", margin: "auto" }}>
      <h2 className="admin-title">Fee Structure Management</h2>

      <div
        className="department-cards-container"
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1.5rem",
        }}
      >
        {departments.map((dept) => {
          const deptFeeStructures = feeStructures.filter((fs) => fs.deptId === dept.deptId);
          const totalFees = deptFeeStructures.reduce((total, fs) => total + (fs.defaultAmount || 0), 0);

          const isExpanded = expandedDeptId === dept.deptId;

          return (
            <div
              key={dept.deptId}
              className="department-card"
              style={{
                border: "1px solid #ddd",
                padding: "1rem",
                borderRadius: "6px",
                boxSizing: "border-box",
                fontSize: "0.9rem",
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => setExpandedDeptId(isExpanded ? null : dept.deptId)}
            >
              {/* Department name and total fees */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: isExpanded ? "1rem" : "0",
                }}
              >
                <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{dept.deptName}</h3>
                <p style={{ margin: 0, fontWeight: "bold" }}>Total Fees: Rs {totalFees.toFixed(2)}</p>
              </div>

              {/* Expanded section */}
              {isExpanded && (
                <div
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside expanded area
                  style={{ marginTop: "1rem" }}
                >
                  <button
                    className="admin-button add-btn"
                    onClick={() => {
                      setModalDept(dept);
                      setShowAddModal(true);
                      setNewAmount("");
                      setNewSemId("");
                    }}
                    style={{ fontSize: "0.85rem", padding: "4px 8px", marginBottom: "1rem" }}
                  >
                    Add Fee Structure
                  </button>

                  {deptFeeStructures.length === 0 ? (
                    <p>No fee structures added for this department yet.</p>
                  ) : (
                    <table
                      className="admin-table"
                      style={{ borderCollapse: "collapse", fontSize: "0.85rem", width: "100px" }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: "#f5f5f5" }}>
                          <th style={{ border: "1px solid #ddd", padding: "6px" }}>Semester</th>
                          <th style={{ border: "1px solid #ddd", padding: "6px" }}>Amount (Rs)</th>
                          <th style={{ border: "1px solid #ddd", padding: "6px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deptFeeStructures.map((fs) => {
                          const semName = semesters.find((s) => s.semId === fs.semId)?.semName || "Unknown";
                          return (
                            <tr key={fs.feeStructureId}>
                              <td style={{ border: "1px solid #ddd", padding: "6px" }}>{semName}</td>
                              <td style={{ border: "1px solid #ddd", padding: "6px" }}>
                                Rs {fs.defaultAmount?.toFixed(2)}
                              </td>
                              <td style={{ border: "1px solid #ddd", padding: "6px" }}>
                                <button
                                  className="admin-button edit-btn"
                                  onClick={() => openEditModal(fs)}
                                  style={{ marginRight: "5px", fontSize: "0.8rem", padding: "3px 6px" }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="admin-button delete-btn"
                                  onClick={() => handleDeleteFeeStructure(fs.feeStructureId)}
                                  style={{ fontSize: "0.8rem", padding: "3px 6px" }}
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
          );
        })}
      </div>

      {/* Add Fee Structure Modal */}
      {showAddModal && modalDept && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "6px",
              width: "350px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            <h3>Add Fee Structure for {modalDept.deptName}</h3>
            <div style={{ marginBottom: "10px" }}>
              <label>Semester:</label>
              <select
                value={newSemId}
                onChange={(e) => setNewSemId(e.target.value)}
                style={{ width: "100%", padding: "6px" }}
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem.semId} value={sem.semId}>
                    {sem.semName}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Amount (Rs):</label>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                style={{ width: "100%", padding: "6px" }}
                min="0"
                step="0.01"
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <button
                className="admin-button add-btn"
                onClick={() => handleAddFeeStructure(modalDept.deptId)}
                style={{ marginRight: "10px" }}
              >
                Add
              </button>
              <button className="admin-button delete-btn" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Fee Structure Modal */}
      {showEditModal && editFeeStructure && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "6px",
              width: "350px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            <h3>Edit Fee Structure</h3>
            <div style={{ marginBottom: "10px" }}>
              <label>Semester:</label>
              <select
                value={editSemId}
                onChange={(e) => setEditSemId(e.target.value)}
                style={{ width: "100%", padding: "6px" }}
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem.semId} value={sem.semId}>
                    {sem.semName}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label>Amount (Rs):</label>
              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                style={{ width: "100%", padding: "6px" }}
                min="0"
                step="0.01"
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <button
                className="admin-button edit-btn"
                onClick={handleUpdateFeeStructure}
                style={{ marginRight: "10px" }}
              >
                Update
              </button>
              <button className="admin-button delete-btn" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>


      )}
      {/* <div className="p-4">
        <div className="card shadow-sm p-4" style={{ maxWidth: '500px' }}>
          <h3 className="mb-4">Add Fee Type</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="feeStructureSelect" className="form-label">
                Select Fee Structure
              </label>
              <select
                id="feeStructureSelect"
                className="form-select"
                value={selectedFeeStructureId}
                onChange={(e) => setSelectedFeeStructureId(e.target.value)}
              >
                <option value="">-- Select --</option>
                {feeStructuresfortype.map((fs) => (
                  <option key={fs.feeStructureId} value={fs.feeStructureId}>
                    {fs.feeStructureDescription}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : (
                'Add Fee'
              )}
            </button>

            {submitMessage && (
              <div className="alert alert-info mt-3" role="alert">
                {submitMessage}
              </div>
            )}
          </form>
        </div>
      </div> */}


    </div>

  );
};

export default FeeStructureManagement;