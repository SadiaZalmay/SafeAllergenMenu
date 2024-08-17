import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/light-bootstrap-dashboard.css"; // Adjust the path as necessary
import axios from "axios";

const Login: React.FC = () => {

  return (
    <div className="container">
      {/* Outer Row */}
      <div className="row justify-content-center">
        <div className="col-xl-6 col-lg-6 col-md-8">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-header text-center">
              <h2 className="h4 mb-0">Sign In</h2>
            </div>
            <div className="card-body p-4">
              <form className="user">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    
                    type="email"
                    className="form-control form-control-user"
                    name="email"
                    placeholder=" Enter email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    
                    type="password"
                    className="form-control form-control-user"
                    name="password"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <Link
                  to="/AP"
                  type="login"
                  className="btn btn-primary btn-block"
                >
                  Login
                </Link>
                <Link
                  to="/Register"
                  type="register"
                  className="btn btn-primary btn-block"
                >
                  Create Account
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
