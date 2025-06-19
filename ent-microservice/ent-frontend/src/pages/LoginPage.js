import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const LoginPage = () => {
  const { login, loading } = useAuth();

  return (
    <>
      
      <main className="container mx-auto px-4 py-12 max-w-md">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-est-blue mb-6">Connexion</h1>
          
          <p className="text-gray-600 mb-8">
            Connectez-vous avec votre compte EST Salé pour accéder à votre espace personnel.
          </p>
          
          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-est-blue text-white py-3 px-6 rounded-md hover:bg-blue-900 transition font-medium disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Se connecter avec Keycloak'}
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Vous n'avez pas de compte? Contactez l'administration.
            </p>
          </div>
        </div>
      </main>

    </>
  );
};

export default LoginPage;