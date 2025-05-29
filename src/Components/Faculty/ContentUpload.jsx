import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import "../../css/Faculty/ContentUpload.css";

const MySwal = withReactContent(Swal);

const ContentUpload = () => {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const facultyId = decoded.FacultyUserId;

  const [subjects, setSubjects] = useState([]);
  const [contents, setContents] = useState([]);

  useEffect(() => {
    axios.get(`https://localhost:7133/api/FacultySubject/GetFacultySubjectsForAssignedFaculty/${facultyId}`)
      .then(response => {
        if (response.data.success) {
          setSubjects(response.data.facultySubject);
        }
      })
      .catch(error => console.error('Error fetching subjects:', error));

    fetchContents();
  }, [facultyId]);

  const fetchContents = () => {
    axios.get(`http://localhost:5291/api/CourseContent/GetByIdforFaculty/${facultyId}`)
      .then(response => {
        setContents(response.data.content);
      })
      .catch(error => {
        console.error('Error fetching contents:', error);
      });
  };

 const showForm = (mode = "add", existing = null) => {
  let formData = {
    subjectId: existing?.subjectId || '',
    title: existing?.title || '',
    description: existing?.description || '',
    pdfFile: null
  };

    MySwal.fire({
      title: mode === "edit" ? 'Edit Course Content' : 'Add Course Content',
      html: (
        <div className="swal-form-wrapper">
          <div className="form-group">
            <label>Subject</label>
            <select
              className="form-control"
              defaultValue={formData.subjectId}
              onChange={(e) => formData.subjectId = e.target.value}
            >
              <option value="">-- Select Subject --</option>
              {subjects.map((sub) => (
                <option key={sub.subjectId} value={sub.subjectId}>
                  {sub.subject} ({sub.depname} - Sem {sub.semId})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              defaultValue={formData.title}
              placeholder="Enter Title"
              onChange={(e) => formData.title = e.target.value}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows="4"
              defaultValue={formData.description}
              placeholder="Enter Description"
              onChange={(e) => formData.description = e.target.value}
            ></textarea>
          </div>

          <div className="form-group">
            <label>{mode === 'edit' ? 'Upload New PDF (optional)' : 'Upload PDF'}</label>
            <input
              type="file"
              accept=".pdf"
              className="form-control"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && file.type !== "application/pdf") {
                  Swal.showValidationMessage("Only PDF files are allowed.");
                } else {
                  formData.pdfFile = file;
                }
              }}
            />
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: mode === "edit" ? 'Update' : 'Upload',
      preConfirm: async () => {
        if (!formData.subjectId || !formData.title || !formData.description || (mode === "add" && !formData.pdfFile)) {
          Swal.showValidationMessage("Please fill all fields and select a PDF.");
          return false;
        }

        const data = new FormData();
        data.append('facultyId', facultyId);
        data.append('subjectId', formData.subjectId);
        data.append('title', formData.title);
        data.append('description', formData.description);
        if (formData.pdfFile) data.append('pdfFile', formData.pdfFile);

        try {
          Swal.showLoading();

          const url = mode === "edit"
            ? `https://localhost:7133/api/CourseContent/${existing.contentId}`
            : 'https://localhost:7133/api/CourseContent/upload-course-content';

          const method = mode === "edit" ? axios.put : axios.post;

          const response = await method(url, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          if (response.data.success) {
            Swal.fire('Success!', mode === "edit" ? 'Content updated successfully.' : 'PDF uploaded successfully.', 'success');
            fetchContents();
          } else {
            Swal.fire('Error!', response.data.message || 'Failed.', 'error');
          }
        } catch (err) {
          console.error(err);
          Swal.fire('Error!', 'Something went wrong.', 'error');
        }
      }
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This content will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`https://localhost:7133/api/CourseContent/${id}`);
        if (response.data.success) {
          Swal.fire('Deleted!', 'Content deleted successfully.', 'success');
          fetchContents();
        } else {
          Swal.fire('Error!', 'Failed to delete content.', 'error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error!', 'Something went wrong.', 'error');
      }
    }
  };

  return (
  <div className="d-flex justify-content-center">
  <div className="container " style={{ maxWidth: '1100px', width: '100%' }}>
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 className="fw-bold text-primary">Uploaded Course Contents</h2>
      <button className="btn btn-success fw-semibold" onClick={() => showForm("add")}>
        + Add
      </button>
    </div>

    {contents.length === 0 ? (
      <p className="text-center">No content uploaded yet.</p>
    ) : (
      <div className="card shadow-sm border-0 rounded-4 p-4">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-primary text-center">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Subject</th>
                <th>PDF</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contents.map((content) => (
                <tr key={content.contentId}>
                  <td>{content.title}</td>
                  <td>{content.description}</td>
                  <td>{content.subjectName}</td>
                  <td className="text-center">
                    <a
                      href={`https://localhost:7133/${content.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      View PDF
                    </a>
                  </td>
                  <td>{new Date(content.uploadDate).toLocaleDateString()}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => showForm("edit", content)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(content.contentId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
</div>

  );
};

export default ContentUpload;
