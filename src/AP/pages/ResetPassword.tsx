import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/light-bootstrap-dashboard.css'; 

const ResetPassword: React.FC = () => {
    const { token } = useParams<{ token: string }>(); // Get token from URL
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post('/api/resetpassword', {
                token,
                newPassword
            });
            setSuccess(response.data.message);
            setError(''); // Clear any previous errors
        } catch (err) {
            setError("Failed to reset password. Please try again.");
            setSuccess(''); // Clear any previous success messages
        }
    };

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
                                <button type="submit" className="btn btn-primary btn-block" name="reset">
                                    Submit
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
