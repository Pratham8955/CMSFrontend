import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../css/Student/Fees.css"; // Import the new CSS file

const Fees = () => {
  const [student, setStudent] = useState(null);
  const [feeStructure, setFeeStructure] = useState(null);
  const [departmentName, setDepartmentName] = useState("Loading...");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paidFeeDetails, setPaidFeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const API_BASE = "https://localhost:7133/api";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found.");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const studentId = decoded.StudentUserId;

      axios
        .get(`${API_BASE}/Student/getStudentsById/${studentId}`)
        .then((res) => {
          if (res.data.success && res.data.student?.length > 0) {
            setStudent(res.data.student[0]);
          } else {
            setError("Student data not found.");
          }
        })
        .catch(() => setError("Failed to fetch student data."))
        .finally(() => setLoading(false));
    } catch {
      setError("Invalid token.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (student?.deptId && student?.currentSemester) {
      const feeUrl = `${API_BASE}/FeeStructure/getFeeStructurebydepandsem/${student.deptId}/${student.currentSemester}`;
      const deptUrl = `${API_BASE}/Department/GetDepartmentById/${student.deptId}`;

      axios
        .get(feeUrl)
        .then((res) => {
          if (res.data.success && res.data.feeStruct?.length > 0) {
            setFeeStructure(res.data.feeStruct[0]);
          } else {
            setFeeStructure(null);
          }
        })
        .catch(() => setError("Failed to fetch fee structure."));

      axios
        .get(deptUrl)
        .then((res) => {
          const name = res.data.department?.[0]?.deptName || "Unknown";
          setDepartmentName(name);
        })
        .catch(() => setDepartmentName("Unknown"));
    }
  }, [student]);

  useEffect(() => {
    if (student && feeStructure) {
      axios
        .get(`${API_BASE}/StudentFess/CheckPaymentStatus/${student.studentId}/${feeStructure.feeStructureId}`)
        .then((res) => {
          setPaymentStatus(res.data.isPaid ? "Paid" : "Unpaid");
        })
        .catch(() => setError("Failed to check payment status."));
    }
  }, [student, feeStructure]);

  useEffect(() => {
    if (paymentStatus === "Paid" && student) {
      axios
        .get(`${API_BASE}/StudentFess/GetStudentFee/${student.studentId}`)
        .then((res) => setPaidFeeDetails(res.data))
        .catch(() => setError("Failed to fetch paid fee details."));
    }
  }, [paymentStatus, student]);

  const generatePdf = (data) => {
    if (!data) return;
    const doc = new jsPDF();
    doc.text("Fee Receipt", 20, 20);
    autoTable(doc, {
      head: [["Description", "Amount (Rs.)"]],
      body: [
        ["Tuition Fee", data.feeType.tuitionFees],
        ["Lab Fee", data.feeType.labFees],
        ["Ground Fee", data.feeType.collegeGroundFee],
        ["Internal Exam", data.feeType.internalExam],
      ],
    });
    doc.save("Fee_Receipt.pdf");
  };

  if (loading) return <div className="loading-message">Loading student details...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container">
      <div className="fees-header">Semester Fee Details</div>
      {paymentStatus === "Paid" ? (
        <div className="alert alert-info">
          ✅ Fees are already paid.
          <div className="card receipt-card">
            <div className="card-body">
              <h5 className="card-title">Fee Receipt</h5>
              {paidFeeDetails ? (
                <>
                  <p><strong>Transaction ID:</strong> {paidFeeDetails.transactionId}</p>
                  <p><strong>Paid Amount:</strong> ₹{paidFeeDetails.paidAmount}</p>
                  <p><strong>Payment Date:</strong> {new Date(paidFeeDetails.paymentDate).toLocaleString()}</p>
                  <p><strong>Department:</strong> {paidFeeDetails.departmentName}</p>
                  <p><strong>Semester:</strong> {paidFeeDetails.semesterName}</p>
                  <p><strong>Status:</strong> {paidFeeDetails.status}</p>

                  <h6 className="mt-3">Fee Breakdown</h6>
                  <table className="table table-bordered mt-2">
                    <thead className="thead-dark">
                      <tr>
                        <th>Description</th>
                        <th>Amount (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td>Tuition Fee</td><td>₹{paidFeeDetails.feeType.tuitionFees}</td></tr>
                      <tr><td>Lab Fee</td><td>₹{paidFeeDetails.feeType.labFees}</td></tr>
                      <tr><td>Ground Fee</td><td>₹{paidFeeDetails.feeType.collegeGroundFee}</td></tr>
                      <tr><td>Internal Exam</td><td>₹{paidFeeDetails.feeType.internalExam}</td></tr>
                    </tbody>
                  </table>
                </>
              ) : (
                <p>Loading receipt...</p>
              )}
            </div>
            <button
              onClick={() => generatePdf(paidFeeDetails)}
              className="btn btn-primary download-btn"
            >
              📄 Download Fee Receipt
            </button>
          </div>
        </div>
      ) : (
        <p className="alert alert-warning">No fee structure found for your current semester.</p>
      )}
    </div>
  );
};

export default Fees;
