import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentForgetPass = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // Loading states
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const renderStepIndicator = () => {
    const steps = ['Send OTP', 'Verify OTP', 'Reset Password'];

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;
          return (
            <div
              key={label}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.5rem 0',
                borderBottom: isActive
                  ? '3px solid #2563eb'
                  : isCompleted
                  ? '3px solid #4ade80'
                  : '3px solid #ccc',
                color: isActive ? '#2563eb' : isCompleted ? '#4ade80' : '#888',
                fontWeight: isActive || isCompleted ? '600' : '400',
                userSelect: 'none',
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    );
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setSendingOtp(true);
    try {
      const response = await axios.post(
        'https://localhost:7133/api/CommonApi/send-otp',
        { email },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setError('');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setMessage('');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setVerifyingOtp(true);
    try {
      const response = await axios.post(
        'https://localhost:7133/api/CommonApi/verify-otp',
        { email, otp },
        { withCredentials: true }
      );
      setMessage(response.data.message);
      setError('');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
      setMessage('');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);
    setResettingPassword(true);
    try {
      const response = await axios.post(
        'https://localhost:7133/api/CommonApi/forgetPasswordStudent',
        { email, password: newPassword }
      );
      setMessage(response.data.message || 'Password updated successfully');
      setError('');
      setTimeout(() => {
        setMessage('');
        navigate('/StudentLogin');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
      setMessage('');
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f4f8',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {renderStepIndicator()}

        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#2563eb' }}>
          Student Password Reset
        </h2>

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Email:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={sendingOtp}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '5px',
                opacity: sendingOtp ? 0.6 : 1,
                cursor: sendingOtp ? 'not-allowed' : 'pointer',
              }}
            >
              {sendingOtp ? 'Sending...' : 'Send OTP'}
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
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={verifyingOtp}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '5px',
                opacity: verifyingOtp ? 0.6 : 1,
                cursor: verifyingOtp ? 'not-allowed' : 'pointer',
              }}
            >
              {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
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
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
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
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              {passwordMismatch && (
                <p style={{ color: 'red', fontSize: '0.875rem' }}>Passwords do not match.</p>
              )}
            </div>
            <button
              type="submit"
              disabled={resettingPassword}
              style={{
                width: '100%',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '5px',
                opacity: resettingPassword ? 0.6 : 1,
                cursor: resettingPassword ? 'not-allowed' : 'pointer',
              }}
            >
              {resettingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        {message && (
          <p style={{ marginTop: '1rem', color: 'green', textAlign: 'center' }}>{message}</p>
        )}
        {error && (
          <p style={{ marginTop: '1rem', color: 'red', textAlign: 'center' }}>{error}</p>
        )}
      </div>
    </div>
  );
};

export default StudentForgetPass;
