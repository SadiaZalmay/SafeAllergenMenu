import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import queryString from 'query-string'; // Import query-string
import '../assets/css/light-bootstrap-dashboard.css';

const ResetPassword: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(true);

    useEffect(() => {
        const { token } = queryString.parse(location.search); // Get token from query string
        const validateToken = async () => {
            if (!token) {
                setIsValidToken(false);
                setError("No token provided.");
                return;
            }
            try {
                const response = await axios.post('/api/validate-token', { token });
                if (response.data.message === "Token is valid.") {
                    setIsValidToken(true);
                } else {
                    setIsValidToken(false);
                    setError("Invalid or expired token.");
                }
            } catch (err) {
                console.error(err);
                setIsValidToken(false);
                setError("Failed to validate token. Please try again.");
            }
        };

        validateToken();
    }, [location.search]); // Depend on location.search

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        const { token } = queryString.parse(location.search); // Get token from query string again
        try {
            const response = await axios.post('/api/resetpassword', {
                token,
                newPassword
            });
            setSuccess(response.data.message);
            setError('');
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError("Failed to reset password. Please try again.");
            setSuccess('');
        } finally {
            setLoading(false);
        }
    };

    if (!isValidToken) {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-6 col-lg-6 col-md-8">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-4">
                                <div className="alert alert-danger">{error}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-xl-6 col-lg-6 col-md-8">
                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-header text-center">
                            <h2 className="h4 mb-0">Reset Password</h2>
                        </div>
                        <div className="card-body p-4">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}
                            <form className="user" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        className="form-control form-control-user"
                                        name="NewPassword"
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
                                        name="ConfirmPassword"
                                        placeholder="Confirm Password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block"
                                    name="reset"
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'Submit'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
