import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/light-bootstrap-dashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        values
      );
      if (response.status === 200) {
        navigate("/AP");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        const errorMsg = err.response.data.error;

        if (status === 401) {
          setErrorMessage(errorMsg); // Display error message from the backend
        } else {
          setErrorMessage(
            "An unexpected error occurred. Please try again later."
          );
        }
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
      console.error("Error during login:", err); // Log the error
    }
  };

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
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <form className="user">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    className="form-control form-control-user"
                    name="username"
                    placeholder="Enter username"
                    required
                  />
                </div>
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
                <div className="form-group">
                  <label>Password</label>
                  <input
                    onChange={handleChange}
                    type="password"
                    className="form-control form-control-user"
                    name="password"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <button
                  onClick={handleClick}
                  type="submit"
                  className="btn btn-primary btn-block"
                >
                  Login
                </button>
                <Link to="/Register" className="btn btn-secondary btn-block">
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
