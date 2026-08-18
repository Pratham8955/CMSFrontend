import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Button, Alert, Toast, ToastContainer } from 'react-bootstrap';
import '../../css/Faculty/Notification.css';
import { API_BASE_URL } from '../../config/api';

const Notifications = () => {
  const [deptId, setDeptId] = useState(null);
  const [deptName, setDeptName] = useState('');
  const [loading, setLoading] = useState(true);
  const [notifyLoading, setNotifyLoading] = useState(false);

  // Toast state
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('info');

  const showToast = (message, variant = 'info') => {
    setToastMessage(message);
    setToastVariant(variant);
    setToastShow(true);
  };

  useEffect(() => {
    const fetchDepartment = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          showToast("No token found.", "danger");
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const facultyId = decoded.FacultyUserId;

        const res = await axios.get(`${API_BASE_URL}/Department/GetDepartmentByFacultyId/${facultyId}`);
        const departments = res.data.department;

        if (departments && departments.length > 0) {
          setDeptId(departments[0].deptId);
          setDeptName(departments[0].deptName);
        } else {
          showToast("No department found for this faculty.", "warning");
        }
      } catch (error) {
        console.error(error);
        showToast("Failed to fetch department.", "danger");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, []);

  const sendNotification = async () => {
    if (!deptId) {
      showToast("Department ID is missing.", "warning");
      return;
    }

    setNotifyLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/Notifications/sendNotificationToUnpaid/${deptId}`
      );
      showToast(res.data.message || "Notifications sent!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to send notifications.", "danger");
    } finally {
      setNotifyLoading(false);
    }
  };

  return (
    <div className="notification-container">
      <h2 className="mb-4 fw-bold text-primary text-center notification-header">Notification Center</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="loading-text">Loading department info...</p>
        </div>
      ) : (
        <div className="notification-card">
          <div className="notification-card-header">
            <h4>Department Notifications</h4>
          </div>
          <div className="notification-card-body">
            {deptName ? (
              <Alert variant="info" className="mb-4">
                <strong>Current Department:</strong> {deptName}
              </Alert>
            ) : (
              <Alert variant="warning" className="mb-4">
                No department found for your account.
              </Alert>
            )}

            <Button
              variant="primary"
              onClick={sendNotification}
              disabled={notifyLoading || !deptId}
              className="notify-btn"
            >
              {notifyLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Sending Notifications...
                </>
              ) : (
                'Send Fee Notification'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toastShow}
          onClose={() => setToastShow(false)}
          bg={toastVariant}
          delay={3000}
          autohide
        >
          <Toast.Body className={toastVariant === 'dark' ? 'text-white' : ''}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Notifications;
