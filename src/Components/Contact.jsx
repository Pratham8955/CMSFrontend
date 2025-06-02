import React from "react";
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

const ContactFullScreen = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Message Sent",
      text: "Thank you for contacting us. We will get back to you shortly!",
      confirmButtonColor: "#0d6efd",
    });
    e.target.reset();
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
                className="form-control rounded-pill shadow-sm"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control rounded-pill shadow-sm"
                placeholder="Your Email"
                required
              />
            </div>
            <div className="mb-3">
              <select
                className="form-select rounded-pill shadow-sm"
                required
                defaultValue=""
              >
                <option value="" disabled>Select Subject</option>
                <option>Admission Inquiry</option>
                <option>Course Details</option>
                <option>Technical Support</option>
                <option>Other</option>
              </select>
            </div>
            <div className="mb-3">
              <textarea
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
