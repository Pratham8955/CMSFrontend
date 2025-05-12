import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

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
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Assigned Subjects</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Sr No.</th>
            <th className="border px-4 py-2">Subject Name</th>
            <th className="border px-4 py-2">Semester</th>
            <th className="border px-4 py-2">Department Name</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length > 0 ? (
            subjects.map((item, index) => (
              <tr key={item.subjectId}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{item.subject}</td>
                <td className="border px-4 py-2">{item.semId} Semester</td>
                <td className="border px-4 py-2">{item.depname}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border px-4 py-2 text-center">
                No subjects assigned.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignedSubjects;
