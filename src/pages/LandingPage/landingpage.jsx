import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
//import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { DataBase } from "../../firebase-config";
import HomepageSidebar from "../../components/HomepageSidebar/HomepageSidebar";
import "../HomePage/homePage.scss";
import { Link } from "react-router-dom";
import './landingpage.scss'

const LandingPage = () => {
  const auth = useAuth();
  const user = auth.currentUser;

  
  return (
    <Layout title="Browse 2024 | SARK - Where Imagination Transform To Innovation">
      <div className="homepage-body">
        
        <section className='dashboard-hero'>
          <h2>Browse <span className="event_year">2024</span></h2>
          <h1>Browse Quiz 2024 Organized By SARK</h1>
          {user ? (
          <Link to="/home" className="B2H_btn landing_btn">
            Participate Now
          </Link>
        ) : (
          <Link to="/register" className="B2H_btn landing_btn">
            Register
          </Link>
        )}
        </section>
      </div>
    </Layout>
  );
};

export default LandingPage;
