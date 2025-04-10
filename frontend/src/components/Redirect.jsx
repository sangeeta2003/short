import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Redirect = () => {
  const { shortCode } = useParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${shortCode}`, {
          method: 'GET',
          redirect: 'follow'
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to redirect');
        }

        // If we get here, the redirect was successful
        window.location.href = response.url;
      } catch (err) {
        console.error('Redirect error:', err);
        setError(err.message || 'URL not found or error occurred');
      }
    };

    handleRedirect();
  }, [shortCode]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Redirecting...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
};

export default Redirect; 