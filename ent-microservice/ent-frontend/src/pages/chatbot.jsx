


// // import React, { useState, useEffect, useRef } from 'react';
// // import { useAuth } from '../contexts/AuthContext';
// // import axios from 'axios';
// // import { getStudentByEmail } from '../services/studentService';

// // const ChatBot = () => {
// //   const { user, loading: authLoading } = useAuth();
// //   const [message, setMessage] = useState('');
// //   const [conversation, setConversation] = useState([]);
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [userId, setUserId] = useState('');
// //   const messagesRef = useRef(null);

// //   const scrollToBottom = () => {
// //     messagesRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   };

// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [conversation]);

// //   // Fetch user_id if not directly available
// //   useEffect(() => {
// //     if (authLoading || !user?.email) {
// //       return;
// //     }

// //     const fetchUserId = async () => {
// //       let id = user.user_id || user.sub;

// //       if (!id) {
// //         try {
// //           const emailResponse = await getStudentByEmail(user.email, { _t: Date.now() });
// //           const studentByEmail = Array.isArray(emailResponse)
// //             ? emailResponse.find(student => student.email === user.email)
// //             : emailResponse;

// //           if (!studentByEmail?.id) {
// //             throw new Error(`Student ID not found for email: ${user.email}`);
// //           }
// //           id = studentByEmail.id;
// //         } catch (err) {
// //           setError('Impossible de récupérer l’identifiant utilisateur. Veuillez réessayer.');
// //           return;
// //         }
// //       }

// //       setUserId(id);
// //     };

// //     fetchUserId();
// //   }, [user, authLoading]);

// //   // Fetch conversation history
// //   useEffect(() => {
// //     if (!userId || !user?.token) {
// //       return;
// //     }

// //     const fetchHistory = async () => {
// //       setLoading(true);
// //       try {
// //         const res = await axios.get('http://localhost:8004/api/v1/user/history', {
// //           headers: {
// //             Authorization: `Bearer ${user.token}`,
// //           },
// //         });
// //         setConversation(
// //           (res.data.history || []).map((msg) => ({
// //             text: msg.message_text,
// //             isUser: msg.is_user,
// //             timestamp: msg.timestamp || new Date().toISOString(),
// //           }))
// //         );
// //       } catch (err) {
// //         setError('Échec du chargement de l’historique des conversations.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchHistory();
// //   }, [userId, user?.token]);

// //   // Send message via REST API and get bot response
// //   const handleSendMessage = async (e) => {
// //     e.preventDefault();
// //     if (!message.trim()) {
// //       setError('Le message ne peut pas être vide.');
// //       return;
// //     }

// //     setLoading(true);
// //     setError('');

// //     try {
// //       // Add user message to conversation
// //       const userMessage = {
// //         text: message,
// //         isUser: true,
// //         timestamp: new Date().toISOString(),
// //       };
// //       setConversation((prev) => [...prev, userMessage]);

// //       // Send message to backend and get response
// //       const res = await axios.post(
// //         `http://localhost:8004/api/v1/chat/${userId}`,
// //         { message_text: message },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${user.token}`,
// //           },
// //         }
// //       );

// //       const botMessage = {
// //         text: res.data.reply || 'Pas de réponse du serveur.',
// //         isUser: false,
// //         timestamp: new Date().toISOString(),
// //       };

// //       setConversation((prev) => [...prev, botMessage]);
// //       setMessage('');
// //     } catch (err) {
// //       setError('Échec de l’envoi du message ou de la réception de la réponse.');
// //       console.error(err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   if (authLoading || loading) {
// //     return (
// //       <div className="flex justify-center items-center h-screen">
// //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-est-blue"></div>
// //       </div>
// //     );
// //   }

