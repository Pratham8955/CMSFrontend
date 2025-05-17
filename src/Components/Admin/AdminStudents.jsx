import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, []);

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
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      fontSize: "26px",
      fontWeight: "600",
      marginBottom: "10px",
      textAlign: "center",
      color: "#2c3e50",
    },
    buttonContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "20px",
      justifyContent: "center",
    },
    button: {
      padding: "8px 16px",
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
    totalCount: {
      textAlign: "center",
      marginBottom: "10px",
      fontSize: "16px",
      color: "#555",
    },
    deptSection: {
      marginBottom: "40px",
    },
    deptHeaderRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      margin: "20px 0 10px",
    },
    deptName: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#34495e",
    },
    studentCount: {
      fontSize: "14px",
      color: "#777",
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
    noStudent: {
      padding: "12px 16px",
      fontStyle: "italic",
      color: "#888",
    },
  };

  const getDeptStudentCount = (deptId) =>
    students.filter((s) => s.deptId === deptId).length;

  const filteredStudents = selectedDept
    ? students.filter((s) => s.deptId === selectedDept)
    : students;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Students Management</h2>
      <div style={styles.totalCount}>Total Students: {students.length}</div>

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
            onClick={() => setSelectedDept(dept.deptId)}
          >
            {dept.deptName} ({getDeptStudentCount(dept.deptId)})
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : selectedDept ? (
        <div style={styles.deptSection}>
          <div style={styles.deptHeaderRow}>
            <div style={styles.deptName}>
              {departments.find((d) => d.deptId === selectedDept)?.deptName}
            </div>
            <div style={styles.studentCount}>
              Students: {filteredStudents.length}
            </div>
          </div>
          {filteredStudents.length > 0 ? (
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
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) => (
                  <tr key={idx}>
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
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={styles.noStudent}>No students found in this department.</div>
          )}
        </div>
      ) : (
        // Show all students together in a single table (no dept headings)
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
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={idx}>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminStudents;