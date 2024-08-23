// AuthGuard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:5000/api/protected', { withCredentials: true });
        setIsLoading(false);
      } catch (error) {
        setError('Authentication failed.');
        navigate('/Login'); // Redirect to login page
      }
    };
  
    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // or a loading spinner
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return <>{children}</>;
};

export default AuthGuard;
