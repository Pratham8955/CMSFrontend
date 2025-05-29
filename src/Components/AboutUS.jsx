import React from 'react';
import universityImage from '../assets/university.png'; // Update as needed
import academicsImage from '../assets/academics.png';   // Update as needed
import campusImage from '../assets/campus.png';         // Optional: Add this image
import heroImage from '../assets/hero.png';             // Optional: Add this image
import awardsImage from '../assets/awards.png';         // Optional: Add this image
import { NavLink } from "react-router-dom";

import '../css/AboutUs.css';

const AboutUS = () => {
  return (
    <div>
    <div className="about-container">
      {/* History Section */}
      <div className="section">
        {/* Image Left */}
        <div className="image-container">
          <img src={universityImage} alt="History" />
        </div>
        <div className="text-container">
          <h2>History</h2>
          <p> College is a term that has several different uses; most often it is used in the context of 
            post-secondary education, either to describe an entire certificate or degree granting institution, 
            or a sub-division within a larger organization. In the past, colleges were subsumed within a 
            university system, operating more as the home for students and providing training. The university 
            was the body which granted the degree after students completed their time of study and satisfied 
            requirements, usually involving examinations, set by the university.</p>
        </div>
      </div>

      <div className="section reverse">
        {/* Image Right */}
        <div className="image-container">
          <img src={academicsImage} alt="Academics" />
        </div>
        <div className="text-container">
          <h2>Academics</h2>
          <p> Academic articles are written by professionals in a given field. They are edited by the authors' 
            peers and often take years to publish. Their language is formal and will contain words and terms 
            typical to the field. The author's name will be present, as will their credentials. There will be 
            a list of references that indicate where the author obtained the information used in the article. 
            Academic articles can be found in periodicals similar to the Journal of Psychology, Childhood 
            Education or The American Journal of Public Health.
          </p>
        </div>
      </div>

      <div className="section">
        {/* Image Left */}
        <div className="image-container">
          <img src={awardsImage} alt="Campus Life" />
        </div>
        <div className="text-container">
          <h2>Campus Life</h2>
          <p> Share some of the awards and honors your college has received. This shows prospective students 
            that your college is respected and recognized. Include key statistics such as enrollment size, 
            graduation rate, and average SAT/ACT scores. This helps prospective students understand what your 
            college is like and its achievements.
         </p>
        </div>
      </div>

      <div className="section reverse">
        {/* Image Right */}
        <div className="image-container">
          <img src={heroImage} alt="Hero" />
        </div>
        <div className="text-container">
          <h2>Hero</h2>
          <p>Hero section content goes here. You can highlight the values, mission, or anything inspirational 
            about your college, like an outstanding faculty member, a notable alum, or a breakthrough event 
            that shaped your institution’s identity.</p>
        </div>
      </div>
      <div className="section">
        {/* Image Left */}
        <div className="image-container">
          <img src={campusImage} alt="Campus Life" />
        </div>
        <div className="text-container">
          <h2>Campus Life</h2>
          <p> My college campus is the place where I spend most of my day times. I love that place a lot and I have lots 
            of friends there. Whenever we get leisure time in the college period, we hang out on the campus. There is a 
            big college canteen where we get every type of food. The entire campus has around ten buildings. Each 
            building has its own department. There is a friendly environment on the campus and anyone can go to any 
            building, there is no restriction. This is a very good and amazing place to spend time. I love my campus a lot.
             </p>
        </div>
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

export default AboutUS;



 