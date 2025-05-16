import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const FacultyDashboard = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const facultyId = decoded.FacultyUserId;

          // Step 1: Get department(s) using faculty ID
          const depRes = await axios.get(`https://localhost:7133/api/Department/GetDepartmentByFacultyId/${facultyId}`);
          const departments = depRes.data.department;

          if (departments && departments.length > 0) {
            const deptId = departments[0].deptId;

            // Step 2: Get department-based counts
            const countRes = await axios.get(`https://localhost:7133/api/CommonApi/departmentCounts/${deptId}`);
            setCounts(countRes.data);
          } else {
            console.error("No department found for this faculty.");
          }
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Faculty Dashboard</h2>

      {loading ? (
        <p>Loading...</p>
      ) : counts ? (
        <div className="grid gap-4 grid-cols-2">
          <div className="bg-blue-200 p-4 rounded shadow">
            <h3 className="font-semibold">Faculty Count:</h3>
            <p>{counts.countFaculty}</p>
          </div>
          <div className="bg-green-200 p-4 rounded shadow">
            <h3 className="font-semibold">Student Count:</h3>
            <p>{counts.countStudent}</p>
          </div>
          <div className="bg-yellow-200 p-4 rounded shadow">
            <h3 className="font-semibold">Paid Students:</h3>
            <p>{counts.paidCount}</p>
          </div>
          <div className="bg-red-200 p-4 rounded shadow">
            <h3 className="font-semibold">Unpaid Students:</h3>
            <p>{counts.unpaidCount}</p>
          </div>
        </div>
      ) : (
        <p>Unable to load count data.</p>
      )}
    </div>
  );
};

export default FacultyDashboard;
