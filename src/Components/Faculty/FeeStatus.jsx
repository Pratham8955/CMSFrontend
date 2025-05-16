import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import "../../css/FeeStatus.css";

const FeeStatus = () => {
  const [feeData, setFeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeeStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found.");
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const facultyId = decoded.FacultyUserId;

        const deptResponse = await axios.get(
          `https://localhost:7133/api/Department/GetDepartmentByFacultyId/${facultyId}`
        );

        if (!deptResponse.data.success || !deptResponse.data.department.length) {
          setError("Department not found.");
          setLoading(false);
          return;
        }

        const departmentId = deptResponse.data.department[0].deptId;

        const paymentResponse = await axios.get(
          `https://localhost:7133/api/StudentFess/allpaymentsByDep/${departmentId}`
        );

        if (paymentResponse.data.success) {
          setFeeData(paymentResponse.data.data);
        } else {
          setError("Failed to fetch payment data.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeeStatus();
  }, []);

  if (loading) return <div className="fee-status-container">Loading fee status...</div>;
  if (error) return <div className="fee-status-error">Error: {error}</div>;

  return (
    <div className="fee-status-container">
      <h2 className="fee-status-title">Fee Status</h2>
      <table className="fee-status-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Transaction ID</th>
            <th>Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {feeData.map((student) => (
            <tr key={student.studentId}>
              <td>{student.studentId}</td>
              <td>{student.studentName}</td>
              <td>{student.fees ? student.fees.status : "Not Paid"}</td>
              <td>{student.fees ? student.fees.totalAmount : "-"}</td>
              <td>{student.fees ? student.fees.transactionId : "-"}</td>
              <td>
                {student.fees
                  ? new Date(student.fees.paymentDate).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeeStatus;
