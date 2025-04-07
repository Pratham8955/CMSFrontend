import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/AdminStudents.css"; // Make sure this CSS file is in the same folder

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5291/api/Student/GetStudents");
        if (response.data.success) {
          setStudents(response.data.student);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="admin-page-container">
      <h2>Students Management</h2>
      
      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>DeptId</th>
              <th>Semester</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.studentName}</td>
                <td>{student.email}</td>
                <td>{new Date(student.dob).toLocaleDateString()}</td>
                <td>{student.gender}</td>
                <td>{student.phone}</td>
                <td>{student.address}</td>
                <td>{student.city}</td>
                <td>{student.state}</td>
                <td>{student.deptId}</td>
                <td>{student.currentSemester}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminStudents;
