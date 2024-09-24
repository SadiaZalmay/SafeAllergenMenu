import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/light-bootstrap-dashboard.css";
import axios from "axios";

const ForgotPassword: React.FC = () => {
  const [values, setValues] = useState({
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/forgotpassword/", values);
      if (res.data.Status === 200) {
        navigate("/Login");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } catch (err) {
      console.error("Error during password reset:", err);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-6 col-lg-6 col-md-8">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-header text-center">
              <h2 className="h4 mb-0">Forgot Password</h2>
            </div>
            <div className="card-body p-4">
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <form className="user" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    onChange={handleChange}
                    type="email"
                    className="form-control form-control-user"
                    name="email"
                    placeholder="Enter email"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Send reset link
                </button>
                <Link to="/Register" className="btn-block">
                  Already have an account?
                </Link>
                <Link to="/Register" className="btn-block">
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

export default ForgotPassword;
