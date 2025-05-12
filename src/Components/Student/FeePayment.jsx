import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const FeePayment = () => {
    const [feeDetails, setFeeDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [processing, setProcessing] = useState(false);
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const studentId = decoded.StudentUserId;
    const navigate = useNavigate();

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    useEffect(() => {
        const fetchFeeDetails = async () => {
            try {
                const response = await axios.get(
                    `https://localhost:7133/api/FeeStructure/GetExpectedFeeStructure/${studentId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                const feeData = response.data;
                setFeeDetails(feeData);
                console.log("Fee Details:", feeData);

                // Check if already paid
                const statusResponse = await axios.get(
                    `https://localhost:7133/api/StudentFess/CheckPaymentStatus/${studentId}/${feeData.feeStructureId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (statusResponse.data.isPaid) {
                    setPaymentSuccess(true);
                }
            } catch (error) {
                console.error("Error fetching fee details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeeDetails();
    }, [studentId, token]);

    const handlePayment = async () => {
        setProcessing(true);
        const res = await loadRazorpayScript();
        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            setProcessing(false);
            return;
        }

        const amountInPaise = feeDetails.defaultAmount * 100;

        const options = {
            key: "rzp_test_mKFFsoRNrHIPv0",
            currency: "INR",
            amount: amountInPaise,
            name: "College Fee Payment",
            description: "Payment for semester fees",
            handler: async function (response) {
                const paymentData = {
                    studentId: parseInt(studentId),
                    feeStructureId: feeDetails.feeStructureId,
                    paidAmount: parseFloat(feeDetails.defaultAmount),
                    totalAmount: parseFloat(feeDetails.defaultAmount),
                    transactionId: response.razorpay_payment_id
                };

                try {
                    const result = await axios.post(
                        "https://localhost:7133/api/StudentFess/StudentFees",
                        paymentData,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                    console.log("Payment Saved:", result.data.success);
                    setPaymentSuccess(true);
                    
                } catch (err) {
                    console.error("Payment Saving Failed", err);
                    alert("Payment was successful but saving it failed.");
                } finally {
                    setProcessing(false);
                }
            },
            prefill: {
                name: "Student Name",
                email: "student@example.com",
                contact: "9999999999"
            },
            notes: {
                student_id: studentId
            },
            theme: {
                color: "#0e5cad"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    return (
        <div className="booking-page">
            <div className="payment-container">
                {loading ? (
                    <p style={{ color: 'white' }}>Loading payment details...</p>
                ) : paymentSuccess ? (
                    <div className="payment-success">
                        <h2>🎉 Payment Successful!</h2>
                        <p>Your fee payment is confirmed for:</p>
                        <p><strong>{feeDetails.departmentName}</strong> - {feeDetails.semesterName}</p>
                        <p>Thank you for your payment!</p>
                        <button className="btn btn-success" onClick={() => navigate('/student/payment')}>
    View Receipt
  </button>
                    </div>
                ) : (
                    <>
                        <h2 className="payment-title">Fee Payment</h2>
                        <div className="payment-card">
                            <p><strong>Department:</strong> {feeDetails.departmentName}</p>
                            <p><strong>Semester:</strong> {feeDetails.semesterName}</p>
                            <p><strong>Amount:</strong> ₹{feeDetails.defaultAmount}</p>
                        </div>
                        <button
                            className="payment-btn btn btn-primary"
                            onClick={handlePayment}
                            disabled={loading || paymentSuccess || processing}
                        >
                            {processing ? "Processing..." : "Pay Now"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FeePayment;
