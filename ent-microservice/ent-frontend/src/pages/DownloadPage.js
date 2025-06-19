import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FaBook,
  FaUsers,
  FaQuestionCircle,
  FaEnvelope,
  FaBell,
  FaFileAlt,
  FaCalendarAlt,
  FaChartLine,
  FaUserEdit,
  FaTasks,
  FaClipboardCheck,
  FaRobot,
  FaDownload,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const DownloadPage = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch courses based on student's filière
  const fetchCourses = async () => {
    if (!user?.token) {
      setFilesError('Authentication token is missing. Please log in again.');
      return;
    }

    setFilesLoading(true);
    setFilesError(null);

    try {
      const response = await fetch('http://localhost:8003/list-courses/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token. Please log in again.');
        }
        if (response.status === 403) {
          throw new Error('Access denied: Missing filière information.');
        }
        throw new Error(data.detail || `Failed to fetch courses (status: ${response.status}).`);
      }

      setFiles(data.files || []);
    } catch (err) {
      setFilesError(err.message || 'An unexpected error occurred while fetching courses. Please try again later.');
    } finally {
      setFilesLoading(false);
    }
  };

  // Fetch courses on mount
  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const handleDownload = async (bucket_name, object_name) => {
    if (!user?.token) {
      setFilesError('Authentication token is missing. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8003/download/${encodeURIComponent(bucket_name)}/${encodeURIComponent(object_name)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token. Please log in again.');
        }
        if (response.status === 403) {
          throw new Error('Access denied: File filière does not match your filière.');
        }
        if (response.status === 404) {
          throw new Error('File not found. It may have been deleted or moved.');
        }
        const data = await response.json();
        throw new Error(data.detail || `Failed to download file (status: ${response.status}).`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = object_name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setFilesError(err.message || 'An unexpected error occurred while downloading the file. Please try again later.');
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <p className="text-red-500 text-center text-sm sm:text-base">Please log in to access this page.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      {/* Header for Mobile */}
      <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-est-blue text-lg font-semibold">Mes Cours</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-est-blue text-2xl focus:outline-none"
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className={`sidebar fixed inset-y-0 left-0 w-64 bg-white p-6 shadow-md transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:transform-none md:static md:block transition-transform duration-300 ease-in-out z-20 overflow-y-auto`}>
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h2 className="text-est-blue text-lg font-semibold">Menu</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-est-blue text-2xl"
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          </div>
          <h2 className="text-est-blue text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Études</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/espace-etudiant" className="flex items-center px-3 py-2 rounded bg-gray-100 text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
                <FaBook className="mr-2" /> Mes Cours
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
                <FaClipboardCheck className="mr-2" /> Mes Notes
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
                <FaTasks className="mr-2" /> Mes Devoirs
              </Link>
            </li>
          </ul>
          
          <h2 className="text-est-blue text-lg font-semibold mt-8 mb-4 pb-2 border-b border-gray-200">Administration</h2>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
                <FaFileAlt className="mr-2" /> Emplois du Temps
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
                <FaCalendarAlt className="mr-2" /> Calendrier Académique
              </Link>
            </li>
          </ul>
        </aside>

        {/* Overlay for Mobile Sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" 
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-white m-2 sm:m-4 rounded-lg shadow-sm">
          <div className="welcome-banner bg-est-blue text-white p-4 sm:p-6 md:p-8 rounded-lg mb-4 sm:mb-6 md:mb-8 text-center">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4">Accéder à Vos Cours</h1>
            <p className="text-sm sm:text-base md:text-lg opacity-90 mb-4 sm:mb-6">Téléchargez les ressources pédagogiques pour votre filière</p>
          </div>

          <div className="files-list bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-est-blue text-base sm:text-lg font-semibold mb-4">Ressources Disponibles</h2>
            {filesError && (
              <p className="text-red-500 mb-4 text-sm sm:text-base">{filesError}</p>
            )}
            {filesLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-est-blue"></div>
              </div>
            ) : files.length === 0 ? (
              <p className="text-gray-600 text-sm sm:text-base">Aucune ressource disponible pour votre filière pour le moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom du Fichier</th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filière</th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Élément</th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                      <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {files.map((file, index) => (
                      <tr key={index}>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{file.object_name}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{file.metadata.filiere}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{file.metadata.module}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{file.metadata.element}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{file.metadata.titre}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                          <button
                            onClick={() => handleDownload(file.bucket_name, file.object_name)}
                            className="text-est-blue hover:text-blue-900 flex items-center"
                            title="Télécharger"
                          >
                            <FaDownload className="inline mr-1" /> Télécharger
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Mobile File List */}
                <div className="sm:hidden space-y-4">
                  {files.map((file, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <p className="text-xs font-medium text-gray-700 break-words"><span className="font-semibold">Nom:</span> {file.object_name}</p>
                      <p className="text-xs text-gray-600"><span className="font-semibold">Filière:</span> {file.metadata.filiere}</p>
                      <p className="text-xs text-gray-600"><span className="font-semibold">Module:</span> {file.metadata.module}</p>
                      <p className="text-xs text-gray-600"><span className="font-semibold">Élément:</span> {file.metadata.element}</p>
                      <p className="text-xs text-gray-600"><span className="font-semibold">Titre:</span> {file.metadata.titre}</p>
                      <div className="mt-2">
                        <button
                          onClick={() => handleDownload(file.bucket_name, file.object_name)}
                          className="text-est-blue hover:text-blue-900 text-xs flex items-center"
                          title="Télécharger"
                        >
                          <FaDownload className="inline mr-1" /> Télécharger
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* AI Assistant */}
      <div 
        className="ai-assistant fixed bottom-4 sm:bottom-8 right-4 sm:right-8 bg-est-blue text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition z-30" 
        title="Assistant IA Ollama"
      >
        <FaRobot className="text-xl sm:text-2xl" />
      </div>
    </div>
  );
};

export default DownloadPage;