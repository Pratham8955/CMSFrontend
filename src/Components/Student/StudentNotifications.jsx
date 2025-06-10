import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 
const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);
const navigate = useNavigate(); 
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const decoded = jwtDecode(token);
        const studentId = decoded.StudentUserId;

        const response = await axios.get(
          `https://localhost:7133/api/Notifications/notifications/${studentId}`
        );
        const data = response.data;
        setNotifications(data);
        setLoading(false);

        if (data.length > 0) {
          setSelectedNotification(data[0]);
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationClick = (note) => {
    setSelectedNotification(note);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNotification(null);
  };

 const handlePayNow = () => {
    handleCloseModal(); 
    navigate("/student/fees"); 
  };
  const handleMarkAsUnread = async () => {
    try {
      await axios.post(
        `https://localhost:7133/api/Notifications/markAsUnread/${selectedNotification.id}`
      );
      alert("Marked as unread!");
      handleCloseModal();
    } catch (err) {
      console.error("Error marking as unread:", err);
    }
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-primary">📢 Notifications</h3>

      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : notifications.length === 0 ? (
        <p className="text-muted fst-italic">No notifications found.</p>
      ) : (
        <ul className="list-group shadow-sm">
          {notifications.map((note) => (
            <li
              key={note.id}
              className="list-group-item list-group-item-action"
              onClick={() => handleNotificationClick(note)}
              style={{ cursor: "pointer" }}
            >
              {note.message}
            </li>
          ))}
        </ul>
      )}

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedNotification?.message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handlePayNow}>
            Pay Now
          </Button>
          <Button variant="warning" onClick={handleMarkAsUnread}>
            Mark as Unread
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentNotifications;
