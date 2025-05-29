import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../css/Contact.css';
import { NavLink } from "react-router-dom";

// Custom red icon
const redIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  className: 'leaflet-red-icon'
});

const Contact = () => {
  const position = [21.160681,72.783146]; // VNSGU Location

  const handleMarkerClick = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=21.160681,72.783146`,
      '_blank'
    );
  };

  return (
    <div>
 <div className="map-wrapper">
      <MapContainer center={position} zoom={15} scrollWheelZoom={true} className="full-map">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={redIcon} eventHandlers={{ click: handleMarkerClick }}>
          <Popup>Click marker for directions to VNSGU</Popup>
        </Marker>
      </MapContainer>

      <div className="form-overlay">
        <form className="contact-form">
          <h2>Contact Us</h2>
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <button type="submit">Submit</button>
         
        </form>
      </div>
    </div>
   <div className="footer">
                   <div className="footer-left">
                     <h2>Let's keep in touch!</h2>
                     <h9>Opening doors through literacy. Don’t be mean behind the screen</h9>
                   </div>
         
                   <div className="footer-right">
                     <ul className="navbar-nav">
                       <li>
                         <NavLink to="/" className="nav-link">
                           <i className="bi bi-house-door me-1"></i> Home
                         </NavLink>
                       </li>
                       <li >
                         <NavLink to="/courses" className="nav-link">
                           <i className="bi bi-check2-square me-1"></i> Courses
                         </NavLink>
                       </li>
                       <li>
                         <NavLink to="/contact" className="nav-link">
                           <i className="bi bi-envelope me-1"></i> Contact Us
                         </NavLink>
                       </li>
                       <li>
                         <NavLink to="/aboutUs" className="nav-link">
                           <i className="bi bi-info-circle me-1"></i> About Us
                         </NavLink>
                       </li>
                     </ul>
                   </div>
                 </div>
    </div>
  );
};

export default Contact;
