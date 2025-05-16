import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentForgetPass = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://localhost:7133/api/CommonApi/send-otp', 
        { email },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setError('');
      setStep(2);  // Move to step 2 (Verify OTP)
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setMessage('');
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://localhost:7133/api/CommonApi/verify-otp', 
        { email, otp },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setError('');
      setStep(3);  // Move to step 3 (Reset Password)
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
      setMessage('');
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);

    try {
      const response = await axios.post(
        'https://localhost:7133/api/CommonApi/forgetPasswordStudent', 
        { email, password: newPassword }
      );
      setMessage(response.data.message || 'Password updated successfully');
      setError('');
      // Clear message after 3 seconds and redirect
      setTimeout(() => {
        setMessage('');
        navigate('/StudentLogin');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
      setMessage('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f4f8' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#2563eb' }}>Student Password Reset</h2>

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Email:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
            <button type="submit" style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.75rem', border: 'none', borderRadius: '5px' }}>
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Enter OTP:</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
            <button type="submit" style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.75rem', border: 'none', borderRadius: '5px' }}>
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: '1rem' }}>
              <label>New Password:</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordMismatch(false);
                }}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label>Confirm Password:</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordMismatch(false);
                }}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              {passwordMismatch && <p style={{ color: 'red', fontSize: '0.875rem' }}>Passwords do not match.</p>}
            </div>
            <button type="submit" style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '0.75rem', border: 'none', borderRadius: '5px' }}>
              Update Password
            </button>
          </form>
        )}

        {message && <p style={{ marginTop: '1rem', color: 'green', textAlign: 'center' }}>{message}</p>}
        {error && <p style={{ marginTop: '1rem', color: 'red', textAlign: 'center' }}>{error}</p>}
      </div>
    </div>
  );
};

export default StudentForgetPass;