// //   if (!user || !user.email) {
// //     return (
// //       <div className="flex justify-center items-center h-screen">
// //         <p className="text-red-600">Veuillez vous connecter pour accéder au chatbot.</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
// //       <main className="flex-1 p-8 bg-white m-4 rounded-lg shadow-sm">
// //         <h2 className="text-2xl font-bold mb-4 text-est-blue">Assistant IA</h2>
// //         <div className="space-y-4">
// //           <div className="h-96 overflow-y-auto border border-gray-300 rounded-md p-4 bg-gray-50">
// //             {conversation.length === 0 && (
// //               <p className="text-gray-500 text-center">Commencez une conversation !</p>
// //             )}
// //             {conversation.map((msg, index) => (
// //               <div
// //                 key={index}
// //                 className={`mb-2 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
// //               >
// //                 <div
// //                   className={`max-w-xs p-3 rounded-lg ${
// //                     msg.isUser ? 'bg-est-blue text-white' : 'bg-gray-200 text-gray-800'
// //                   }`}
// //                 >
// //                   <p className="text-sm">{msg.text}</p>
// //                   <p className={`text-xs ${msg.isUser ? 'text-gray-200' : 'text-gray-400'} mt-1`}>
// //                     {new Date(msg.timestamp).toLocaleTimeString()}
// //                   </p>
// //                 </div>
// //               </div>
// //             ))}
// //             <div ref={messagesRef} />
// //           </div>
// //           <div className="search-bar flex">
// //             <input
// //               type="text"
// //               value={message}
// //               onChange={(e) => setMessage(e.target.value)}
// //               placeholder="Tapez votre message..."
// //               className="flex-1 px-4 py-3 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-est-blue"
// //             />
// //             <button
// //               onClick={handleSendMessage}
// //               disabled={loading || !message.trim()}
// //               className={`px-6 py-3 rounded-r text-white font-medium ${
// //                 loading || !message.trim()
// //                   ? 'bg-gray-400 cursor-not-allowed'
// //                   : 'bg-est-blue hover:bg-blue-900'
// //               }`}
// //             >
// //               {loading ? 'Envoi...' : 'Envoyer'}
// //             </button>
// //           </div>
// //         </div>
// //         {error && (
// //           <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
// //             <h3 className="text-lg font-medium text-red-800">Erreur</h3>
// //             <p className="mt-2 text-sm text-red-700">{error}</p>
// //           </div>
// //         )}
// //       </main>
// //     </div>
// //   );
// // };

// // export default ChatBot;



// import React, { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import axios from 'axios';
// import { getStudentByEmail } from '../services/studentService';

// const ChatBot = () => {
//   const { user, loading: authLoading } = useAuth();
//   const [message, setMessage] = useState('');
//   const [conversation, setConversation] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [userId, setUserId] = useState('');
//   const messagesRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [conversation]);

//   // Fetch user_id if not directly available
//   useEffect(() => {
//     if (authLoading || !user?.email) {
//       return;
//     }

//     const fetchUserId = async () => {
//       let id = user.id ;

//       if (!id) {
//         try {
//           const accessToken = localStorage.getItem('access_token');
//           if (!accessToken) {
//             throw new Error('No access token found. Please log in again.');
//           }
//           console.log('Fetching student by email:', user.email); // Debug
//           const emailResponse = await getStudentByEmail(user.email, { _t: Date.now() });
//           console.log('Email response:', emailResponse); // Debug
//           const studentByEmail = Array.isArray(emailResponse)
//             ? emailResponse.find(student => student.email === user.email)
//             : emailResponse;

//           if (!studentByEmail?.id) {
//             throw new Error(`Student ID not found for email: ${user.email}`);
//           }
//           id = studentByEmail.id;
//           console.log('Fetched userId:', id); // Debug
//         } catch (err) {
//           console.error('Error fetching user ID:', err);
//           setError('Impossible de récupérer l’identifiant utilisateur. Veuillez réessayer.');
//           return;
//         }
//       }

//       setUserId(id);
//     };

//     fetchUserId();
//   }, [user, authLoading]);

//   // Fetch conversation history
//   useEffect(() => {
//     if (!userId || authLoading) {
//       return;
//     }

//     const accessToken = localStorage.getItem('access_token');
//     if (!accessToken) {
//       setError('Veuillez vous connecter pour accéder à l’historique des conversations.');
//       return;
//     }

//     const fetchHistory = async () => {
//       setLoading(true);
//       try {
//         console.log('Fetching conversation history for userId:', userId); // Debug
//         const res = await axios.get('http://localhost:8004/api/v1/user/history', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         console.log('History response:', res.data); // Debug
//         setConversation(
//           (res.data.history || []).map((msg) => ({
//             text: msg.message_text || msg.content, // Handle backend field name
//             isUser: msg.is_user,
//             timestamp: msg.timestamp || new Date().toISOString(),
//           }))
//         );
//       } catch (err) {
//         console.error('Error fetching history:', err.response?.data || err.message);
//         setError('Échec du chargement de l’historique des conversations.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [userId, authLoading]);

