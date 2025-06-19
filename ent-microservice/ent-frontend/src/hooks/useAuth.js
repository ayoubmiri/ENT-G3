import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token'); // Changed from 'token' to 'access_token'
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  return { isAuthenticated, loading };
};



// import { useState, useEffect } from 'react';

// export const useAuth = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         // Decode token or fetch user data; assuming token contains user info or role
//         // For simplicity, assuming role is stored in localStorage or derived from token
//         const storedRole = localStorage.getItem('userRole'); // Adjust based on your setup
//         setUser({ role: storedRole || 'etudiant' }); // Default to 'etudiant' if no role
//         setIsAuthenticated(true);
//       } catch (error) {
//         console.error('Error decoding token:', error);
//         setIsAuthenticated(false);
//         setUser(null);
//       }
//     } else {
//       setIsAuthenticated(false);
//       setUser(null);
//     }
//     setLoading(false);
//   }, []);

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userRole'); // Remove role if stored
//     setIsAuthenticated(false);
//     setUser(null);
//   };

//   return { isAuthenticated, user, logout, loading };
// };





// // import { useState, useEffect } from 'react';

// // export const useAuth = () => {
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const token = localStorage.getItem('token');
// //     setIsAuthenticated(!!token);
// //     setLoading(false);
// //   }, []);

// //   return { isAuthenticated, loading };
// // };