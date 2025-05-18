import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import "../../css/Faculty/ContentUpload.css"
const AssignedSubjects = () => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const facultyId = decoded.FacultyUserId;

  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    facultyId: facultyId, 
    subjectId: '',
    title: '',
    description: '',
    pdfFile: null
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success or danger

  useEffect(() => {
    axios.get(`https://localhost:7133/api/FacultySubject/GetFacultySubjectsForAssignedFaculty/${facultyId}`)
      .then(response => {
        if (response.data.success) {
          setSubjects(response.data.facultySubject);
        }
      })
      .catch(error => {
        console.error('Error fetching subjects:', error);
      });
  }, [facultyId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'pdfFile' ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('facultyId', formData.facultyId);
    data.append('subjectId', formData.subjectId);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('pdfFile', formData.pdfFile);

    try {
      const response = await axios.post('https://localhost:7133/api/CourseContent/upload-course-content', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setMessage('PDF uploaded successfully.');
        setMessageType('success');
        setFormData({ ...formData, title: '', description: '', pdfFile: null, subjectId: '' });
      } else {
        setMessage(response.data.message);
        setMessageType('danger');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Error uploading PDF.');
      setMessageType('danger');
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 rounded-4 p-4 mx-auto assigned-subjects-card">
        <h2 className="mb-4 text-center fw-bold text-primary">Upload Course Content</h2>

        {message && (
          <div className={`alert alert-${messageType} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')} aria-label="Close"></button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="mb-3">
            <label htmlFor="subjectId" className="form-label fw-semibold">Subject</label>
            <select
              id="subjectId"
              name="subjectId"
              className="form-select"
              value={formData.subjectId}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Subject --</option>
              {subjects.map(subject => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.subject} ({subject.depname} - Sem {subject.semId})
                </option>
              ))}
            </select>
            <div className="invalid-feedback">
              Please select a subject.
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="title" className="form-label fw-semibold">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter content title"
              required
            />
            <div className="invalid-feedback">
              Title is required.
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label fw-semibold">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Write a brief description"
              required
            />
            <div className="invalid-feedback">
              Description is required.
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="pdfFile" className="form-label fw-semibold">Upload PDF</label>
            <input
              type="file"
              id="pdfFile"
              name="pdfFile"
              className="form-control"
              accept=".pdf"
              onChange={handleChange}
              required
            />
            <div className="form-text">Only PDF files are accepted.</div>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold py-2 fs-5">
            Upload
          </button>
        </form>
      </div>
    </div>
  );
};

export default AssignedSubjects;
