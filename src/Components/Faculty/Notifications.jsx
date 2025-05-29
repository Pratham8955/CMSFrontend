// import React, { useEffect, useState } from 'react';
// import {jwtDecode} from 'jwt-decode';
// import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Spinner, Button, Alert, Toast, ToastContainer } from 'react-bootstrap';

// const Notifications = () => {
//   const [deptId, setDeptId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [notifyLoading, setNotifyLoading] = useState(false);

//   // Toast state
//   const [toastShow, setToastShow] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastVariant, setToastVariant] = useState('info'); // 'success', 'danger', etc.

//   // Show toast helper
//   const showToast = (message, variant = 'info') => {
//     setToastMessage(message);
//     setToastVariant(variant);
//     setToastShow(true);
//   };

//   useEffect(() => {
//     const fetchDepartment = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           showToast("No token found.", "danger");
//           setLoading(false);
//           return;
//         }

//         const decoded = jwtDecode(token);
//         const facultyId = decoded.FacultyUserId;

//         const res = await axios.get(`https://localhost:7133/api/Department/GetDepartmentByFacultyId/${facultyId}`);
//         const departments = res.data.department;

//         if (departments && departments.length > 0) {
//           setDeptId(departments[0].deptId);
//         } else {
//           showToast("No department found for this faculty.", "warning");
//         }
//       } catch (error) {
//         console.error(error);
//         showToast("Failed to fetch department.", "danger");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDepartment();
//   }, []);

//   const sendNotification = async () => {
//     if (!deptId) {
//       showToast("Department ID is missing.", "warning");
//       return;
//     }

//     setNotifyLoading(true);
//     try {
//       const res = await axios.post(
//         `https://localhost:7133/api/Notifications/sendNotificationToUnpaid/${deptId}`
//       );
//       showToast(res.data.message || "Notifications sent!", "success");
//     } catch (error) {
//       console.error(error);
//       showToast("Failed to send notifications.", "danger");
//     } finally {
//       setNotifyLoading(false);
//     }
//   };

//   return (
//     <div className="notification-container">
//       <div className="notification-header">Notification Center</div>

//       {loading ? (
//         <div className="text-center">
//           <Spinner animation="border" role="status" className="mb-3">
//             <span className="visually-hidden">Loading...</span>
//           </Spinner>
//           <p className="loading-text">Loading department info...</p>
//         </div>
//       ) : (
//         <>
//           <Alert variant={deptId ? "primary" : "danger"} className="department-info">
//             Department ID: {deptId || "Not found"}
//           </Alert>
//           <Button
//             onClick={sendNotification}
//             variant="primary"
//             disabled={!deptId || notifyLoading}
//             className="send-btn"
//           >
//             {notifyLoading ? (
//               <>
//                 <Spinner animation="border" size="sm" className="me-2" />
//                 Sending...
//               </>
//             ) : (
//               "Send Notification to Unpaid Students"
//             )}
//           </Button>
//         </>
//       )}

//       {/* Toast container at bottom right */}
//       <ToastContainer position="bottom-end" className="p-3">
//         <Toast
//           onClose={() => setToastShow(false)}
//           show={toastShow}
//           bg={toastVariant}
//           delay={4000}
//           autohide
//         >
//           <Toast.Body className={toastVariant === 'light' ? '' : 'text-white'}>
//             {toastMessage}
//           </Toast.Body>
//         </Toast>
//       </ToastContainer>
//     </div>
//   );
// };

// export default Notifications;
import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Button, Alert, Toast, ToastContainer } from 'react-bootstrap';

const Notifications = () => {
  const [deptId, setDeptId] = useState(null);
  const [deptName, setDeptName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifyLoading, setNotifyLoading] = useState(false);

  // Toast state
  const [toastShow, setToastShow] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('info'); // 'success', 'danger', etc.

  // Show toast helper
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

        const res = await axios.get(`https://localhost:7133/api/Department/GetDepartmentByFacultyId/${facultyId}`);
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
        `https://localhost:7133/api/Notifications/sendNotificationToUnpaid/${deptId}`
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
        <>
          <Alert variant={deptName ? "primary" : "danger"} className="department-info">
            Department: {deptName || "Not found"}
          </Alert>
          <Button
            onClick={sendNotification}
            variant="primary"
            disabled={!deptId || notifyLoading}
            className="send-btn"
          >
            {notifyLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Sending...
              </>
            ) : (
              "Send Notification to Unpaid Students"
            )}
          </Button>
        </>
      )}

      {/* Toast container at bottom right */}
      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          onClose={() => setToastShow(false)}
          show={toastShow}
          bg={toastVariant}
          delay={4000}
          autohide
        >
          <Toast.Body className={toastVariant === 'light' ? '' : 'text-white'}>
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Notifications;
