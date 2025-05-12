import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const {
    transactionId,
    student_Name,
    departmentName,
    semesterName,
    paymentDate,
    feeType,
    paidAmount,
    status,
  } = data;

  const doc = new jsPDF();

  // University Header
  doc.addImage("/image.png", "PNG", 15, 10, 25, 25); // logo

  doc.setFontSize(16);
  doc.setTextColor(51, 153, 255); // Light Blue
  doc.setFont("helvetica", "bold");
  doc.text("ICT'S Home", 45, 15);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("University Campus, Udhna-Magdalla Road, SURAT - 395007", 45, 22);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text("RECEIPT", 100, 30);

  // Transaction Details
  const yStart = 40;
  const lineHeight = 8;

  const drawLabelValue = (label, value, x, y) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, x, y);
    const labelWidth = doc.getTextWidth(label);
    doc.setFont("helvetica", "normal");
    doc.text(value, x + labelWidth + 2, y);
  };

  drawLabelValue("Transaction Id.:", transactionId, 15, yStart);
  drawLabelValue("Date:", new Date(paymentDate).toLocaleDateString(), 130, yStart);

  drawLabelValue("Received From:", student_Name, 15, yStart + lineHeight);
  drawLabelValue("Particulars:", `${departmentName} - ${semesterName}`, 15, yStart + 2 * lineHeight);

  // Fee Breakdown Table
  const feeItems = [
    { label: "Tuition Fee", amount: feeType?.tuitionFees },
    { label: "Laboratory Fee", amount: feeType?.labFees },
    { label: "Ground Fee", amount: feeType?.collegeGroundFee },
    { label: "Internal Examination", amount: feeType?.internalExam },
  ];

  const tableData = feeItems
    .filter((item) => item.amount != null)
    .map((item, index) => [index + 1, item.label, item.amount.toFixed(2)]);

  autoTable(doc, {
    startY: yStart + 3 * lineHeight + 6,
    head: [["Sr. No.", "Description", "Amount (Rs.)"]],
    body: tableData,
    theme: "grid",
    styles: { halign: "left", fontSize: 10 },
    headStyles: { fillColor: [204, 229, 255], textColor: 0 }, // Light Blue
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 120 },
      2: { cellWidth: 40, halign: "right" },
    },
  });

  const totalY = doc.lastAutoTable.finalY + 10;

  // Total Amount
  doc.setFont("helvetica", "bold");
  doc.text("Total (Rs.):", 150, totalY);
  doc.text(paidAmount.toFixed(2), 190, totalY, null, null, "right");

  // Mode of Payment
  doc.text("Mode of Payment :", 15, totalY + 10);
  doc.setFont("helvetica", "normal");
  doc.text("Online", 55, totalY + 10);

  // Save PDF
  doc.save("Fee_Receipt.pdf");
};



  if (loading) return <div>Loading student details...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Semester Fee Details</h2>
      {paymentStatus === "Paid" ? (
        <div style={{ color: "green", fontWeight: "bold" }}>
          ✅ Fees are already paid.
          <div style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "1rem", backgroundColor: "#fff" }}>
            <h3>Fee Receipt</h3>
            {paidFeeDetails ? (
              <>
                <p><strong>Transaction ID:</strong> {paidFeeDetails.transactionId}</p>
                <p><strong>Paid Amount:</strong> ₹{paidFeeDetails.paidAmount}</p>
                <p><strong>Payment Date:</strong> {new Date(paidFeeDetails.paymentDate).toLocaleString()}</p>
                <p><strong>Department:</strong> {paidFeeDetails.departmentName}</p>
                <p><strong>Semester:</strong> {paidFeeDetails.semesterName}</p>
                <p><strong>Status:</strong> {paidFeeDetails.status}</p>
                {paidFeeDetails.feeType && (
                  <>
                    <h4>Fee Breakdown</h4>
                    <ul>
                      <li>Tuition: ₹{paidFeeDetails.feeType.tuitionFees}</li>
                      <li>Lab: ₹{paidFeeDetails.feeType.labFees}</li>
                      <li>Ground: ₹{paidFeeDetails.feeType.collegeGroundFee}</li>
                      <li>Internal Exam: ₹{paidFeeDetails.feeType.internalExam}</li>
                    </ul>
                  </>
                )}
              </>
            ) : (
              <p>Loading receipt...</p>
            )}
          </div>
          <button onClick={() => generatePdf(paidFeeDetails)} className="btn btn-warning" style={{ marginTop: "1rem" }}>
            Download PDF
          </button>
        </div>
      )  : (
        <p>No fee structure found for your current semester.</p>
      )}
    </div>
  );
};

export default Fees;
