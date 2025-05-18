import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const StudentDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const studentId = decoded.StudentUserId;

        const res = await axios.get(
          `https://localhost:7133/api/Notifications/notifications/${studentId}`
        );

        if (res.data.length > 0) {
          setNotifications(res.data);
          setShowPopup(true);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const closePopup = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded = jwtDecode(token);
      const studentId = decoded.StudentUserId;

      // Call API to mark ALL notifications as read for this student
      await axios.post(`https://localhost:7133/api/Notifications/markAllAsRead/${studentId}`);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    } finally {
      setShowPopup(false);
    }
  };

  return (
    <div>
      <h2>Welcome to Student Dashboard</h2>

      {showPopup && (
        <div style={popupStyles.overlay}>
          <div style={popupStyles.popup}>
            <h3>📢 Important Notification</h3>
            <ul>
              {notifications.map((note) => (
                <li key={note.id}>{note.message}</li>
              ))}
            </ul>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      {/* Your main dashboard content here */}
    </div>
  );
};

const popupStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  popup: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
  }
};

export default StudentDashboard;
