import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/light-bootstrap-dashboard.css";
import axios from "axios";

const Register: React.FC = () => {
  const [login, setLogin] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (e: { target: { name: string; value: string } }) => {
    setLogin((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const navigate = useNavigate();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", login);
      navigate("/Login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      {/* Outer Row */}
      <div className="row justify-content-center">
        <div className="col-xl-6 col-lg-6 col-md-8">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-header text-center">
              <h2 className="h4 mb-0">Sign Up</h2>
            </div>
            <div className="card-body p-4">
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
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
