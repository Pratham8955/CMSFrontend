import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/Student/StudentDashboard.css";
import { API_BASE_URL, BASE_URL } from "../../config/api";

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [deptName, setDeptName] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const studentId = decoded.StudentUserId;
      axios
        .get(`${API_BASE_URL}/Student/getStudentsById/${studentId}`)
        .then((res) => {
          if (res.data.success && res.data.student?.length > 0) {
            const stud = res.data.student[0];
            setStudent(stud);

            if (stud.deptId) {
              // Fetch department name
              axios
                .get(
                  `${API_BASE_URL}/Department/GetDepartmentById/${stud.deptId}`
                )
                .then((depRes) => {
                  if (depRes.data.success)
                    setDeptName(depRes.data.department.deptName);
                })
                .catch(console.error);

              // Fetch faculties and subjects
              axios
                .get(`${API_BASE_URL}/Subject/GetSubjectsByStudentonly/${studentId}`)
                .then((SubRes) => {
                  if (SubRes.data.success) {
                    const allSubujects =
                      SubRes.data.subject || SubRes.data.subject || [];
                    setFaculties(allSubujects);
                  }
                })
                .catch(console.error);
            }
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));

      // Fetch notifications
      axios
        .get(`${API_BASE_URL}/Notifications/notifications/${studentId}`)
        .catch(console.error);
    } catch (error) {
      console.error("Token decode error:", error);
      setLoading(false);
    }
  }, []);

  return (
    <div className="student-dashboard-page">
      {/* Student Info Card */}
      {student && (
        <div className="student-info-card shadow-sm">
          {student.studentImg ? (
            <img
              src={`${BASE_URL}/uploads/students/studentProfile/${student.studentImg}`}
              alt="Student"
              className="student-img"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = "flex";
                }
              }}
            />
          ) : null}
          <div
            className="placeholder-img"
            style={{ display: student.studentImg ? "none" : "flex" }}
          >
            {student.studentName ? student.studentName.charAt(0).toUpperCase() : "S"}
          </div>

          <div className="student-details">
            <h3 className="studentName">{student.studentName}</h3>
            <p className="studentEmail">{student.email}</p>
            <div className="studentMeta">
              <span className="meta-badge">Department: {deptName || student.deptId}</span>
              {student.currentSemester && (
                <span className="meta-badge sem-badge">
                  {student.currentSemester} Semester
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subjects Section */}
      <div className="subjects-section">
        <h3 className="subjects-heading">
          Subjects of Your Department: <span className="dept-highlight">{deptName || "Department"}</span>
        </h3>

        {faculties.length === 0 ? (
          <div className="no-subjects-card">
            <p className="text-muted fst-italic mb-0">No subjects found for your department.</p>
          </div>
        ) : (
          <div className="table-wrapper shadow-sm">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Subject Name</th>
                  <th>Department</th>
                  <th>Semester</th>
                </tr>
              </thead>
              <tbody>
                {faculties.map((subject, idx) => (
                  <tr key={subject.subjectId || idx}>
                    <td className="fw-semibold text-dark">{subject.subjectName}</td>
                    <td>{subject.deptName || deptName}</td>
                    <td>
                      <span className="semester-pill">
                        {subject.semId ? `${subject.semId} Semester` : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
