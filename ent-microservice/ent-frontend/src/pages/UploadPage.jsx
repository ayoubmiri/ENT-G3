// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { 
//   FaChalkboardTeacher, 
//   FaBook, 
//   FaUsers, 
//   FaQuestionCircle, 
//   FaEnvelope, 
//   FaBell, 
//   FaFileAlt, 
//   FaCalendarAlt,
//   FaChartLine,
//   FaUserEdit,
//   FaTasks,
//   FaClipboardCheck,
//   FaRobot,
//   FaUpload,
//   FaEdit,
//   FaBars,
//   FaTimes,
//   FaDownload
// } from 'react-icons/fa';

// const UploadPage = () => {
//   const { user } = useAuth();
//   const [file, setFile] = useState(null);
//   const [formData, setFormData] = useState({
//     filiere: '',
//     module: '',
//     element: '',
//     titre: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [filesLoading, setFilesLoading] = useState(false);
//   const [filesError, setFilesError] = useState(null);
//   const [editingFile, setEditingFile] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   // Fetch uploaded files
//   const fetchFiles = async () => {
//     if (!user?.token) {
//       setFilesError('Authentication token is missing. Please log in again.');
//       return;
//     }

//     setFilesLoading(true);
//     setFilesError(null);

//     try {
//       const response = await fetch('http://localhost:8005/list-files/', {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error('Unauthorized: Invalid or expired token. Please log in again.');
//         }
//         throw new Error(data.detail || `Failed to fetch files (status: ${response.status}).`);
//       }

//       setFiles(data.files || []);
//     } catch (err) {
//       setFilesError(err.message || 'An unexpected error occurred while fetching files. Please try again later.');
//     } finally {
//       setFilesLoading(false);
//     }
//   };

//   // Fetch files on mount and after successful upload/update
//   useEffect(() => {
//     if (user) {
//       fetchFiles();
//     }
//   }, [user]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type !== 'application/pdf') {
//       setError('Please select a PDF file.');
//       setFile(null);
//     } else {
//       setError(null);
//       setFile(selectedFile);
//     }
//   };

//   const handleEdit = (file) => {
//     setEditingFile(file);
//     setFormData({
//       filiere: file.metadata.filiere,
//       module: file.metadata.module,
//       element: file.metadata.element,
//       titre: file.metadata.titre
//     });
//     setFile(null);
//     setError(null);
//     setSuccess(null);
//     document.getElementById('fileInput').value = ''; // Reset file input
//     setIsSidebarOpen(false); // Close sidebar on mobile
//   };

//   const handleCancelEdit = () => {
//     setEditingFile(null);
//     setFormData({
//       filiere: '',
//       module: '',
//       element: '',
//       titre: ''
//     });
//     setFile(null);
//     setError(null);
//     setSuccess(null);
//     document.getElementById('fileInput').value = ''; // Reset file input
//   };

//   const handleDownload = async (object_name) => {
//     if (!user?.token) {
//       setFilesError('Authentication token is missing. Please log in again.');
//       return;
//     }

//     try {
//       const response = await fetch(`http://localhost:8005/download/${encodeURIComponent(object_name)}`, {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error('Unauthorized: Invalid or expired token. Please log in again.');
//         }
//         if (response.status === 404) {
//           throw new Error('File not found. It may have been deleted or moved.');
//         }
//         const data = await response.json();
//         throw new Error(data.detail || `Failed to download file (status: ${response.status}).`);
//       }

//       // Create blob and trigger download
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = object_name;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);

//     } catch (err) {
//       setFilesError(err.message || 'An unexpected error occurred while downloading the file. Please try again later.');
//       console.error('Download failed:', err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!editingFile && (!file || !formData.filiere || !formData.module || !formData.element || !formData.titre)) {
//       setError('Please fill in all fields and select a PDF file.');
//       return;
//     }
//     if (editingFile && !formData.filiere && !formData.module && !formData.element && !formData.titre && !file) {
//       setError('Please provide at least one field or a new file to update.');
//       return;
//     }

//     if (!user?.token) {
//       setError('Authentication token is missing. Please log in again.');
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     const form = new FormData();
//     if (file) {
//       form.append('file', file);
//     }
//     if (formData.filiere) form.append('filiere', formData.filiere);
//     if (formData.module) form.append('module', formData.module);
//     if (formData.element) form.append('element', formData.element);
//     if (formData.titre) form.append('titre', formData.titre);

