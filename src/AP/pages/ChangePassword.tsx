import React, { useState } from "react";
import axios from "axios";
import "../assets/css/light-bootstrap-dashboard.css";
import { Link } from "react-router-dom";

const ChangePassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (password === newPassword) {
      setError("This password has been used for your account before.");
      return;
    }
    setLoading(true);

    try {
      // Make the API request to change the password
      const res = await axios.post("http://localhost:5000/api/changepassword", {
        password,
        newPassword,
      });

      if (res.status === 200) {
        setSuccess("Password changed successfully.");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError("Failed to change password. Please try again.");
      }
    } catch (err) {
      // Enhanced error handling
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.error ||
          "An unexpected error occurred. Please try again.";
        setError(message);
      } else {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-xl-6 col-lg-6 col-md-8">
          <div className="card o-hidden border-0 shadow-lg my-5">
            <div className="card-header text-center">
              <h2 className="h4 mb-0">Change Password</h2>
            </div>
            <div className="card-body p-4">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <form className="user" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-user"
                    name="password"
                    placeholder="Old Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-user"
                    name="newPassword"
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-user"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  name="change"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
                <Link to="/AP" className="btn-block">
                  Go Back
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
