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

    // You can also reset the form here if you want:
    e.target.reset();
  };

  return (
    <div className="container-fluid p-0" style={{ height: "100vh", fontSize: "0.85rem" }}>
      <div className="row g-0" style={{ height: "100%" }}>
        {/* Left: Map */}
        <div className="col-md-6" style={{ height: "100vh", overflow: "hidden", width: "1000px" }}>
          <iframe
            title="College Location"
            src="https://www.google.com/maps?q=21.153793973221013,72.78317926281458&hl=en&z=15&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        {/* Right: Contact Info + Form */}
        <div
          className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-light p-3"
          style={{ height: "100vh", width: "500px" }}
        >
          <div
            style={{
              maxWidth: "400px",
              width: "100%",
              maxHeight: "500px",
              overflowY: "auto",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
            }}
          >
            {/* Contact Form */}
            <form
              className="contact-form p-3 bg-white rounded shadow-sm"
              onSubmit={handleSubmit}
            >
              <h2 className="mb-3 text-primary fw-bold text-center" style={{ fontSize: "1.6rem" }}>
                Contact Us
              </h2>
              <div className="mb-2">
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Your Name"
                  required
                  autoComplete="name"
                  style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                />
              </div>
              <div className="mb-2">
                <input
                  type="email"
                  className="form-control rounded-pill"
                  placeholder="Your Email"
                  required
                  autoComplete="email"
                  style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                />
              </div>
              <div className="mb-2">
                <select
                  className="form-select rounded-pill"
                  required
                  defaultValue=""
                  aria-label="Select Subject"
                  style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                >
                  <option value="" disabled>
                    Select Subject
                  </option>
                  <option>Admission Inquiry</option>
                  <option>Course Details</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control rounded"
                  rows="3"
                  placeholder="Write your message..."
                  required
                  style={{ fontSize: "0.85rem", padding: "8px 12px" }}
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill fw-semibold shadow-sm"
                style={{ fontSize: "0.9rem", padding: "8px 0" }}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="mb-3 text-center" style={{ maxWidth: "400px", width: "100%", fontSize: "0.9rem" }}>
            <p>
              <FaMapMarkerAlt className="text-primary me-2" style={{ fontSize: "1.1rem" }} />
              123 College Road, Cityville, State 45678
            </p>

            <div className="d-flex justify-content-center align-items-center gap-3 contact-row flex-wrap">
              <p className="mb-0" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <FaPhoneAlt className="text-primary" style={{ fontSize: "1.1rem" }} />
                +91 12345 67890
              </p>
              <p className="mb-0" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <FaEnvelope className="text-primary" style={{ fontSize: "1.1rem" }} />
                info@abccollege.edu.in
              </p>
            </div>

            <div className="d-flex justify-content-center gap-3 mt-2 fs-5">
              <a href="#" className="text-primary" style={{ fontSize: "1.1rem" }}>
                <FaFacebookF />
              </a>
              <a href="#" className="text-danger" style={{ fontSize: "1.1rem" }}>
                <FaInstagram />
              </a>
              <a href="#" className="text-info" style={{ fontSize: "1.1rem" }}>
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
