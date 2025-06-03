import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import "../css/Contact.css";
import axios from "axios";
import { Toast } from "bootstrap";

const ContactFullScreen = () => {
  const [feedback, setfeedback] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    timestamp: ""
  });

  const getCurrentTimestamp = () => new Date().toISOString();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...feedback, timestamp: getCurrentTimestamp() };
      const response = await axios.post('http://localhost:5291/api/Feedback/AddFeedback', dataToSend);
      if (response.data.success) {
        Swal.fire("Success", "Thanks for Contacting Us!", "success");
        setfeedback({
          name: "",
          email: "",
          subject: "",
          message: "",
          timestamp: ""
        });
      } else {
        Swal.fire("Error", "Failed to Contact.", "error");
      }
    } catch (error) {
      alert("Error: " + (error.response?.data?.message || error.message));
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setfeedback((prev) => ({
      ...prev, [name]: value,
    }));
  };


  return (
    <div className="contact-container">
      <div className="contact-map-wrapper">
        <iframe
          title="College Location"
          src="https://www.google.com/maps?q=21.153793973221013,72.78317926281458&hl=en&z=15&output=embed"
          className="contact-map"
          allowFullScreen=""
          loading="lazy"
        ></iframe>

        <div className="contact-form-overlay">
          <form onSubmit={handleSubmit}>
            <h3 className="text-center text-primary mb-4 fw-bold">Contact Us</h3>

            <div className="mb-3">
              <input
                type="text"
                name="name"
                value={feedback.name}
                onChange={handleChange}
                className="form-control rounded-pill shadow-sm"
                placeholder="Your Name"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                name="email"
                value={feedback.email}
                onChange={handleChange}
                className="form-control rounded-pill shadow-sm"
                placeholder="Your Email"
                required
              />
            </div>

            <div className="mb-3">
              <select
                name="subject"
                value={feedback.subject}
                onChange={handleChange}
                className="form-select rounded-pill shadow-sm"
                required
                defaultValue=""
              >
                <option value="" disabled>
                  Select Subject
                </option>
                <option value="Admission Inquiry">Admission Inquiry</option>
                <option value="Course Details">Course Details</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-3">
              <textarea
                name="message"
                value={feedback.message}
                onChange={handleChange}
                className="form-control rounded shadow-sm"
                rows="4"
                placeholder="Write your message..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 rounded-pill shadow fw-semibold"
            >
              Send Message
            </button>
          </form>

          <div className="mt-4 text-center text-dark">
            <p className="mb-2">
              <FaMapMarkerAlt className="text-primary me-2" />
              123 College Road, Cityville, State 45678
            </p>
            <p className="mb-1">
              <FaPhoneAlt className="text-primary me-2" />
              +91 12345 67890
            </p>
            <p className="mb-3">
              <FaEnvelope className="text-primary me-2" />
              info@abccollege.edu.in
            </p>
            <div className="d-flex justify-content-center gap-3 fs-5">
              <a href="#" className="text-primary">
                <FaFacebookF />
              </a>
              <a href="#" className="text-danger">
                <FaInstagram />
              </a>
              <a href="#" className="text-info">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFullScreen;