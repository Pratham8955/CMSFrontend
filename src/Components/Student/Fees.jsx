import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaFileInvoiceDollar,
  FaDownload,
  FaCheckCircle,
  FaUniversity,
  FaReceipt,
  FaCalendarAlt,
  FaCreditCard
} from "react-icons/fa";
import "../../css/Student/Fees.css";
import { API_BASE_URL } from "../../config/api";

// Helper to convert number to words
const numberToWords = (num) => {
  if (!num || isNaN(num)) return "";
  const a = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten ",
    "Eleven ",
    "Twelve ",
    "Thirteen ",
    "Fourteen ",
    "Fifteen ",
    "Sixteen ",
    "Seventeen ",
    "Eighteen ",
    "Nineteen "
  ];
  const b = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety"
  ];

  const inWords = (n) => {
    if ((n = n.toString()).length > 9) return "";
    let n_array = ("000000000" + n)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n_array) return "";
    let str = "";
    str +=
      Number(n_array[1]) !== 0
        ? (a[Number(n_array[1])] || b[n_array[1][0]] + " " + a[n_array[1][1]]) +
          "Crore "
        : "";
    str +=
      Number(n_array[2]) !== 0
        ? (a[Number(n_array[2])] || b[n_array[2][0]] + " " + a[n_array[2][1]]) +
          "Lakh "
        : "";
    str +=
      Number(n_array[3]) !== 0
        ? (a[Number(n_array[3])] || b[n_array[3][0]] + " " + a[n_array[3][1]]) +
          "Thousand "
        : "";
    str +=
      Number(n_array[4]) !== 0
        ? (a[Number(n_array[4])] || b[n_array[4][0]] + " " + a[n_array[4][1]]) +
          "Hundred "
        : "";
    str +=
      Number(n_array[5]) !== 0
        ? (str !== "" ? "and " : "") +
          (a[Number(n_array[5])] || b[n_array[5][0]] + " " + a[n_array[5][1]])
        : "";
    return str.trim();
  };

  const integerPart = Math.floor(num);
  const words = inWords(integerPart);
  return words ? words + " Rupees Only" : "";
};

