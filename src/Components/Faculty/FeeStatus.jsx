import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import "../../css/Faculty/FeeStatus.css";
import "bootstrap/dist/css/bootstrap.min.css";

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

  if (loading)
    return (
      <div className="loading-message">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return <div className="fee-status-error alert alert-danger">{error}</div>;

  return (
 <div>
            <h2 className="mb-4 fw-bold text-primary text-center">Fee Status</h2>
     <div className="fee-status-container">

      <table className="fee-status-table table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Semester</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Transaction ID</th>
            <th>Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {feeData.map((student) => {
            const hasFees = student.fees && student.fees.length > 0;
            const fee = hasFees ? student.fees[0] : null;

            return (
              <tr key={student.studentId}>
                <td>{student.studentId}</td>
                <td>{student.studentName}</td>
                <td>{student.currentSemester}</td>
                <td
                  className={
                    hasFees && fee.status === "Paid"
                      ? "text-primary"
                      : "text-danger"
                  }
                  style={{
                    color:
                      hasFees && fee.status === "Paid"
                        ? "#1E90FF"
                        : "#FF4C4C",
                  }}
                >
                  {hasFees ? fee.status : "Not Paid"}
                </td>
                <td>{hasFees ? fee.totalAmount : "-"}</td>
                <td>{hasFees ? fee.transactionId : "-"}</td>
                <td>
                  {hasFees
                    ? new Date(fee.paymentDate).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
 </div>
  );
};

export default FeeStatus;
