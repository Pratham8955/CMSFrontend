import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/FacultyAssignment.css';

const FacultyAssignment = () => {
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios.get('https://localhost:7133/api/Department/GetDepartment')
      .then(res => {
        if (res.data.success) setDepartments(res.data.department);
      });

    axios.get('https://localhost:7133/api/CommonApi/GetSemester')
      .then(res => {
        if (res.data.success) setSemesters(res.data.semester);
      });

    fetchAssignments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      axios.get(`https://localhost:7133/api/FacultySubject/GetFacultyByDepartment/${selectedDepartment}`)
        .then(res => {
          if (res.data.success) setFaculties(res.data.faculty);
        });
    } else {
      setFaculties([]);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedDepartment && selectedSemester) {
      axios.get(`https://localhost:7133/api/FacultySubject/GetSubjectsByDepartmentAndSemester/${selectedDepartment}/${selectedSemester}`)
        .then(res => {
          if (res.data.success) setSubjects(res.data.subjects);
          else setSubjects([]);
        });
    } else {
      setSubjects([]);
    }
  }, [selectedDepartment, selectedSemester]);

  const fetchAssignments = () => {
    axios.get('https://localhost:7133/api/FacultySubject/GetFacultySubjects')
      .then(res => {
        if (res.data.success) setAssignments(res.data.facultySubject);
      });
  };

  const resetForm = () => {
    setSelectedDepartment('');
    setSelectedSemester('');
    setSelectedSubject('');
    setSelectedFaculty('');
    setSubjects([]);
    setFaculties([]);
    setEditingId(null);
  };

  const handleAssignment = () => {
    if (!selectedFaculty || !selectedSubject || !selectedSemester || !selectedDepartment) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please select all fields before submitting.',
      });
      return;
    }

    const payload = {
      facultyId: parseInt(selectedFaculty),
      subjectId: parseInt(selectedSubject),
      semId: parseInt(selectedSemester),
      deptId: parseInt(selectedDepartment)
    };

    const confirmText = editingId ? 'Do you want to update this assignment?' : 'Do you want to assign this faculty to the selected subject?';

    Swal.fire({
      title: 'Are you sure?',
      text: confirmText,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: editingId ? 'Yes, update it!' : 'Yes, assign it!',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        const apiUrl = editingId
          ? `https://localhost:7133/api/FacultySubject/UpdateFacultySubject/${editingId}`
          : 'https://localhost:7133/api/FacultySubject/AssignFacultySubject';

        const apiCall = editingId
          ? axios.post(apiUrl, payload)
          : axios.post(apiUrl, payload);

        apiCall.then(res => {
          if (res.data.success || res.status === 204) {
            Swal.fire({
              icon: 'success',
              title: editingId ? 'Updated!' : 'Assigned!',
              text: editingId ? 'Assignment updated successfully!' : 'Faculty assigned successfully!',
            });
            fetchAssignments();
            resetForm();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text: res.data.message || 'Operation failed.',
            });
          }
        }).catch(() => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred during the operation.',
          });
        });
      }
    });
  };

  const handleDelete = (assignmentId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will remove the faculty assignment.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://localhost:7133/api/FacultySubject/DeleteFacultySubject/${assignmentId}`)
          .then(res => {
            if (res.status === 204) {
              Swal.fire('Deleted!', 'The assignment has been deleted.', 'success');
              fetchAssignments();
            } else {
              Swal.fire('Error', res.data.message || 'Could not delete assignment.', 'error');
            }
          });
      }
    });
  };

  const handleEdit = (assignment) => {
    console.log('Full assignment:', assignment);
    setEditingId(assignment.facultySubjectId);

    setSelectedDepartment(assignment.deptId?.toString() ?? '');
    setSelectedSemester(assignment.semId?.toString() ?? '');
    setSelectedSubject(assignment.subjectId?.toString() ?? '');
    setSelectedFaculty(assignment.facultyId?.toString() ?? '');
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">{editingId ? 'Edit Faculty Assignment' : 'Assign Faculty to Subject'}</h2>
      <div className="form-container">
        <div className="form-group">
          <label>Department</label>
          <select
            className="form-select"
            value={selectedDepartment}
            onChange={e => {
              setSelectedDepartment(e.target.value);
              setSelectedFaculty('');
              setSelectedSubject('');
            }}
          >
            <option value="">-- Select Department --</option>
            {departments.map(dept => (
              <option key={dept.deptId} value={dept.deptId}>{dept.deptName}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Semester</label>
          <select
            className="form-select"
            value={selectedSemester}
            onChange={e => {
              setSelectedSemester(e.target.value);
              setSelectedSubject('');
            }}
          >
            <option value="">-- Select Semester --</option>
            {semesters.map(sem => (
              <option key={sem.semId} value={sem.semId}>{sem.semName}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Subject</label>
          <select
            className="form-select"
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            disabled={!subjects.length}
          >
            <option value="">-- Select Subject --</option>
            {subjects.map(sub => (
              <option key={sub.subjectId} value={sub.subjectId}>{sub.subjectName}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Faculty</label>
          <select
            className="form-select"
            value={selectedFaculty}
            onChange={e => setSelectedFaculty(e.target.value)}
            disabled={!faculties.length}
          >
            <option value="">-- Select Faculty --</option>
            {faculties.map(fac => (
              <option key={fac.facultyId} value={fac.facultyId}>
                {fac.facultyName} ({fac.email})
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button
            className="admin-button"
            onClick={handleAssignment}
            disabled={!selectedFaculty || !selectedSubject || !selectedSemester || !selectedDepartment}
          >
            {editingId ? 'Update Assignment' : 'Assign Faculty'}
          </button>
          {editingId && (
            <button className="admin-button cancel-button" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <h3 className="admin-subtitle">Existing Faculty Assignments</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Semester</th>
            <th>Subject</th>
            <th>Faculty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignments.length === 0 ? (
            <tr><td colSpan="5">No assignments found.</td></tr>
          ) : (
            assignments.map((item, index) => (
              <tr key={index}>
                <td>{item.depname}</td>
                <td>{item.semId}</td>
                <td>{item.subjectName}</td>
                <td>{item.facultyName}</td>
                <td>
                  <button
                    className="admin-button edit-button"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-button delete-button"
                    onClick={() => handleDelete(item.facultySubjectId)}
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

export default FacultyAssignment;
