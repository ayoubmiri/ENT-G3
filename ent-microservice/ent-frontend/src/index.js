// import React from 'react';
// import App from './App';
// import './styles/tailwind.css';
// // src/index.js
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';  // <-- import AuthProvider


// // const container = document.getElementById('root');
// // const root = createRoot(container);

// // root.render(
// //   <React.StrictMode>
// //     <BrowserRouter>
// //       <AuthProvider>
// //         <App />
// //       </AuthProvider>
// //     </BrowserRouter>
// //   </React.StrictMode>
// // );


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//       <Router>           
//         <AuthProvider>    
//           <App />
//         </AuthProvider>
//       </Router>
//   </React.StrictMode>
// );
import React from 'react';
import App from './App';
import './styles/tailwind.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Router>           
        <AuthProvider>    
          <App />
        </AuthProvider>
      </Router>
  </React.StrictMode>
);