const Fees = () => {
  const [student, setStudent] = useState(null);
  const [feeStructure, setFeeStructure] = useState(null);
  const [departmentName, setDepartmentName] = useState("Loading...");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paidFeeDetails, setPaidFeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const API_BASE = API_BASE_URL;

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
  }, [API_BASE]);

  useEffect(() => {
    if (student && student.deptId) {
      axios
        .get(`${API_BASE}/Department/GetDepartmentById/${student.deptId}`)
        .then((res) => {
          if (res.data.success && res.data.department) {
            setDepartmentName(res.data.department.deptName);
          }
        })
        .catch(() => setDepartmentName("N/A"));
    }
  }, [student, API_BASE]);

  useEffect(() => {
    if (student && student.deptId && student.currentSemester) {
      axios
        .get(
          `${API_BASE}/FeeStructure/getFeeStructurebydepandsem/${student.deptId}/${student.currentSemester}`
        )
        .then((res) => {
          const list = res.data.feeStruct || res.data.FeeStruct;
          if (res.data.success && Array.isArray(list) && list.length > 0) {
            setFeeStructure(list[0]);
          }
        })
        .catch(() => {
          axios
            .get(`${API_BASE}/FeeStructure/GetExpectedFeeStructure/${student.studentId}`)
            .then((res) => {
              if (res.data) setFeeStructure(res.data);
            })
            .catch(console.error);
        });
    }
  }, [student, API_BASE]);

  useEffect(() => {
    if (student && feeStructure) {
      axios
        .get(
          `${API_BASE}/StudentFess/CheckPaymentStatus/${student.studentId}/${feeStructure.feeStructureId}`
        )
        .then((res) => {
          setPaymentStatus(res.data.isPaid ? "Paid" : "Unpaid");
        })
        .catch(() => setError("Failed to check payment status."));
    }
  }, [student, feeStructure, API_BASE]);

  useEffect(() => {
    if (student) {
      axios
        .get(`${API_BASE}/StudentFess/GetStudentFee/${student.studentId}`)
        .then((res) => {
          if (res.data && res.data.status === "Paid") {
            setPaymentStatus("Paid");
            setPaidFeeDetails(res.data);
          }
        })
        .catch(() => {});
    }
  }, [student, API_BASE]);

  // Generate High Quality PDF Receipt
  const generatePdf = (data) => {
    if (!data) return;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Elegant Outer Double Border
    doc.setDrawColor(203, 213, 225); // Slate 300
    doc.setLineWidth(0.8);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.setLineWidth(0.3);
    doc.rect(9.5, 9.5, pageWidth - 19, pageHeight - 19);

    // 2. Top Header Accent Bar
    doc.setFillColor(26, 54, 93); // Deep Navy Blue
    doc.rect(10, 10, pageWidth - 20, 4, "F");

    // 3. Institution Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(26, 54, 93);
    doc.text("INSTITUTE OF COMPUTER TECHNOLOGY", pageWidth / 2, 22, {
      align: "center"
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(
      "University Campus, Udhna-Magdalla Road, Surat - 395007, Gujarat, India",
      pageWidth / 2,
      28,
      { align: "center" }
    );
    doc.text(
      "Affiliated to State University  •  Accredited 'A' Grade by NAAC  •  www.ictcampus.edu.in",
      pageWidth / 2,
      33,
      { align: "center" }
    );

    // Divider Line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, 37, pageWidth - 14, 37);

    // 4. Receipt Title & Status Badge
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, 40, pageWidth - 28, 11, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("OFFICIAL FEE RECEIPT (STUDENT COPY)", 20, 47.5);

    // PAID Badge (Green Pill)
    doc.setFillColor(220, 252, 231); // Green 100
    doc.roundedRect(pageWidth - 46, 42, 28, 7, 3, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(22, 101, 52); // Green 800
    doc.text("PAID", pageWidth - 32, 47, { align: "center" });

    // 5. Metadata Details Box (2 Columns)
    const formattedDate = data.paymentDate
      ? new Date(data.paymentDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        })
      : new Date().toLocaleDateString("en-GB");

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 55, pageWidth - 28, 32, 2, 2, "F");
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, 55, pageWidth - 28, 32, 2, 2, "D");

    // Column 1 (Left)
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("Receipt / Trans. ID:", 20, 63);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(String(data.transactionId || "N/A"), 58, 63);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("Student Name:", 20, 71);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(String(data.student_Name || "N/A"), 58, 71);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("Course & Particulars:", 20, 79);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(
      `${data.departmentName || "Course"} - ${data.semesterName || "Semester"}`,
      58,
      79
    );

    // Column 2 (Right)
    const col2X = pageWidth / 2 + 10;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("Payment Date:", col2X, 63);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(formattedDate, col2X + 32, 63);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("Payment Mode:", col2X, 71);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text("Online (Electronic Transfer)", col2X + 32, 71);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 116, 139);
    doc.text("Payment Status:", col2X, 79);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 101, 52);
    doc.text("Completed / Verified", col2X + 32, 79);

    // 6. Fee Component Table
    const paidAmount = Number(data.paidAmount) || 0;
    const paidTuitionFee = (paidAmount * 0.5).toFixed(2);
    const paidLabFees = (paidAmount * 0.2).toFixed(2);
    const paidGroundFee = (paidAmount * 0.15).toFixed(2);
    const paidInternalExam = (paidAmount * 0.15).toFixed(2);
    const totalPaidFormatted = paidAmount.toFixed(2);

    autoTable(doc, {
      startY: 92,
      margin: { left: 14, right: 14 },
      head: [["#", "Fee Description / Component", "Semester", "Amount (INR)"]],
      body: [
        ["1", "Tuition Fee", data.semesterName || "Semester", `Rs. ${Number(paidTuitionFee).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`],
        ["2", "Laboratory & Practical Fee", data.semesterName || "Semester", `Rs. ${Number(paidLabFees).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`],
        ["3", "Sports & Ground Infrastructure Fee", data.semesterName || "Semester", `Rs. ${Number(paidGroundFee).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`],
        ["4", "Internal Examination & Assessment Fee", data.semesterName || "Semester", `Rs. ${Number(paidInternalExam).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`],
      ],
      theme: "plain",
      headStyles: {
        fillColor: [26, 54, 93], // Deep Navy
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9.5,
        halign: "left",
        cellPadding: 3.5,
      },
      columnStyles: {
        0: { halign: "center", cellWidth: 14 },
        1: { halign: "left", cellWidth: "auto" },
        2: { halign: "center", cellWidth: 32 },
        3: { halign: "right", cellWidth: 38, fontStyle: "bold" },
      },
      bodyStyles: {
        textColor: [30, 41, 59],
        fontSize: 9,
        cellPadding: 3.5,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      tableLineColor: [226, 232, 240],
      tableLineWidth: 0.3,
    });

    const finalY = doc.lastAutoTable.finalY + 4;

    // 7. Total Summary Card Box
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, finalY, pageWidth - 28, 19, 2, 2, "F");
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, finalY, pageWidth - 28, 19, 2, 2, "D");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text("TOTAL AMOUNT PAID:", 20, finalY + 7);

    doc.setFontSize(11.5);
    doc.setTextColor(26, 54, 93);
    doc.text(
      `Rs. ${Number(totalPaidFormatted).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      pageWidth - 20,
      finalY + 7,
      { align: "right" }
    );

    // Amount in Words (with auto line wrap)
    const words = numberToWords(paidAmount);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const splitWords = doc.splitTextToSize(`Amount in Words: ${words}`, pageWidth - 42);
    doc.text(splitWords, 20, finalY + 13);

    // 8. Official Seal & Signatory Box
    const signY = finalY + 30;

    // Digital Verification Seal
    const sealX = 14;
    const sealW = 66;
    const sealCenter = sealX + sealW / 2;
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.5);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(sealX, signY - 7, sealW, 22, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text("ICT ACCOUNTS DEPARTMENT", sealCenter, signY - 1.5, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(22, 101, 52);
    doc.text("VERIFIED & RECORDED", sealCenter, signY + 3.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Official Electronic Verification`, sealCenter, signY + 8.5, { align: "center" });

    // Authorized Signatory
    const sigX = pageWidth - 65;
    doc.setDrawColor(100, 116, 139);
    doc.setLineWidth(0.4);
    doc.line(sigX, signY + 6, sigX + 45, signY + 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Finance & Accounts Officer", sigX + 22.5, signY + 11, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Authorized Signatory", sigX + 22.5, signY + 15, { align: "center" });

    // 9. Disclaimer Footer
    const footerY = pageHeight - 16;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "* This is a computer-generated official receipt and does not require a physical signature.",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );
    doc.text(
      "Please retain this copy for all future academic and examination references.",
      pageWidth / 2,
      footerY + 4,
      { align: "center" }
    );

    // Save File
    doc.save(`Fee_Receipt_${data.student_Name || "Student"}_${data.semesterName || "Sem"}.pdf`);
  };

  if (loading)
    return <div className="loading-message text-center py-5">Loading fee details...</div>;
  if (error)
    return <div className="error-message text-center py-5 text-danger">{error}</div>;

  return (
    <div className="fee-receipt-wrapper">
      {paymentStatus === "Paid" && paidFeeDetails ? (
        <div className="receipt-card-container">
          {/* Top Download Bar */}
          <div className="receipt-action-bar">
            <div className="receipt-status-pill">
              <FaCheckCircle className="text-success me-2" />
              <span>Payment Completed & Verified</span>
            </div>
            <button
              onClick={() => generatePdf(paidFeeDetails)}
              className="btn btn-download-receipt"
            >
              <FaDownload className="me-2" />
              Download Official PDF Receipt
            </button>
          </div>

          {/* On-Screen Clean Receipt Card */}
          <div className="official-receipt-card">
            {/* Header */}
            <div className="receipt-header-box">
              <div className="receipt-inst-logo">
                <FaUniversity size={36} className="text-primary" />
              </div>
              <div className="receipt-inst-info">
                <h3>INSTITUTE OF COMPUTER TECHNOLOGY</h3>
                <p className="inst-address">
                  University Campus, Udhna-Magdalla Road, Surat - 395007, Gujarat
                </p>
                <p className="inst-sub">
                  Affiliated to State University • Accredited 'A' Grade by NAAC
                </p>
              </div>
            </div>

            <div className="receipt-title-strip">
              <h4>
                <FaReceipt className="me-2" />
                FEE RECEIPT (STUDENT COPY)
              </h4>
              <span className="badge-paid">PAID</span>
            </div>

            {/* Metadata Grid */}
            <div className="receipt-meta-grid">
              <div className="meta-item">
                <span className="meta-label">Transaction ID:</span>
                <span className="meta-val font-mono">{paidFeeDetails.transactionId || "N/A"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Payment Date:</span>
                <span className="meta-val">
                  {paidFeeDetails.paymentDate
                    ? new Date(paidFeeDetails.paymentDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Received From:</span>
                <span className="meta-val text-capitalize">{paidFeeDetails.student_Name || "N/A"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Payment Mode:</span>
                <span className="meta-val">Online (Razorpay Verified)</span>
              </div>
              <div className="meta-item full-width">
                <span className="meta-label">Particulars:</span>
                <span className="meta-val">
                  {paidFeeDetails.departmentName} - {paidFeeDetails.semesterName || "N/A"}
                </span>
              </div>
            </div>

            {/* Breakdown Table */}
            <div className="receipt-table-wrapper">
              <table className="receipt-table">
                <thead>
                  <tr>
                    <th style={{ width: "60px", textAlign: "center" }}>#</th>
                    <th>Fee Component</th>
                    <th style={{ textAlign: "center" }}>Semester</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ textAlign: "center" }}>1</td>
                    <td>Tuition Fee</td>
                    <td style={{ textAlign: "center" }}>{paidFeeDetails.semesterName}</td>
                    <td style={{ textAlign: "right" }}>
                      ₹{(paidFeeDetails.paidAmount * 0.5).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "center" }}>2</td>
                    <td>Laboratory & Practical Fee</td>
                    <td style={{ textAlign: "center" }}>{paidFeeDetails.semesterName}</td>
                    <td style={{ textAlign: "right" }}>
                      ₹{(paidFeeDetails.paidAmount * 0.2).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "center" }}>3</td>
                    <td>Sports & Ground Infrastructure Fee</td>
                    <td style={{ textAlign: "center" }}>{paidFeeDetails.semesterName}</td>
                    <td style={{ textAlign: "right" }}>
                      ₹{(paidFeeDetails.paidAmount * 0.15).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: "center" }}>4</td>
                    <td>Internal Examination & Assessment Fee</td>
                    <td style={{ textAlign: "center" }}>{paidFeeDetails.semesterName}</td>
                    <td style={{ textAlign: "right" }}>
                      ₹{(paidFeeDetails.paidAmount * 0.15).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td colSpan="3" style={{ textAlign: "right" }}>
                      <strong>Total Amount Paid:</strong>
                    </td>
                    <td style={{ textAlign: "right" }} className="total-amount">
                      ₹{Number(paidFeeDetails.paidAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Amount in words & Note */}
            <div className="receipt-words-box">
              <span className="words-label">Amount in Words:</span>
              <span className="words-val">{numberToWords(paidFeeDetails.paidAmount)}</span>
            </div>

            {/* Footer Signatures */}
            <div className="receipt-footer-strip">
              <div className="verification-stamp">
                <FaCheckCircle className="text-success me-1" />
                <span>ICT ACCOUNTS VERIFIED</span>
              </div>
              <div className="signatory-box">
                <div className="sign-line"></div>
                <span>Finance & Accounts Officer</span>
              </div>
            </div>

            <p className="computer-note">
              * This is a computer-generated official receipt. No physical signature is required.
            </p>
          </div>
        </div>
      ) : (
        <div className="unpaid-fee-card">
          <FaFileInvoiceDollar size={48} className="text-primary mb-3" />
          <h3>Semester Fee Status</h3>
          <p className="text-muted">
            {paymentStatus === "Unpaid"
              ? "You have pending fees for the current semester."
              : "No fee structure found for your current semester."}
          </p>
          {paymentStatus === "Unpaid" && (
            <button
              onClick={() => navigate("/student/payment")}
              className="btn btn-primary px-4 py-2 mt-2"
            >
              <FaCreditCard className="me-2" />
              Proceed to Fee Payment
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Fees;
