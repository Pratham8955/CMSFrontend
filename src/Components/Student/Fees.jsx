import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../../css/Student/Fees.css";

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

    doc.setFontSize(16);
    doc.setTextColor(41, 98, 255);
    doc.text("ICT'S Home", 105, 20, null, null, "center");

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text("University Campus, Udhna-Magdalla Road, SURAT - 395007", 105, 28, null, null, "center");

    doc.setFontSize(14);
    doc.text("RECEIPT", 105, 38, null, null, "center");

    doc.setFontSize(11);

    // Bold label, normal value
    doc.setFont("helvetica", "bold");
    doc.text("Transaction Id.:", 15, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`${data.transactionId}`, 55, 50);

    doc.setFont("helvetica", "bold");
    doc.text("Date:", 155, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`${new Date(data.paymentDate).toLocaleDateString()}`, 165, 50);

    doc.setFont("helvetica", "bold");
    doc.text("Received From:", 15, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`${data.student_Name || "N/A"}`, 55, 60);

    doc.setFont("helvetica", "bold");
    doc.text("Particulars:", 15, 70);
    doc.setFont("helvetica", "normal");
    doc.text(`${data.departmentName}-${data.semesterName}`, 55, 70);


    const paidAmount = Number(data.paidAmount);

    const percentTuition = 0.5;
    const percentLab = 0.2;
    const percentGround = 0.15;
    const percentInternal = 0.15;

    const paidTuitionFee = paidAmount * percentTuition;
    const paidLabFees = paidAmount * percentLab;
    const paidGroundFee = paidAmount * percentGround;
    const paidInternalExam = paidAmount * percentInternal;

    const totalPaid = paidTuitionFee + paidLabFees + paidGroundFee + paidInternalExam;

    autoTable(doc, {
      startY: 80,
      head: [["Sr. No.", "Description", "Amount (Rs.)"]],
      body: [
        ["1", "Tuition Fee", paidTuitionFee],
        ["2", "Laboratory Fee", paidLabFees],
        ["3", "Ground Fee", paidGroundFee],
        ["4", "Internal Examination", paidInternalExam],
      ],
      styles: { halign: 'center' },
      headStyles: {
        fillColor: [200, 220, 255],
        textColor: 0,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { halign: 'center' },
        1: { halign: 'center' },
        2: { halign: 'center' },
      },
    });

    // Add Total outside the table, aligned to the right
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Total (Rs.):", 138, finalY);
    doc.setFont("helvetica", "normal");
    doc.text(`${totalPaid.toFixed(2)}`, 175, finalY, { align: "right" });

    // Payment Mode
    doc.setFont("helvetica", "bold");
    doc.text("Mode of Payment :", 15, finalY + 10);
    doc.setFont("helvetica", "normal");
    doc.text("Online", 55, finalY + 10);

    doc.save("Fee_Receipt.pdf");
  };


  if (loading) return <div className="loading-message">Loading student details...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="container">
      {paymentStatus === "Paid" ? (
        <div>
          <div className="receipt-box">
            {paidFeeDetails ? (
              <>
                <div className="receipt-header">
                  <h4>ICT'S Home</h4>
                  <div className="sub-address">University Campus, Udhna-Magdalla Road, SURAT - 395007</div>
                  <h5>RECEIPT</h5>
                </div>

                <div className="receipt-body">
                  <div className="receipt-row">
                    <span className="label">Transaction Id.:</span>
                    <span className="value">{paidFeeDetails.transactionId || "N/A"}</span>
                  </div>
                  <div className="receipt-row">
                    <span className="label">Received From:</span>
                    <span className="value">{paidFeeDetails.student_Name || "N/A"}</span>
                  </div>
                  <div className="receipt-row">
                    <span className="label">Particulars:</span>
                    <span className="value"> {paidFeeDetails.departmentName}-{paidFeeDetails.semesterName || "N/A"}</span>
                  </div>

                  <table className="table table-bordered receipt-table mt-3">
                    <thead className="thead-light">
                      <tr>
                        <th>Sr. No.</th>
                        <th>Description</th>
                        <th className="text-right">Amount (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Tuition Fee </td>
                        <td className="text-right">
                          ₹{(paidFeeDetails.paidAmount * 0.5).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Laboratory Fee </td>
                        <td className="text-right">
                          ₹{(paidFeeDetails.paidAmount * 0.2).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>Ground Fee </td>
                        <td className="text-right">
                          ₹{(paidFeeDetails.paidAmount * 0.15).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>Internal Examination</td>
                        <td className="text-right">
                          ₹{(paidFeeDetails.paidAmount * 0.15).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>

                    <tfoot>
                      <tr>
                        <td colSpan="2" className="text-right">
                          <strong>Total (Rs.):</strong>
                        </td>
                        <td className="text-right">
                          <strong>₹{Number(paidFeeDetails.paidAmount).toFixed(2)}</strong>
                        </td>
                      </tr>
                    </tfoot>
                  </table>

                  <div className="mt-2">
                    <strong>Mode of Payment:</strong> Online
                  </div>
                </div>

                <div className="text-right mt-3">
                  <button onClick={() => generatePdf(paidFeeDetails)} className="btn btn-primary">
                    📄 Download Fee Receipt
                  </button>
                </div>
              </>
            ) : (
              <p>Loading receipt...</p>
            )}
          </div>
        </div>
      ) : (
        <p className="alert alert-warning">No fee structure found for your current semester.</p>
      )}
    </div>
  );
};

export default Fees;
