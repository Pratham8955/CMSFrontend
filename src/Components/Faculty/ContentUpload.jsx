import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const AssignedSubjects = () => {
    const token = localStorage.getItem("token");
          const decoded = jwtDecode(token);
          const facultytId = decoded.FacultyUserId;
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    facultyId: facultytId, 
    subjectId: '',
    title: '',
    description: '',
    pdfFile: null
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`https://localhost:7133/api/FacultySubject/GetFacultySubjectsForAssignedFaculty/${facultytId}`)
      .then(response => {
        if (response.data.success) {
          setSubjects(response.data.facultySubject);
        }
      })
      .catch(error => {
        console.error('Error fetching subjects:', error);
      });
  }, []);

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
        setFormData({ ...formData, title: '', description: '', pdfFile: null });
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Error uploading PDF.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Upload Course Content</h2>
      {message && <p className="text-red-600 mb-4">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Subject</label>
          <select
            name="subjectId"
            value={formData.subjectId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2"
          >
            <option value="">-- Select Subject --</option>
            {subjects.map(subject => (
              <option key={subject.subjectId} value={subject.subjectId}>
                {subject.subject} ({subject.depname} - Sem {subject.semId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2"
          />
        </div>

        <div>
          <label className="block">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2"
          />
        </div>

        <div>
          <label className="block">Upload PDF</label>
          <input
            type="file"
            name="pdfFile"
            accept=".pdf"
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Upload
        </button>
      </form>
    </div>
  );
};

export default AssignedSubjects;
