import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, []);

  const handleEditClick = (student) => {
    navigate("/admin/admision", { state: { student } });
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get("https://localhost:7133/api/Student/GetStudents");
      if (res.data.success) {
        setStudents(res.data.student);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("https://localhost:7133/api/Department/GetDepartment");
      if (res.data.success) {
        setDepartments(res.data.department || []);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const styles = {
    container: {
      padding: "30px",
      fontFamily: "Segoe UI",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      flexWrap: "wrap",
      gap: "10px",
    },
    header: {
      fontSize: "26px",
      fontWeight: "600",
      color: "#2c3e50",
    },
    searchBar: {
      padding: "6px 10px",
      width: "220px",
      fontSize: "14px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    buttonContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "20px",
      justifyContent: "center",
    },
    button: {
      padding: "6px 12px",
      border: "1px solid #3498db",
      borderRadius: "6px",
      backgroundColor: "#fff",
      color: "#3498db",
      cursor: "pointer",
      fontWeight: "500",
    },
    activeButton: {
      backgroundColor: "#3498db",
      color: "#fff",
    },
    actionButton: {
      padding: "4px 8px",
      marginRight: "5px",
      borderRadius: "4px",
      fontSize: "12px",
      cursor: "pointer",
    },
    editButton: {
      backgroundColor: "#f1c40f",
      color: "#fff",
      border: "none",
    },
    deleteButton: {
      backgroundColor: "#e74c3c",
      color: "#fff",
      border: "none",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      marginTop: "15px",
      gap: "5px",
    },
    paginationBtn: {
      padding: "6px 10px",
      border: "1px solid #3498db",
      borderRadius: "4px",
      cursor: "pointer",
      backgroundColor: "#fff",
    },
    activePage: {
      backgroundColor: "#3498db",
      color: "#fff",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      borderRadius: "10px",
      overflow: "hidden",
    },
    th: {
      padding: "12px 16px",
      backgroundColor: "#f0f0f0",
      fontWeight: "600",
      borderBottom: "1px solid #ddd",
      textAlign: "left",
    },
    td: {
      padding: "12px 16px",
      borderBottom: "1px solid #eee",
    },
  };

  const getDeptStudentCount = (deptId) =>
    students.filter((s) => s.deptId === deptId).length;

  const filteredStudents = students
    .filter((s) => (selectedDept ? s.deptId === selectedDept : true))
    .filter((s) =>
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <div style={styles.container}>
      {/* Header Row with Search */}
      <div style={styles.headerRow}>
        <h2 style={styles.header}>Students Management</h2>
        <input
          type="text"
          placeholder="Search by name"
          style={styles.searchBar}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Department Filter Buttons */}
      <div style={styles.buttonContainer}>
        <button
          style={{
            ...styles.button,
            ...(selectedDept === null ? styles.activeButton : {}),
          }}
          onClick={() => setSelectedDept(null)}
        >
          All
        </button>
        {departments.map((dept) => (
          <button
            key={dept.deptId}
            style={{
              ...styles.button,
              ...(selectedDept === dept.deptId ? styles.activeButton : {}),
            }}
            onClick={() => {
              setSelectedDept(dept.deptId);
              setCurrentPage(1);
            }}
          >
            {dept.deptName} ({getDeptStudentCount(dept.deptId)})
          </button>
        ))}
      </div>

      {/* Student Table */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>DOB</th>
                <th style={styles.th}>Gender</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Address</th>
                <th style={styles.th}>City</th>
                <th style={styles.th}>State</th>
                <th style={styles.th}>Semester</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.length > 0 ? (
                currentStudents.map((student) => (
                  <tr key={student.studentId}>
                    <td style={styles.td}>{student.studentName}</td>
                    <td style={styles.td}>{student.email}</td>
                    <td style={styles.td}>
                      {new Date(student.dob).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>{student.gender}</td>
                    <td style={styles.td}>{student.phone}</td>
                    <td style={styles.td}>{student.address}</td>
                    <td style={styles.td}>{student.city}</td>
                    <td style={styles.td}>{student.state}</td>
                    <td style={styles.td}>{student.currentSemester}</td>
                    <td style={styles.td}>
                      <button
                        style={{
                          ...styles.actionButton,
                          ...styles.editButton,
                        }}
                        onClick={() => handleEditClick(student)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" style={styles.td}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                style={styles.paginationBtn}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  style={{
                    ...styles.paginationBtn,
                    ...(currentPage === i + 1 ? styles.activePage : {}),
                  }}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                style={styles.paginationBtn}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminStudents;
