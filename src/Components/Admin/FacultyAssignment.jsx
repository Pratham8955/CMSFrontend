import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/FacultyAssignment.css';

const FacultyAssignment = () => {
  const [departments, setDepartments] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5291/api/Department/GetDepartment')
      .then(res => {
        if (res.data.success) {
          setDepartments(res.data.department);
        }
      });

    axios.get('http://localhost:5291/api/CommonApi/GetSemester')
      .then(res => {
        if (res.data.success) {
          setSemesters(res.data.semester);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      axios.get(`http://localhost:5291/api/FacultySubject/GetFacultyByDepartment/${selectedDepartment}`)
        .then(res => {
          if (res.data.success) {
            setFaculties(res.data.faculty);
          }
        });
    } else {
      setFaculties([]);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedDepartment && selectedSemester) {
      axios.get(`http://localhost:5291/api/FacultySubject/GetSubjectsByDepartmentAndSemester/${selectedDepartment}/${selectedSemester}`)
        .then(res => {
          if (res.data.success) {
            setSubjects(res.data.subjects);
          } else {
            setSubjects([]);
          }
        });
    } else {
      setSubjects([]);
    }
  }, [selectedDepartment, selectedSemester]);

  const handleAssignment = () => {
    if (!selectedFaculty || !selectedSubject || !selectedSemester) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please select all fields before assigning.',
      });
      return;
    }

    const payload = {
      facultyId: parseInt(selectedFaculty),
      subjectId: parseInt(selectedSubject),
      semId: parseInt(selectedSemester),
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to assign this faculty to the selected subject?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, assign it!',
      cancelButtonText: 'Cancel',
    }).then(result => {
      if (result.isConfirmed) {
        axios.post('http://localhost:5291/api/FacultySubject/AssignFacultySubject', payload)
          .then(res => {
            if (res.data.success) {
              Swal.fire({
                icon: 'success',
                title: 'Assigned!',
                text: 'Faculty assigned successfully!',
              });

              // Reset selections
              setSelectedDepartment('');
              setSelectedSemester('');
              setSelectedSubject('');
              setSelectedFaculty('');
              setSubjects([]);
              setFaculties([]);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Assignment Failed',
                text: res.data.message || 'Failed to assign faculty.',
              });
            }
          })
          .catch(err => {
            console.error("Assignment error", err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while assigning faculty.',
            });
          });
      }
    });
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">Assign Faculty to Subject</h2>
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
            disabled={!selectedFaculty || !selectedSubject || !selectedSemester}
          >
            Assign Faculty
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyAssignment;
