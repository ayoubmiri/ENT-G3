import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FormationsPage from './pages/FormationsPage';
import NewsPage from './pages/NewsPage';
import Login from './components/Auth/Login';
import EventsPage from './pages/EventsPage';
import ResearchPage from './pages/ResearchPage';
import ContactPage from './pages/ContactPage';
import AdmissionPage from './pages/AdmissionPage';
import EtudiantProfile from './pages/EtudiantProfile';
import EnseignantProfile from './pages/EnseignantProfile';
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import EspaceEtudiant from './pages/EspaceEtudiant';
import EspaceEnseignant from './pages/EspaceEnseignant';
import Chatbot from './pages/chatbot'; 
import UploadPage from './pages/UploadPage';  

function App() {
  return (
    <div className="font-sans bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/formations" element={<FormationsPage />} />
        <Route path="/actualites" element={<NewsPage />} />
        <Route path="/admission" element={<AdmissionPage />} />
        <Route path="/recherche" element={<ResearchPage />} />
        <Route path="/evenements" element={<EventsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chatbot" element={<Chatbot />} /> {/* Chatbot route */} 
        
        {/* Protected Routes */}
        <Route
          path="/espace-etudiant"
          element={
            <PrivateRoute role="etudiant">
              <EspaceEtudiant />
            </PrivateRoute>
          }
        />
        <Route
          path="/espace-enseignant"
          element={
            <PrivateRoute role="enseignant">
              <EspaceEnseignant />
            </PrivateRoute>
          }
        />
         <Route
            path="/espace-enseignant/upload"
            element={
              <PrivateRoute role="enseignant">
                <UploadPage />
              </PrivateRoute>
            }
          />
        <Route
          path="/profil/etudiant"
          element={
            <PrivateRoute role="etudiant">
              <EtudiantProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/profil/enseignant"
          element={
            <PrivateRoute role="enseignant">
              <EnseignantProfile />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
