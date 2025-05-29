import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/Student/StudentDashboard.css";

const StudentDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [student, setStudent] = useState(null);
  const [deptName, setDeptName] = useState("");
  const [faculties, setFaculties] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const studentId = decoded.StudentUserId;

      // Fetch student info
      axios
        .get(`https://localhost:7133/api/Student/getStudentsById/${studentId}`)
        .then((res) => {
          if (res.data.success && res.data.student?.length > 0) {
            const stud = res.data.student[0];
            setStudent(stud);

            if (stud.deptId) {
              // Fetch department name
              axios
                .get(
                  `https://localhost:7133/api/Department/GetDepartmentById/${stud.deptId}`
                )
                .then((depRes) => {
                  if (depRes.data.success)
                    setDeptName(depRes.data.department.deptName);
                })
                .catch(console.error);

              // Fetch faculties and filter by deptId
              axios
                .get(`http://localhost:5291/api/Subject/GetSubjectsByStudentonly/${studentId}`)
                .then((SubRes) => {
                  if (SubRes.data.success) {
                    const allSubujects =
                      SubRes.data.subject || SubRes.data.subject || [];
                    // const filtered = allSubujects.filter(
                    //   (f) => f.deptId === stud.deptId
                    // );
                    setFaculties(allSubujects);
                  }
                })
                .catch(console.error);
            }
          }
        })
        .catch(console.error);

      // Fetch notifications
      axios
        .get(`https://localhost:7133/api/Notifications/notifications/${studentId}`)
        .then((res) => {
          if (res.data.length > 0) {
            setNotifications(res.data);
            setShowPopup(true);
          }
        })
        .catch(console.error);
    } catch (error) {
      console.error("Token decode error:", error);
    }
  }, []);

  const closePopup = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = jwtDecode(token);
      const studentId = decoded.StudentUserId;

      await axios.post(
        `https://localhost:7133/api/Notifications/markAllAsRead/${studentId}`
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    } finally {
      setShowPopup(false);
    }
  };

  return (
    <div className="container my-5">

      {/* Student Info Card */}
      {student && (
       <div className="centered-card">
  <div className="card mb-5 shadow-sm student-info-card d-flex flex-row align-items-center p-4 gap-4">
    {student.studentImg ? (
      <img
        src={`https://localhost:7133/uploads/students/studentProfile/${student.studentImg}`}
        alt="Student"
        className="rounded-circle border border-secondary student-img"
        loading="lazy"
      />
    ) : (
      <div className="placeholder-img rounded-circle border border-secondary d-flex align-items-center justify-content-center fw-bold fs-4 text-white">
        N/A
      </div>
    )}
    <div>
      <h4 className="mb-1 studentName">{student.studentName}</h4>
      <p className="mb-1 text-muted">{student.email}</p>
      <small className="text-secondary fw-semibold">
        Department: {deptName || student.deptId}
      </small>
    </div>
  </div>
</div>

      )}

      {/* Faculties List */}
      <h3 className="mb-4 text-primary border-bottom pb-2">
        Subjects of Your Department: <span className="text-dark">{deptName}</span>
      </h3>

      {faculties.length === 0 ? (
        <p className="text-muted fst-italic">No faculties found for your department.</p>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover align-middle bg-white">
            <thead className="table-primary">
              <tr>
                <th scope="col" hidden>Subject Id</th>
                <th scope="col">Subject Name</th>
                <th scope="col">Department</th>
                <th scope="col">Semester</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((subject) => (
                <tr key={subject.subjectId}>
                  <td hidden>{subject.subjectId}</td>
                  <td>{subject.subjectName}</td>
                  <td>{subject.deptName}</td>
                  <td>{subject.semId + " Semester"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Notifications Popup */}
      {showPopup && (
        <div className="popup-overlay d-flex justify-content-center align-items-center">
          <div className="card shadow p-4 popup-card">
            <h4 className="mb-3">📢 Notifications</h4>
            <ul className="list-group mb-3">
              {notifications.map((note) => (
                <li key={note.id} className="list-group-item">
                  {note.message}
                </li>
              ))}
            </ul>
            <button
              className="btn btn-primary w-100"
              onClick={closePopup}
              aria-label="Close notifications"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
