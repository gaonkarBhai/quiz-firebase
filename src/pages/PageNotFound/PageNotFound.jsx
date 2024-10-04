import React from "react";
import Layout from "../../components/Layout/Layout";
import './pageNotFound.scss'
import { Link } from "react-router-dom";
const PageNotFound = () => {
  return (
    <Layout title="404 | Page not found">
      <div className="container">
        <p className="glitch">
          <span aria-hidden="true">404</span>
          404
          <span aria-hidden="true">404</span>
        </p>
        <Link to="/"  className="B2H_btn">
          Back to home
        </Link>
      </div>
    </Layout>
  );
};

export default PageNotFound;
