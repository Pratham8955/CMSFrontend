import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const FacultyForgetPass = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 digits array
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [otpTryCount, setOtpTryCount] = useState(0);
  const maxOtpTries = 3;

  const otpRefs = useRef([]);

  // Clear OTP inputs whenever step changes to 2 (OTP verification step)
  useEffect(() => {
    if (step === 2) {
      setOtp(['', '', '', '', '', '']);
    }
  }, [step]);

  // Handle OTP input changes with immediate invalid input clearing
  const handleOtpChange = (e, index) => {
    const val = e.target.value;
    if (/^\d?$/.test(val)) {
      // Accept only one digit or empty
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);

      if (val && index < 5) {
        otpRefs.current[index + 1].focus();
      }
    } else {
      // Clear invalid input immediately
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const otpString = otp.join('');

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'https://localhost:7133/api/CommonApi/send-otp',
        { email },
        { withCredentials: true }
      );
      Swal.fire('Success', response.data.message, 'success');
      setStep(2);
      setOtpTryCount(0);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to send OTP', 'error');
    }
    setLoading(false);
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otpString.length !== 6) {
      Swal.fire('Error', 'Please enter all 6 digits of the OTP', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        'https://localhost:7133/api/CommonApi/verify-otp',
        { email, otp: otpString },
        { withCredentials: true }
      );
      Swal.fire('Success', response.data.message, 'success');
      setStep(3);
    } catch (err) {
      const tries = otpTryCount + 1;
      setOtpTryCount(tries);
      if (tries >= maxOtpTries) {
        Swal.fire(
          'Failed',
          `You have reached maximum attempts (${maxOtpTries}). Please resend OTP.`,
          'error'
        );
      } else {
        Swal.fire(
          'Error',
          `Invalid or expired OTP. You have ${maxOtpTries - tries} attempt(s) left.`,
          'error'
        );
      }
      setOtp(['', '', '', '', '', '']); // clear otp inputs on invalid attempt
      otpRefs.current[0]?.focus();
    }
    setLoading(false);
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setPasswordMismatch(false);

    setResetLoading(true);
    try {
      const response = await axios.post(
        'https://localhost:7133/api/CommonApi/forgetPasswordFaculty',
        {
          email,
          password: newPassword,
        }
      );
      Swal.fire('Success', response.data.message || 'Password updated successfully', 'success');
      setTimeout(() => {
        navigate('/AdminandFacultyLogin');
      }, 2000);
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to update password', 'error');
    }
    setResetLoading(false);
  };

  // Step progress indicator component
  const renderStepIndicator = () => {
    const steps = ['Send OTP', 'Verify OTP', 'Reset Password'];

    return (
      <div className="d-flex justify-content-between mb-3">
        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;

          return (
            <div
              key={label}
              className={`flex-fill text-center pb-2 border-bottom ${
                isActive
                  ? 'border-primary fw-bold text-primary'
                  : isCompleted
                  ? 'border-success text-success'
                  : 'border-secondary text-muted'
              }`}
              style={{ cursor: 'default', userSelect: 'none' }}
            >
              {label}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-light min-vh-100 d-flex justify-content-center align-items-center p-3">
      <div className="card shadow-sm p-4" style={{ maxWidth: '420px', width: '100%' }}>
        {renderStepIndicator()}

        <h3 className="text-primary text-center mb-4 fw-bold">Faculty Password Reset</h3>

        {/* Step 1: Send OTP */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <>
            <form onSubmit={handleVerifyOtp}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Enter 6-digit OTP</label>
                <div className="d-flex justify-content-between">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="form-control text-center mx-1"
                      style={{ width: '3rem', fontSize: '1.5rem', letterSpacing: '0.3rem' }}
                      value={digit}
                      onChange={(e) => handleOtpChange(e, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      ref={(el) => (otpRefs.current[idx] = el)}
                      disabled={loading || otpTryCount >= maxOtpTries}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 mb-2"
                disabled={loading || otpTryCount >= maxOtpTries}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Verifying OTP...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </form>

            {otpTryCount >= maxOtpTries && (
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setOtpTryCount(0);
                  setOtp(['', '', '', '', '', '']);
                  setLoading(false);
                  // Resend OTP by calling send OTP API directly
                  handleSendOtp(new Event('submit'));
                }}
              >
                Resend OTP
              </button>
            )}
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label fw-semibold">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="form-control"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordMismatch(false);
                }}
                placeholder="At least 6 characters"
                disabled={resetLoading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label fw-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordMismatch(false);
                }}
                placeholder="Re-enter your password"
                disabled={resetLoading}
              />
              {passwordMismatch && (
                <div className="form-text text-danger">Passwords do not match.</div>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={resetLoading}>
              {resetLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Updating Password...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FacultyForgetPass;