//     try {
//       const url = editingFile 
//         ? `http://localhost:8005/update/${encodeURIComponent(editingFile.object_name)}`
//         : 'http://localhost:8005/upload/';
//       const method = editingFile ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//         body: form,
//       });

//       let data;
//       try {
//         data = await response.json();
//       } catch {
//         throw new Error(`Server returned an invalid response (status: ${response.status}).`);
//       }

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error('Unauthorized: Invalid or expired token. Please log in again.');
//         }
//         if (response.status === 404) {
//           throw new Error('File not found. It may have been deleted or moved.');
//         }
//         throw new Error(data.detail || `Failed to ${editingFile ? 'update' : 'upload'} file (status: ${response.status}).`);
//       }

//       setSuccess(`File ${editingFile ? 'updated' : 'uploaded'} successfully to bucket ${data.bucket}!`);
//       setFormData({ filiere: '', module: '', element: '', titre: '' });
//       setFile(null);
//       setEditingFile(null);
//       document.getElementById('fileInput').value = ''; // Reset file input
//       await fetchFiles(); // Refresh file list
//     } catch (err) {
//       setError(err.message || `An unexpected error occurred while ${editingFile ? 'updating' : 'uploading'} the file. Please try again later.`);
//       console.error('Request failed:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="flex justify-center items-center h-screen px-4">
//         <p className="text-red-500 text-center text-sm sm:text-base">Please log in to access this page.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
//       {/* Header for Mobile */}
//       <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
//         <h1 className="text-est-blue text-lg font-semibold">Ressources</h1>
//         <button
//           onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           className="text-est-blue text-2xl focus:outline-none"
//           aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
//         >
//           {isSidebarOpen ? <FaTimes /> : <FaBars />}
//         </button>
//       </header>

//       {/* Main Content */}
//       <div className="flex flex-1 flex-col md:flex-row">
//         {/* Sidebar */}
//         <aside className={`sidebar fixed inset-y-0 left-0 w-64 bg-white p-6 shadow-md transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:transform-none md:static md:block transition-transform duration-300 ease-in-out z-20 overflow-y-auto`}>
//           <div className="flex justify-between items-center mb-4 md:hidden">
//             <h2 className="text-est-blue text-lg font-semibold">Menu</h2>
//             <button
//               onClick={() => setIsSidebarOpen(false)}
//               className="text-est-blue text-2xl"
//               aria-label="Close menu"
//             >
//               <FaTimes />
//             </button>
//           </div>
//           <h2 className="text-est-blue text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Enseignement</h2>
//           <ul className="space-y-2">
//             <li>
//               <Link to="/espace-enseignant" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
//                 <FaChalkboardTeacher className="mr-2" /> Mes Cours
//               </Link>
//             </li>
//             <li>
//               <Link to="/upload" className="flex items-center px-3 py-2 rounded bg-gray-100 text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
//                 <FaUpload className="mr-2" /> Télécharger Ressources
//               </Link>
//             </li>
//             <li>
//               <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
//                 <FaClipboardCheck className="mr-2" /> Évaluations
//               </Link>
//             </li>
//           </ul>
          
//           <h2 className="text-est-blue text-lg font-semibold mt-8 mb-4 pb-2 border-b border-gray-200">Encadrement</h2>
//           <ul className="space-y-2">
//             <li>
//               <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
//                 <FaUserEdit className="mr-2" /> Suivi des Étudiants
//               </Link>
//             </li>
//             <li>
//               <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
//                 <FaTasks className="mr-2" /> Projets et Mémoires
//               </Link>
//             </li>
//           </ul>
          
//           <h2 className="text-est-blue text-lg font-semibold mt-8 mb-4 pb-2 border-b border-gray-200">Administration</h2>
//           <ul className="space-y-2">
//             <li>
//               <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
//                 <FaFileAlt className="mr-2" /> Emplois du Temps
//               </Link>
//             </li>
//             <li>
//               <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
//                 <FaCalendarAlt className="mr-2" /> Calendrier Pédagogique
//               </Link>
//             </li>
//             <li>
//               <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
//                 <FaChartLine className="mr-2" /> Statistiques
//               </Link>
//             </li>
//           </ul>
//         </aside>