//   // Send message via REST API and get bot response
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     if (!message.trim()) {
//       setError('Le message ne peut pas être vide.');
//       return;
//     }

//     const accessToken = localStorage.getItem('access_token');
//     if (!accessToken) {
//       setError('Veuillez vous connecter pour envoyer un message.');
//       window.location.href = '/login';
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // Add user message to conversation
//       const userMessage = {
//         text: message,
//         isUser: true,
//         timestamp: new Date().toISOString(),
//       };
//       setConversation((prev) => [...prev, userMessage]);

//       // Send message to backend and get response
//       console.log('Sending message for userId:', userId); // Debug
//       const res = await axios.post(
//         `http://localhost:8004/api/v1/chat/${userId}`,
//         { content: message }, // Match SendMessageRequest
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       console.log('Chat response:', res.data); // Debug

//       const botMessage = {
//         text: res.data.content || res.data.reply || 'Pas de réponse du serveur.',
//         isUser: false,
//         timestamp: new Date().toISOString(),
//       };

//       setConversation((prev) => [...prev, botMessage]);
//       setMessage('');
//     } catch (err) {
//       console.error('Error sending message:', err.response?.data || err.message);
//       setError('Échec de l’envoi du message ou de la réception de la réponse.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (authLoading || loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-est-blue"></div>
//       </div>
//     );
//   }

//   if (!user || !user.email) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-red-600">Veuillez vous connecter pour accéder au chatbot.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
//       <main className="flex-1 p-8 bg-white m-4 rounded-lg shadow-sm">
//         <h2 className="text-2xl font-bold mb-4 text-est-blue">Assistant IA</h2>
//         <div className="space-y-4">
//           <div className="h-96 overflow-y-auto border border-gray-300 rounded-md p-4 bg-gray-50">
//             {conversation.length === 0 && (
//               <p className="text-gray-500 text-center">Commencez une conversation !</p>
//             )}
//             {conversation.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`mb-2 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div
//                   className={`max-w-xs p-3 rounded-lg ${
//                     msg.isUser ? 'bg-est-blue text-white' : 'bg-gray-200 text-gray-800'
//                   }`}
//                 >
//                   <p className="text-sm">{msg.text}</p>
//                   <p className={`text-xs ${msg.isUser ? 'text-gray-200' : 'text-gray-400'} mt-1`}>
//                     {new Date(msg.timestamp).toLocaleTimeString()}
//                   </p>
//                 </div>
//               </div>
//             ))}
//             <div ref={messagesRef} />
//           </div>
//           <div className="search-bar flex">
//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Tapez votre message..."
//               className="flex-1 px-4 py-3 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-est-blue"
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={loading || !message.trim()}
//               className={`px-6 py-3 rounded-r text-white font-medium ${
//                 loading || !message.trim()
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : 'bg-est-blue hover:bg-blue-900'
//               }`}
//             >
//               {loading ? 'Envoi...' : 'Envoyer'}
//             </button>
//           </div>
//         </div>
//         {error && (
//           <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
//             <h3 className="text-lg font-medium text-red-800">Erreur</h3>
//             <p className="mt-2 text-sm text-red-700">{error}</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ChatBot;




import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { getStudentByEmail } from '../services/studentService';

const ChatBot = () => {
  const { user, loading: authLoading } = useAuth();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const messagesRef = useRef(null);

  const scrollToBottom = () => {
    messagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Fetch user_id if not directly available
  useEffect(() => {
    if (authLoading || !user?.email) {
      return;
    }

    const fetchUserId = async () => {
      let id = user.user_id || user.sub;

      if (!id) {
        try {
          const accessToken = localStorage.getItem('access_token');
          if (!accessToken) {
            throw new Error('No access token found. Please log in again.');
          }
          console.log('Fetching student by email:', user.email); // Debug
          const emailResponse = await getStudentByEmail(user.email, { _t: Date.now() });
          console.log('Email response:', emailResponse); // Debug
          const studentByEmail = Array.isArray(emailResponse)
            ? emailResponse.find(student => student.email === user.email)
            : emailResponse;

          if (!studentByEmail?.id) {
            throw new Error(`Student ID not found for email: ${user.email}`);
          }
          id = studentByEmail.id;
          console.log('Fetched userId:', id); // Debug
        } catch (err) {
          console.error('Error fetching user ID:', err);
          setError('Impossible de récupérer l’identifiant utilisateur. Veuillez réessayer.');
          return;
        }
      }

      setUserId(id);
    };

    fetchUserId();
  }, [user, authLoading]);

  // Fetch conversation history
  useEffect(() => {
    if (!userId || authLoading) {
      return;
    }

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      setError('Veuillez vous connecter pour accéder à l’historique des conversations.');
      return;
    }

    // const fetchHistory = async () => {
    //   setLoading(true);
    //   try {
    //     console.log('Fetching conversation history for userId:', userId); // Debug
    //     const res = await axios.get('http://localhost:8004/api/v1/user/history', {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     });
    //     console.log('History response:', res.data); // Debug
    //     setConversation(
    //       (res.data.history || []).map((msg) => ({
    //         text: msg.message_text || msg.content, // Handle backend field name
    //         isUser: msg.is_user,
    //         timestamp: msg.timestamp || new Date().toISOString(),
    //       }))
    //     );
    //   } catch (err) {
    //     console.error('Error fetching history:', err.response?.data || err.message);
    //     setError('Échec du chargement de l’historique des conversations.');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // In the fetchHistory function
    const fetchHistory = async () => {
        setLoading(true);
        try {
            console.log('Fetching conversation history for userId:', userId); // Debug
            const res = await axios.get('http://localhost:8004/api/v1/user/history', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log('History response:', res.data); // Debug
            const history = res.data.history || [];
            setConversation(
                history.map((msg) => ({
                    text: msg.message_text || msg.content,
                    isUser: msg.is_user,
                    timestamp: msg.timestamp || new Date().toISOString(),
                }))
            );
            if (history.length === 0) {
                console.log('No conversation history found.'); // Debug
            }
        } catch (err) {
            console.error('Error fetching history:', err.response?.data || err.message);
            setError('Échec du chargement de l’historique des conversations.');
        } finally {
            setLoading(false);
        }
    };

    fetchHistory();
  }, [userId, authLoading]);

  // Send message via REST API and get bot response
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Le message ne peut pas être vide.');
      return;
    }

    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      setError('Veuillez vous connecter pour envoyer un message.');
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Add user message to conversation
      const userMessage = {
        text: message,
        isUser: true,
        timestamp: new Date().toISOString(),
      };
      setConversation((prev) => [...prev, userMessage]);

      // Send message to backend and get response
      console.log('Sending message for userId:', userId); // Debug
      const res = await axios.post(
        `http://localhost:8004/api/v1/chat/${userId}`,
        { content: message }, // Match SendMessageRequest
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Chat response:', res.data); // Debug

      const botMessage = {
        text: res.data.content || res.data.reply || 'Pas de réponse du serveur.',
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      setConversation((prev) => [...prev, botMessage]);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err.response?.data || err.message);
      setError('Échec de l’envoi du message ou de la réception de la réponse.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-est-blue"></div>
      </div>
    );
  }

  if (!user || !user.email) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">Veuillez vous connecter pour accéder au chatbot.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <main className="flex-1 p-8 bg-white m-4 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-est-blue">Assistant IA</h2>
        <div className="space-y-4">
          <div className="h-96 overflow-y-auto border border-gray-300 rounded-md p-4 bg-gray-50">
            {conversation.length === 0 && (
              <p className="text-gray-500 text-center">Commencez une conversation !</p>
            )}
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.isUser ? 'bg-est-blue text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs ${msg.isUser ? 'text-gray-200' : 'text-gray-400'} mt-1`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesRef} />
          </div>
          <div className="search-bar flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-est-blue"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
              className={`px-6 py-3 rounded-r text-white font-medium ${
                loading || !message.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-est-blue hover:bg-blue-900'
              }`}
            >
              {loading ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-lg font-medium text-red-800">Erreur</h3>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatBot;