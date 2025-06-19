// // // src/context/AuthContext.jsx
// // import React, { createContext, useContext, useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import {
// //   login as authLogin,
// //   logout as authLogout,
// //   getCurrentUser
// // } from '../services/authService';

// // const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const initializeAuth = async () => {
// //       try {
// //         const accessToken = localStorage.getItem('access_token');
// //         if (accessToken) {
// //           const userData = await getCurrentUser();
// //           if (userData) {
// //             setUser(userData);
// //           } else {
// //             // Failed to fetch user - invalid token
// //             handleLogout();
// //           }
// //         }
// //       } catch (err) {
// //         console.error('Failed to initialize auth:', err);
// //         handleLogout();
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     initializeAuth();
// //   }, []);

// //   const handleLogin = async (username, password) => {
// //     try {
// //       const tokens = await authLogin(username, password);
// //       const userData = await getCurrentUser();
// //       setUser(userData);
// //       navigate('/');
// //     } catch (error) {
// //       throw error;
// //     }
// //   };

// //   const handleLogout = () => {
// //     authLogout();
// //     setUser(null);
// //     navigate('/login');
// //   };

// //   return (
// //     <AuthContext.Provider value={{ user, loading, login: handleLogin, logout: handleLogout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// // export const useAuth = () => useContext(AuthContext);





// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   login as authLogin,
//   logout as authLogout,
//   getCurrentUser
// } from '../services/authService';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const accessToken = localStorage.getItem('access_token');
//         if (accessToken) {
//           const userData = await getCurrentUser();
//           if (userData) {
//             console.log('Initialized user:', userData.username); // Debug
//             setUser(userData);
//           } else {
//             console.warn('Invalid token, logging out');
//             await handleLogout();
//           }
//         }
//       } catch (err) {
//         console.error('Failed to initialize auth:', err);
//         await handleLogout();
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   const handleLogin = async (username, password) => {
//     try {
//       const tokens = await authLogin(username, password);
//       const userData = await getCurrentUser();
//       console.log('Logged in user:', userData.username); // Debug
//       setUser(userData);
//       navigate('/', { replace: true }); // Replace history to prevent back navigation
//     } catch (error) {
//       console.error('Login failed:', error);
//       throw error;
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       console.log('Logging out user:', user?.username); // Debug
//       await authLogout();
//       setUser(null);
//       localStorage.clear();
//       navigate('/login', { replace: true }); // Replace history
//       window.location.reload(); // Force full reload to reset app state
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login: handleLogin, logout: handleLogout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);




import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login as authLogin,
  logout as authLogout,
  getCurrentUser
} from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          const userData = await getCurrentUser();
          if (userData) {
            console.log('Initialized user:', userData.username); // Debug
            setUser({ ...userData, token: accessToken }); // Include token in user object
          } else {
            console.warn('Invalid token, logging out');
            await handleLogout();
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        await handleLogout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const tokens = await authLogin(username, password);
      localStorage.setItem('access_token', tokens.access_token); // Store token
      const userData = await getCurrentUser();
      console.log('Logged in user:', userData.username); // Debug
      setUser({ ...userData, token: tokens.access_token }); // Include token in user object
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out user:', user?.username); // Debug
      await authLogout();
      setUser(null);
      localStorage.clear();
      navigate('/login', { replace: true });
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);