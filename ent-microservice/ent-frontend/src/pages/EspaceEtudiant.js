import React, { useState, useEffect } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getStudentByEmail, getStudentById, getFiliereById } from '../services/studentService';
import { 
  FaGraduationCap, 
  FaBook, 
  FaUsers, 
  FaQuestionCircle, 
  FaEnvelope, 
  FaBell, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaBookOpen, 
  FaUserGraduate, 
  FaHandsHelping, 
  FaComments, 
  FaRobot 
} from 'react-icons/fa';

const EspaceEtudiant = () => {
  const { user, loading: authLoading } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      if (authLoading) return; // Wait for auth to initialize

      console.log('User from useAuth:', user); // Debug

      if (!user) {
        setError('No user is logged in. Please log in to view your dashboard.');
        setLoading(false);
        return;
      }

      if (!user.email) {
        setError('User email is not available. Please ensure your account is properly configured.');
        setLoading(false);
        return;
      }

      try {
        // Fetch student by email to get UUID with cache-busting
        console.log('Fetching student by email:', user.email); // Debug
        const emailResponse = await getStudentByEmail(user.email, { _t: Date.now() });
        console.log('Email response:', emailResponse); // Debug

        // Filter for the record matching user.email
        const studentByEmail = Array.isArray(emailResponse)
          ? emailResponse.find(student => student.email === user.email)
          : emailResponse;

        if (!studentByEmail?.id) {
          throw new Error(`Student ID (UUID) not found for email: ${user.email}`);
        }

        // Fetch full student profile by UUID with cache-busting
        console.log('Fetching student by ID:', studentByEmail.id); // Debug
        const student = await getStudentById(studentByEmail.id, { _t: Date.now() });
        console.log('Student data:', student); // Debug

        // Fetch filiere name
        let filiere = { name: 'N/A' };
        if (student.filiere_id) {
          try {
            filiere = await getFiliereById(student.filiere_id, { _t: Date.now() });
            console.log('Filiere:', filiere); // Debug
          } catch (err) {
            console.warn('Failed to fetch filiere name:', err);
          }
        }

        setStudentData({
          ...student,
          filiere: { name: filiere.name || 'N/A' }
        });
      } catch (err) {
        console.error('Failed to fetch student data:', err);
        setError(`Failed to load student information for ${user.email}. Ensure your email is registered or contact support.`);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-est-blue"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="sidebar w-64 bg-white p-6 shadow-md">
          <h2 className="text-est-blue text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Inscriptions</h2>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded bg-gray-100 text-est-blue">
                <FaGraduationCap className="mr-2" /> Scolarité et examens
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaBook className="mr-2" /> Outils pédagogiques
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaUsers className="mr-2" /> Outils collaboratifs
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaQuestionCircle className="mr-2" /> Assistance
              </Link>
            </li>
          </ul>
          
          <h2 className="text-est-blue text-lg font-semibold mt-8 mb-4 pb-2 border-b border-gray-200">Messagerie</h2>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaEnvelope className="mr-2" /> Messagerie électronique
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaBell className="mr-2" /> Notifications
              </Link>
            </li>
          </ul>
          
          <h2 className="text-est-blue text-lg font-semibold mt-8 mb-4 pb-2 border-b border-gray-200">Ressources</h2>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaFileAlt className="mr-2" /> Notes
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaCalendarAlt className="mr-2" /> Calendrier des examens
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue">
                <FaBookOpen className="mr-2" /> Cours en ligne
              </Link>
            </li>
          </ul>
        </aside>
        
        {/* Main Content Area */}
        <main className="flex-1 p-8 bg-white m-4 rounded-lg shadow-sm">
          <div className="welcome-banner bg-est-blue text-white p-8 rounded-lg mb-8 text-center">
            <h1 className="text-2xl font-bold mb-4">
              Bienvenue, {studentData ? `${studentData.first_name} ${studentData.last_name}` : 'Étudiant'}!
            </h1>
            {studentData && (
              <div className="text-sm opacity-90 mb-4">
                <p>Email: {studentData.email}</p>
                <p>Programme: {studentData.filiere?.name || 'N/A'}</p>
                <p>Année: {studentData.year || 'N/A'}</p>
              </div>
            )}
            {error && (
              <p className="text-red-300 mb-4">{error}</p>
            )}
            <p className="text-lg opacity-90 mb-6">Nous sommes là pour vous aider dans votre parcours universitaire</p>
            <button className="bg-est-yellow text-black px-6 py-2 rounded hover:bg-yellow-600 transition"
            onClick={() => navigate('/chatbot')}>
              Lancer une conversation
            </button>
          </div>
          
          <div className="search-bar flex mb-8">
            <input 
              type="text" 
              placeholder="Que recherchez-vous ?" 
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-est-blue"
            />
            <button className="bg-est-blue text-white px-6 rounded-r hover:bg-blue-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          <ServiceGrid />
        </main>
      </div>
      
      {/* AI Assistant */}
      <Link
        to="/chatbot"
        className="ai-assistant fixed bottom-8 right-8 bg-est-blue text-white w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition"
        title="Assistant IA Ollama"
      >
        <FaRobot className="text-2xl" />
      </Link>
      {/* <div 
        className="ai-assistant fixed bottom-8 right-8 bg-est-blue text-white w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition" 
        title="Assistant IA Ollama"
      >
        <FaRobot className="text-2xl" />
      </div> */}
    </div>
  );
};

// Service Grid Component
const ServiceGrid = () => {
  const services = [
    {
      icon: <FaUserGraduate className="mr-2" />,
      title: "Notes",
      description: "Consulter vos notes aux épreuves et suivre votre progression académique.",
      link: "#"
    },
    {
      icon: <FaCalendarAlt className="mr-2" />,
      title: "Calendrier des examens",
      description: "Consulter votre calendrier aux examens et planifier vos révisions.",
      link: "#"
    },
    {
      icon: <FaHandsHelping className="mr-2" />,
      title: "Demande d'intervention",
      description: "Demander de l'aide pour vos problèmes techniques ou administratifs.",
      link: "#"
    },
    {
      icon: <FaBook className="mr-2" />,
      title: "Cours en ligne",
      description: "Accéder à la plateforme pédagogique de l'université.",
      link: "#"
    },
    {
      icon: <FaQuestionCircle className="mr-2" />,
      title: "Assistance ENT",
      description: "Obtenir de l'aide sur votre Environnement Numérique de Travail.",
      link: "#"
    },
    {
      icon: <FaComments className="mr-2" />,
      title: "Forum et Chat",
      description: "Communiquer avec les autres étudiants et enseignants.",
      link: "#"
    }
  ];

  return (
    <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {services.map((service, index) => (
        <ServiceCard key={index} service={service} />
      ))}
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ service }) => {
  return (
    <div className="service-card bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 hover:-translate-y-1">
      <h3 className="text-est-blue font-semibold mb-2 flex items-center">
        {service.icon} {service.title}
      </h3>
      <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
      <Link to={service.link} className="text-est-blue font-medium text-sm hover:underline flex items-center">
        Accéder <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
};

export default EspaceEtudiant;