import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Explicitly import from AuthContext

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user?.role === 'etudiant') {
      navigate('/profil/etudiant');
    } else if (user?.role === 'enseignant') {
      navigate('/profil/enseignant');
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate('/login');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-est-blue text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="/assets/images/logo.png" alt="Logo EST Salé" className="h-10 mr-3" />
            <Link to="/" className="text-xl md:text-2xl font-bold">EST Salé</Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 lg:space-x-6 items-center">
            <Link to="/" className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition">Accueil</Link>
            <Link to="/formations" className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition">Formations</Link>
            <Link to="/actualites" className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition">Actualités</Link>
            <Link to="/evenements" className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition">Événements</Link>
            <Link to="/contact" className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition">Contact</Link>
            
            {user?.role === 'etudiant' && (
              <Link to="/espace-etudiant" className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition">
                Espace Étudiant
              </Link>
            )}
            
            {user?.role === 'enseignant' && (
              <Link to="/espace-enseignant" className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition">
                Espace Enseignant
              </Link>
            )}
            
            {user ? (
              <>
                <button 
                  onClick={handleProfileClick}
                  className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition"
                >
                  Mon Profil
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-1 bg-est-yellow text-black rounded hover:bg-yellow-600 transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <button
                onClick={handleLoginClick}
                className="px-3 py-1 bg-est-yellow text-black rounded hover:bg-yellow-600 transition"
              >
                Connexion
              </button>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden bg-est-blue ${mobileMenuOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden transition-all duration-300`}>
          <div className="flex flex-col space-y-2 px-4 py-3">
            <Link to="/" className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
            <Link to="/formations" className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition" onClick={() => setMobileMenuOpen(false)}>Formations</Link>
            <Link to="/actualites" className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition" onClick={() => setMobileMenuOpen(false)}>Actualités</Link>
            <Link to="/evenements" className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition" onClick={() => setMobileMenuOpen(false)}>Événements</Link>
            <Link to="/contact" className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            
            {user?.role === 'etudiant' && (
              <Link 
                to="/espace-etudiant" 
                className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Espace Étudiant
              </Link>
            )}
            
            {user?.role === 'enseignant' && (
              <Link 
                to="/espace-enseignant" 
                className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Espace Enseignant
              </Link>
            )}
            
            {user ? (
              <>
                <button 
                  onClick={handleProfileClick}
                  className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition text-left"
                >
                  Mon Profil
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 bg-est-yellow text-black rounded hover:bg-yellow-600 transition text-left"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <button
                onClick={handleLoginClick}
                className="px-3 py-2 bg-est-yellow text-black rounded hover:bg-yellow-600 transition text-left"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;







// // src/components/common/Navbar.js
// import React, { useState } from 'react';
// import Login from '../../components/Auth/Login';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';

// const Navbar = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const { user, logout } = useAuth();
//   const { login, loading } = useAuth();
//   const navigate = useNavigate();

//   const handleProfileClick = () => {
//     if (user?.role === 'etudiant') {
//       navigate('/profil/etudiant');
//     } else if (user?.role === 'enseignant') {
//       navigate('/profil/enseignant');
//     }
//     setMobileMenuOpen(false);
//   };

//   const handleLogout = async () => {
//     await logout();
//     navigate('/');
//     setMobileMenuOpen(false);
//   };

//   return (
//     <header className="bg-est-blue text-white shadow-md sticky top-0 z-50">
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center">
//             <img src="/assets/images/logo.png" alt="Logo EST Salé" className="h-10 mr-3" />
//             <Link to="/" className="text-xl md:text-2xl font-bold">EST Salé</Link>
//           </div>
          
//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex space-x-1 lg:space-x-6 items-center">
//             <Link to="/" className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition">Accueil</Link>
//             <Link to="/formations" className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition">Formations</Link>
//             <Link to="/actualites" className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition">Actualités</Link>
//             <Link to="/evenements" className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition">Événements</Link>
//             <Link to="/contact" className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition">Contact</Link>
            
//             {user?.role === 'etudiant' && (
//               <Link to="/espace-etudiant" className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition">
//                 Espace Étudiant
//               </Link>
//             )}
            
//             {user?.role === 'enseignant' && (
//               <Link to="/espace-enseignant" className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition">
//                 Espace Enseignant
//               </Link>
//             )}
            
//             {user ? (
//               <>
//                 <button 
//                   onClick={handleProfileClick}
//                   className="px-3 py-1 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition"
//                 >
//                   Mon Profil
//                 </button>
//                 <button 
//                   onClick={handleLogout}
//                   className="px-3 py-1 bg-est-yellow text-black rounded hover:bg-yellow-600 transition"
//                 >
//                   Déconnexion
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={login}
//                 disabled={loading}
//                 className="px-3 py-1 bg-est-yellow text-black rounded hover:bg-yellow-600 transition"
//               >
//                 {loading ? 'Chargement...' : 'Connexion'}
//               </button>
//             )}
//           </nav>
          
//           {/* Mobile Menu Button */}
//           <button 
//             className="md:hidden text-white focus:outline-none"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
//             </svg>
//           </button>
//         </div>
        
//         {/* Mobile Menu */}
//         <div className={`md:hidden bg-est-blue ${mobileMenuOpen ? 'max-h-screen' : 'max-h-0'} overflow-hidden transition-all duration-300`}>
//           <div className="flex flex-col space-y-2 px-4 py-3">
//             <Link to="/" className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
//             <Link to="/formations" className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition" onClick={() => setMobileMenuOpen(false)}>Formations</Link>
//             <Link to="/actualites" className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition" onClick={() => setMobileMenuOpen(false)}>Actualités</Link>
//             <Link to="/evenements" className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition" onClick={() => setMobileMenuOpen(false)}>Événements</Link>
//             <Link to="/contact" className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            
//             {user?.role === 'etudiant' && (
//               <Link 
//                 to="/espace-etudiant" 
//                 className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition" 
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 Espace Étudiant
//               </Link>
//             )}
            
//             {user?.role === 'enseignant' && (
//               <Link 
//                 to="/espace-enseignant" 
//                 className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition" 
//                 onClick={() => setMobileMenuOpen(false)}
//               >
//                 Espace Enseignant
//               </Link>
//             )}
            
//             {user ? (
//               <>
//                 <button 
//                   onClick={handleProfileClick}
//                   className="px-3 py-2 rounded hover:bg-est-light-blue hover:bg-opacity-30 transition text-left"
//                 >
//                   Mon Profil
//                 </button>
//                 <button 
//                   onClick={handleLogout}
//                   className="px-3 py-2 bg-est-yellow text-black rounded hover:bg-yellow-600 transition text-left"
//                 >
//                   Déconnexion
//                 </button>
//               </>
//             ) : (
//               <button
//                 onClick={login}
//                 disabled={loading}
//                 className="px-3 py-2 bg-est-yellow text-black rounded hover:bg-yellow-600 transition text-left"
//               >
//                 {loading ? 'Chargement...' : 'Connexion'}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;