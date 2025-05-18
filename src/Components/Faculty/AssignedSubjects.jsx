import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from "jwt-decode"; // fixed import
import "../../css/Faculty/AssignedSubjects.css"
const AssignedSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const facultytId = decoded.FacultyUserId;

  useEffect(() => {
    axios.get(`https://localhost:7133/api/FacultySubject/GetFacultySubjectsForAssignedFaculty/${facultytId}`)
      .then(response => {
        if (response.data.success) {
          setSubjects(response.data.facultySubject);
        }
      })
      .catch(error => {
        console.error('Error fetching assigned subjects:', error);
      });
  }, [facultytId]);

  return (
    <div className="p-4">
      <h2 className="mb-4 fw-bold text-primary">All Subjects</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col">Sr No.</th>
              <th scope="col">Subject Name</th>
              <th scope="col">Semester</th>
              <th scope="col">Department Name</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length > 0 ? (
              subjects.map((item, index) => (
                <tr key={item.subjectId}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.subject}</td>
                  <td>{item.semId} Semester</td>
                  <td>{item.depname}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No subjects assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedSubjects;
