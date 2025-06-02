import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import "../../css/Student/FeePayment.css"
const FeePayment = () => {
  const [feeDetails, setFeeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const studentId = decoded.StudentUserId;
  const navigate = useNavigate();

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  useEffect(() => {
    const fetchFeeDetails = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7133/api/FeeStructure/GetExpectedFeeStructure/${studentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const feeData = response.data;
        setFeeDetails(feeData);

        const statusResponse = await axios.get(
          `https://localhost:7133/api/StudentFess/CheckPaymentStatus/${studentId}/${feeData.feeStructureId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (statusResponse.data.isPaid) setPaymentSuccess(true);
      } catch (error) {
        console.error('Error fetching fee details:', error);
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
      alert('Razorpay SDK failed to load. Are you online?');
      setProcessing(false);
      return;
    }

    const amountInPaise = feeDetails.defaultAmount * 100;

    const options = {
      key: 'rzp_test_OQk3ZHzJNycYA8',
      currency: 'INR',
      amount: amountInPaise,
      name: 'College Fee Payment',
      description: 'Payment for semester fees',
      handler: async function (response) {
        const paymentData = {
          studentId: parseInt(studentId),
          feeStructureId: feeDetails.feeStructureId,
          paidAmount: parseFloat(feeDetails.defaultAmount),
          totalAmount: parseFloat(feeDetails.defaultAmount),
          transactionId: response.razorpay_payment_id,
        };

        try {
          await axios.post(
            'https://localhost:7133/api/StudentFess/StudentFees',
            paymentData,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setPaymentSuccess(true);
        } catch (err) {
          alert('Payment was successful but saving it failed.');
          console.error('Payment Saving Failed', err);
        } finally {
          setProcessing(false);
        }
      },
      prefill: {
        name: 'Student Name',
        email: 'student@example.com',
        contact: '9999999999',
      },
      notes: {
        student_id: studentId,
      },
      theme: {
        color: '#0e5cad',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="fee-payment-wrapper">
      <div className="fee-payment-card shadow-lg">
        {loading ? (
          <div className="loading-state">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading fee details...</p>
          </div>
        ) : paymentSuccess ? (
          <div className="payment-success">
            <div className="success-icon mb-3">✅</div>
            <h2>Payment Successful!</h2>
            <p className="mb-1">
              Your payment for <strong>{feeDetails.departmentName}</strong> -{' '}
              <strong>{feeDetails.semesterName}</strong> has been confirmed.
            </p>
            <button
              className="btn btn-outline-success mt-4"
              onClick={() => navigate('/student/payment')}
            >
              View Receipt
            </button>
          </div>
        ) : (
          <>
            <h1 className="title text-center mb-4">Fee Payment</h1>



            <div className="payment-info mb-4">

              <p>
                <strong>Department:</strong> {feeDetails.departmentName}
              </p>
              <p>
                <strong>Semester:</strong> {feeDetails.semesterName}
              </p>
              <p>
                <strong>Amount:</strong> ₹{feeDetails.defaultAmount}
              </p>
            </div>

            <button
              className="btn btn-gradient btn-lg w-100"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Processing...
                </>
              ) : (
                'Pay Now'
              )}
            </button>
          </>

        )}
      </div>
    </div>
  );
};

export default FeePayment;
