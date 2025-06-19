// // // Mock API service - replace with real API calls later
// // export const fetchNews = async () => {
// //   // Simulate API delay
// //   await new Promise(resolve => setTimeout(resolve, 500));
  
// //   return [
// //     {
// //       id: 1,
// //       title: "Nouveau programme de génie logiciel",
// //       date: "15 Mars 2025",
// //       description: "Découvrez notre programme renouvelé avec des modules sur l'IA, le cloud computing et la cybersécurité.",
// //       image: "/assets/images/news1.jpg"
// //     },
// //     // More mock news
// //   ];
// // };

// // export const fetchPrograms = async () => {
// //   // Similar mock implementation
// // };

// // export const fetchEvents = async () => {
// //   // Similar mock implementation
// // };



// import axios from 'axios';

// const api = axios.create({
//   baseURL:  'http://localhost:8001/api/v1', 
// });

// // Add request interceptor for token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//     // console.log(localStorage.getItem('access_token'));

//   }
//   return config;
// });

// export default api;


import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8001/api/v1' ,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
  withCredentials: false,
});

// Add interceptor to include Keycloak token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token'); // Adjust based on your Keycloak token storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;