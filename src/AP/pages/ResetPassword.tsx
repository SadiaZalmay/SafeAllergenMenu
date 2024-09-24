import React, { useState } from 'react';
import '../assets/css/light-bootstrap-dashboard.css'; 

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('New Password:', newPassword);
        console.log('Confirm Password:', confirmPassword);
    };

    return (
        <div className="container">
            {/* Outer Row */}
            <div className="row justify-content-center">
                <div className="col-xl-6 col-lg-6 col-md-8">
                    <div className="card o-hidden border-0 shadow-lg my-5">
                        <div className="card-header text-center">
                            <h2 className="h4 mb-0">Reset Password</h2>
                        </div>
                        <div className="card-body p-4">
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
