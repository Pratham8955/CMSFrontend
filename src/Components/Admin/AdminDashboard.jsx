import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserGraduate, FaBuilding, FaChalkboardTeacher } from "react-icons/fa";
import "../../css/Admin/Dashboard.css";

const Dashboard = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [facultyCount, setFacultyCount] = useState(0); // NEW

  useEffect(() => {
    fetchStudentCount();
    fetchDepartmentCount();
    fetchFacultyCount();
  }, []);
const fetchStudentCount = async () => {
  try {
    const res = await axios.get("https://localhost:7133/api/Student/GetStudents");
    console.log("Student API Response:", res.data);  // <-- આ ઉમેરો
    if (res.data.success && Array.isArray(res.data.student)) {
      setStudentCount(res.data.student.length);
    } else {
      console.warn("Unexpected student data structure", res.data);
    }
  } catch (error) {
    console.error(error);
  }
};


  const fetchDepartmentCount = async () => {
  try {
    const res = await axios.get("https://localhost:7133/api/Department/GetDepartment");
    if (res.data.success && Array.isArray(res.data.department)) {
      setDepartmentCount(res.data.department.length);
    } else {
      console.warn("Unexpected department data structure", res.data);
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchFacultyCount = async () => {
  try {
    const res = await axios.get("https://localhost:7133/api/Faculties/GetFaculties");
    if (res.data.success && (Array.isArray(res.data.faculty) || Array.isArray(res.data.Faculty))) {
      setFacultyCount(
        (res.data.faculty && res.data.faculty.length) ||
        (res.data.Faculty && res.data.Faculty.length) || 0
      );
    } else {
      console.warn("Unexpected faculty data structure", res.data);
    }
  } catch (error) {
    console.error(error);
  }
};

  // const fetchDepartmentCount = async () => {
  //   try {
  //     const res = await axios.get("https://localhost:7133/api/Department/GetDepartment");
  //     if (res.data.success) {
  //       setDepartmentCount(res.data.department.length);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const fetchFacultyCount = async () => {
  //   try {
  //     const res = await axios.get("https://localhost:7133/api/Faculties/GetFaculties");
  //     if (res.data.success) {
  //       setFacultyCount(res.data.faculty.length || res.data.Faculty.length);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div className="dashboard-container">
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-content">
            <h4>Total Students</h4>
            <h2>{studentCount}</h2>
          </div>
          <FaUserGraduate className="card-icon" />
        </div>

        <div className="dashboard-card">
          <div className="card-content">
            <h4>Total Departments</h4>
            <h2>{departmentCount}</h2>
          </div>
          <FaBuilding className="card-icon" />
        </div>

        <div className="dashboard-card">
          <div className="card-content">
            <h4>Total Faculties</h4>
            <h2>{facultyCount}</h2>
          </div>
          <FaChalkboardTeacher className="card-icon" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