//         {/* Overlay for Mobile Sidebar */}
//         {isSidebarOpen && (
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" 
//             onClick={() => setIsSidebarOpen(false)}
//             aria-hidden="true"
//           ></div>
//         )}
        
//         {/* Main Content Area */}
//         <main className="flex-1 p-4 sm:p-6 md:p-8 bg-white m-2 sm:m-4 rounded-lg shadow-sm">
//           <div className="welcome-banner bg-est-blue text-white p-4 sm:p-6 md:p-8 rounded-lg mb-4 sm:mb-6 md:mb-8 text-center">
//             <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4">
//               {editingFile ? 'Modifier une Ressource Pédagogique' : 'Télécharger une Ressource Pédagogique'}
//             </h1>
//             <p className="text-sm sm:text-base md:text-lg opacity-90 mb-4 sm:mb-6">
//               {editingFile ? 'Modifiez les détails ou le fichier PDF' : 'Ajoutez vos fichiers PDF pour vos cours'}
//             </p>
//           </div>

//           <div className="upload-form bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 mb-4 sm:mb-6 md:mb-8">
//             <h2 className="text-est-blue text-base sm:text-lg font-semibold mb-4">Formulaire de {editingFile ? 'Modification' : 'Téléchargement'}</h2>
//             {error && (
//               <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>
//             )}
//             {success && (
//               <p className="text-green-500 mb-4 text-sm sm:text-base">{success}</p>
//             )}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label htmlFor="file" className="block text-xs sm:text-sm font-medium text-gray-700">
//                   Fichier PDF {editingFile ? '(facultatif)' : ''}
//                 </label>
//                 <input
//                   id="fileInput"
//                   type="file"
//                   accept=".pdf"
//                   onChange={handleFileChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-est-blue"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="filiere" className="block text-xs sm:text-sm font-medium text-gray-700">
//                   Filière
//                 </label>
//                 <input
//                   type="text"
//                   id="filiere"
//                   name="filiere"
//                   value={formData.filiere}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-est-blue"
//                   placeholder="Ex: Informatique"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="module" className="block text-xs sm:text-sm font-medium text-gray-700">
//                   Module
//                 </label>
//                 <input
//                   type="text"
//                   id="module"
//                   name="module"
//                   value={formData.module}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-est-blue"
//                   placeholder="Ex: Programmation"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="element" className="block text-xs sm:text-sm font-medium text-gray-700">
//                   Élément
//                 </label>
//                 <input
//                   type="text"
//                   id="element"
//                   name="element"
//                   value={formData.element}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-est-blue"
//                   placeholder="Ex: Cours 1"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="titre" className="block text-xs sm:text-sm font-medium text-gray-700">
//                   Titre
//                 </label>
//                 <input
//                   type="text"
//                   id="titre"
//                   name="titre"
//                   value={formData.titre}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-est-blue"
//                   placeholder="Ex: Introduction à Python"
//                 />
//               </div>
//               <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
//                 {editingFile && (
//                   <button
//                     type="button"
//                     onClick={handleCancelEdit}
//                     disabled={loading}
//                     className="w-full bg-gray-200 text-gray-800 px-4 py-2 sm:py-3 rounded hover:bg-gray-300 transition text-sm sm:text-base"
//                   >
//                     Annuler
//                   </button>
//                 )}
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className={`w-full bg-est-blue text-white px-4 py-2 sm:py-3 rounded hover:bg-blue-900 transition text-sm sm:text-base ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   {loading ? (editingFile ? 'Modification...' : 'Téléchargement...') : (editingFile ? 'Modifier' : 'Télécharger')}
//                 </button>
//               </div>
//             </form>
//           </div>

//           <div className="files-list bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
//             <h2 className="text-est-blue text-base sm:text-lg font-semibold mb-4">Mes Fichiers Téléchargés</h2>
//             {filesError && (
//               <p className="text-red-500 mb-4 text-sm sm:text-base">{filesError}</p>
//             )}
//             {filesLoading ? (
//               <div className="flex justify-center items-center">
//                 <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-est-blue"></div>
//               </div>
//             ) : files.length === 0 ? (
//               <p className="text-gray-600 text-sm sm:text-base">Aucun fichier téléchargé pour le moment.</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom du Fichier</th>
//                       <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filière</th>
//                       <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
//                       <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Élément</th>
//                       <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
//                       <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {files.map((file, index) => (
//                       <tr key={index}>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{file.object_name}</td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{file.metadata.filiere}</td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{file.metadata.module}</td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{file.metadata.element}</td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{file.metadata.titre}</td>
//                         <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
//                           <div className="flex space-x-4">
//                             <button
//                               onClick={() => handleEdit(file)}
//                               className="text-est-blue hover:text-blue-900 flex items-center"
//                               title="Modifier"
//                             >
//                               <FaEdit className="inline mr-1" /> Modifier
//                             </button>
//                             <button
//                               onClick={() => handleDownload(file.object_name)}
//                               className="text-est-blue hover:text-blue-900 flex items-center"
//                               title="Télécharger"
//                             >
//                               <FaDownload className="inline mr-1" /> {file.object_name}{/* Télécharger */}
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//                 {/* Mobile File List */}
//                 <div className="sm:hidden space-y-4">
//                   {files.map((file, index) => (
//                     <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
//                       <p className="text-xs font-medium text-gray-700 break-words"><span className="font-semibold">Nom:</span> {file.object_name}</p>
//                       <p className="text-xs text-gray-600"><span className="font-semibold">Filière:</span> {file.metadata.filiere}</p>
//                       <p className="text-xs text-gray-600"><span className="font-semibold">Module:</span> {file.metadata.module}</p>
//                       <p className="text-xs text-gray-600"><span className="font-semibold">Élément:</span> {file.metadata.element}</p>
//                       <p className="text-xs text-gray-600"><span className="font-semibold">Titre:</span> {file.metadata.titre}</p>
//                       <div className="mt-2 flex space-x-4">
//                         <button
//                           onClick={() => handleEdit(file)}
//                           className="text-est-blue hover:text-blue-900 text-xs flex items-center"
//                           title="Modifier"
//                         >
//                           <FaEdit className="inline mr-1" /> Modifier
//                         </button>
//                         <button
//                           onClick={() => handleDownload(file.object_name)}
//                           className="text-est-blue hover:text-blue-900 text-xs flex items-center"
//                           title="Télécharger"
//                         >
//                           <FaDownload className="inline mr-1" /> Télécharger
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
      
//       {/* AI Assistant */}
//       <div 
//         className="ai-assistant fixed bottom-4 sm:bottom-8 right-4 sm:right-8 bg-est-blue text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition z-30" 
//         title="Assistant IA Ollama"
//       >
//         <FaRobot className="text-xl sm:text-2xl" />
//       </div>
//     </div>
//   );
// };

// export default UploadPage;




import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaChalkboardTeacher, 
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
  FaUpload,
  FaEdit,
  FaBars,
  FaTimes,
  FaDownload
} from 'react-icons/fa';

const UploadPage = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    filiere: '',
    module: '',
    element: '',
    titre: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [files, setFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [filesError, setFilesError] = useState(null);
  const [editingFile, setEditingFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [filiereOptions, setFiliereOptions] = useState([]);

  // Fetch uploaded files
  const fetchFiles = async (filiere = '') => {
    if (!user?.token) {
      setFilesError('Authentication token is missing. Please log in again.');
      return;
    }

    setFilesLoading(true);
    setFilesError(null);

    try {
      const url = filiere 
        ? `http://localhost:8002/list-files/?filiere=${encodeURIComponent(filiere)}`
        : 'http://localhost:8002/list-files/';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();
      console.log('List files response:', data); // Debug response
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token. Please log in again.');
        }
        throw new Error(data.detail || `Failed to fetch files (status: ${response.status}).`);
      }

      setFiles(data.files || []);
      // Update filiere options only when fetching unfiltered list
      if (!filiere) {
        const uniqueFilieres = [...new Set(data.files.map(file => file.metadata.filiere))].filter(Boolean);
        setFiliereOptions(uniqueFilieres);
      }
    } catch (err) {
      setFilesError(err.message || 'An unexpected error occurred while fetching files. Please try again later.');
    } finally {
      setFilesLoading(false);
    }
  };

  // Fetch files on mount and after successful upload/update
  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      setFile(null);
    } else {
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleEdit = (file) => {
    setEditingFile(file);
    setFormData({
      filiere: file.metadata.filiere,
      module: file.metadata.module,
      element: file.metadata.element,
      titre: file.metadata.titre
    });
    setFile(null);
    setError(null);
    setSuccess(null);
    document.getElementById('fileInput').value = ''; // Reset file input
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  const handleCancelEdit = () => {
    setEditingFile(null);
    setFormData({
      filiere: '',
      module: '',
      element: '',
      titre: ''
    });
    setFile(null);
    setError(null);
    setSuccess(null);
    document.getElementById('fileInput').value = ''; // Reset file input
  };

  const handleDownload = async (object_name) => {
    if (!user?.token) {
      setFilesError('Authentication token is missing. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8002/download/${encodeURIComponent(object_name)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token. Please log in again.');
        }
        if (response.status === 404) {
          throw new Error('File not found. It may have been deleted or moved.');
        }
        const data = await response.json();
        throw new Error(data.detail || `Failed to download file (status: ${response.status}).`);
      }

      // Create blob and trigger download
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
      console.error('Download failed:', err);
    }
  };

  const handleFiliereChange = (e) => {
    const filiere = e.target.value;
    setSelectedFiliere(filiere);
    fetchFiles(filiere);
  };

  const handleClearFilter = () => {
    setSelectedFiliere('');
    fetchFiles();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingFile && (!file || !formData.filiere || !formData.module || !formData.element || !formData.titre)) {
      setError('Please fill in all fields and select a PDF file.');
      return;
    }
    if (editingFile && !formData.filiere && !formData.module && !formData.element && !formData.titre && !file) {
      setError('Please provide at least one field or a new file to update.');
      return;
    }

    if (!user?.token) {
      setError('Authentication token is missing. Please log in again.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = new FormData();
    if (file) {
      form.append('file', file);
    }
    if (formData.filiere) form.append('filiere', formData.filiere);
    if (formData.module) form.append('module', formData.module);
    if (formData.element) form.append('element', formData.element);
    if (formData.titre) form.append('titre', formData.titre);

    try {
      const url = editingFile 
        ? `http://localhost:8002/update/${encodeURIComponent(editingFile.object_name)}`
        : 'http://localhost:8002/upload/';
      const method = editingFile ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: form,
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error(`Server returned an invalid response (status: ${response.status}).`);
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid or expired token. Please log in again.');
        }
        if (response.status === 404) {
          throw new Error('File not found. It may have been deleted or moved.');
        }
        throw new Error(data.detail || `Failed to ${editingFile ? 'update' : 'upload'} file (status: ${response.status}).`);
      }

      setSuccess(`File ${editingFile ? 'updated' : 'uploaded'} successfully to bucket ${data.bucket}!`);
      setFormData({ filiere: '', module: '', element: '', titre: '' });
      setFile(null);
      setEditingFile(null);
      document.getElementById('fileInput').value = ''; // Reset file input
      await fetchFiles(selectedFiliere); // Refresh file list with current filter
    } catch (err) {
      setError(err.message || `An unexpected error occurred while ${editingFile ? 'updating' : 'uploading'} the file. Please try again later.`);
      console.error('Request failed:', err);
    } finally {
      setLoading(false);
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
        <h1 className="text-est-blue text-lg font-semibold">Ressources</h1>
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
          <h2 className="text-est-blue text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Enseignement</h2>
          <ul className="space-y-2">
            <li>
              <Link to="/espace-enseignant" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
                <FaChalkboardTeacher className="mr-2" /> Mes Cours
              </Link>
            </li>
            <li>
              <Link to="/upload" className="flex items-center px-3 py-2 rounded bg-gray-100 text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
                <FaUpload className="mr-2" /> Télécharger Ressources
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
                <FaClipboardCheck className="mr-2" /> Évaluations
              </Link>
            </li>
          </ul>
          
          <h2 className="text-est-blue text-lg font-semibold mt-8 mb-4 pb-2 border-b border-gray-200">Encadrement</h2>
          <ul className="space-y-2">
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
                <FaUserEdit className="mr-2" /> Suivi des Étudiants
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
                <FaTasks className="mr-2" /> Projets et Mémoires
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
                <FaCalendarAlt className="mr-2" /> Calendrier Pédagogique
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center px-3 py-2 rounded hover:bg-gray-100 hover:text-est-blue text-sm sm:text-base" onClick={() => setIsSidebarOpen(false)}>
                <FaChartLine className="mr-2" /> Statistiques
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
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-4">
              {editingFile ? 'Modifier une Ressource Pédagogique' : 'Télécharger une Ressource Pédagogique'}
            </h1>
            <p className="text-sm sm:text-base md:text-lg opacity-90 mb-4 sm:mb-6">
              {editingFile ? 'Modifiez les détails ou le fichier PDF' : 'Ajoutez vos fichiers PDF pour vos cours'}
            </p>
          </div>

          <div className="upload-form bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-est-blue text-base sm:text-lg font-semibold mb-4">Formulaire de {editingFile ? 'Modification' : 'Téléchargement'}</h2>
            {error && (
              <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>
            )}
            {success && (
              <p className="text-green-500 mb-4 text-sm sm:text-base">{success}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="file" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Fichier PDF {editingFile ? '(facultatif)' : ''}
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-est-blue"
                />
              </div>
              <div>
                <label htmlFor="filiere" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Filière
                </label>
                <input
                  type="text"
                  id="filiere"
                  name="filiere"
                  value={formData.filiere}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-est-blue"
                  placeholder="Ex: Informatique"
                />
              </div>
              <div>
                <label htmlFor="module" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Module
                </label>
                <input
                  type="text"
                  id="module"
                  name="module"
                  value={formData.module}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-est-blue"
                  placeholder="Ex: Programmation"
                />
              </div>
              <div>
                <label htmlFor="element" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Élément
                </label>
                <input
                  type="text"
                  id="element"
                  name="element"
                  value={formData.element}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-est-blue"
                  placeholder="Ex: Cours 1"
                />
              </div>
              <div>
                <label htmlFor="titre" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Titre
                </label>
                <input
                  type="text"
                  id="titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-est-blue"
                  placeholder="Ex: Introduction à Python"
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                {editingFile && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="w-full bg-gray-200 text-gray-800 px-4 py-2 sm:py-3 rounded hover:bg-gray-300 transition text-sm sm:text-base"
                  >
                    Annuler
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-est-blue text-white px-4 py-2 sm:py-3 rounded hover:bg-blue-900 transition text-sm sm:text-base ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (editingFile ? 'Modification...' : 'Téléchargement...') : (editingFile ? 'Modifier' : 'Télécharger')}
                </button>
              </div>
            </form>
          </div>

          <div className="files-list bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-est-blue text-base sm:text-lg font-semibold">Mes Fichiers Téléchargés</h2>
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                <select
                  value={selectedFiliere}
                  onChange={handleFiliereChange}
                  className="px-3 py-2 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-est-blue"
                >
                  <option value="">Toutes les filières</option>
                  {filiereOptions.map((filiere, index) => (
                    <option key={index} value={filiere}>{filiere}</option>
                  ))}
                </select>
                {selectedFiliere && (
                  <button
                    onClick={handleClearFilter}
                    className="px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition text-xs sm:text-sm"
                  >
                    Effacer le filtre
                  </button>
                )}
              </div>
            </div>
            {filesError && (
              <p className="text-red-500 mb-4 text-sm sm:text-base">{filesError}</p>
            )}
            {filesLoading ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-t-2 border-b-2 border-est-blue"></div>
              </div>
            ) : files.length === 0 ? (
              <p className="text-gray-600 text-sm sm:text-base">{selectedFiliere ? `Aucun fichier trouvé pour la filière ${selectedFiliere}.` : 'Aucun fichier téléchargé pour le moment.'}</p>
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
                          <div className="flex space-x-4">
                            <button
                              onClick={() => handleEdit(file)}
                              className="text-est-blue hover:text-blue-900 flex items-center"
                              title="Modifier"
                            >
                              <FaEdit className="inline mr-1" /> Modifier
                            </button>
                            <button
                              onClick={() => handleDownload(file.object_name)}
                              className="text-est-blue hover:text-blue-900 flex items-center"
                              title="Télécharger"
                            >
                              <FaDownload className="inline mr-1" /> Télécharger
                            </button>
                          </div>
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
                      <div className="mt-2 flex space-x-4">
                        <button
                          onClick={() => handleEdit(file)}
                          className="text-est-blue hover:text-blue-900 text-xs flex items-center"
                          title="Modifier"
                        >
                          <FaEdit className="inline mr-1" /> Modifier
                        </button>
                        <button
                          onClick={() => handleDownload(file.object_name)}
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

export default UploadPage;