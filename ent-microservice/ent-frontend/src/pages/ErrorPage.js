import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">Erreur</h1>
      <p className="mt-4 text-gray-700">{state?.message || 'Une erreur est survenue.'}</p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 bg-est-blue text-white py-2 px-6 rounded-md hover:bg-blue-900"
      >
        Retour à l'accueil
      </button>
    </div>
  );
};

export default ErrorPage;