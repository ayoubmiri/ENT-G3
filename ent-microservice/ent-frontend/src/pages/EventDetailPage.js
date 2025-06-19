import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch event details
    const fetchEventDetails = async () => {
      try {
        // In a real app, you would fetch from your API using the id
        const mockEvent = {
          id: 1,
          title: "Journée Portes Ouvertes",
          date: "15 Mai 2025",
          time: "09:00 - 17:00",
          location: "Campus EST Salé",
          image: "/assets/images/event-detail.jpg",
          description: "Découvrez l'EST Salé lors de notre journée portes ouvertes annuelle. Une occasion unique de visiter nos installations, rencontrer nos enseignants et étudiants, et en apprendre davantage sur nos formations.",
          program: [
            {
              time: "09:00 - 10:00",
              activity: "Accueil des visiteurs"
            },
            {
              time: "10:00 - 12:00",
              activity: "Visite guidée des laboratoires"
            },
            {
              time: "12:00 - 13:00",
              activity: "Pause déjeuner"
            },
            {
              time: "13:00 - 15:00",
              activity: "Présentation des formations"
            },
            {
              time: "15:00 - 17:00",
              activity: "Échanges avec les enseignants et étudiants"
            }
          ],
          registrationRequired: true
        };

        setEvent(mockEvent);
      } catch (error) {
        console.error("Error fetching event details:", error);
        navigate('/evenements');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, navigate]);

  const handleRegister = () => {
    // Simulate registration
    setRegistered(true);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-est-blue"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-est-blue mb-4">Événement non trouvé</h2>
          <p className="text-gray-600 mb-6">L'événement que vous recherchez n'existe pas ou a été supprimé.</p>
          <button 
            onClick={() => navigate('/evenements')} 
            className="bg-est-blue text-white py-2 px-6 rounded-md hover:bg-blue-900 transition"
          >
            Retour aux événements
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/evenements')} 
            className="flex items-center text-est-blue hover:underline mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux événements
          </button>

          <article>
            <h1 className="text-2xl md:text-3xl font-bold text-est-blue mb-2">{event.title}</h1>
            
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6">
              <div className="flex items-center mr-4 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {event.date}
              </div>
              <div className="flex items-center mr-4 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {event.time}
              </div>
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {event.location}
              </div>
            </div>

            {event.image && (
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
              />
            )}

            <div className="prose max-w-none mb-8">
              <p>{event.description}</p>
            </div>

            {event.program && event.program.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-est-blue mb-4">Programme</h2>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {event.program.map((item, index) => (
                    <div 
                      key={index} 
                      className={`p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <div className="flex items-start">
                        <div className="font-medium text-gray-700 w-24 flex-shrink-0">{item.time}</div>
                        <div>{item.activity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event.registrationRequired && (
              <div className="bg-gray-50 p-6 rounded-lg">
                {registered ? (
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-bold text-est-blue mb-2">Inscription confirmée!</h3>
                    <p className="text-gray-600 mb-4">Vous êtes inscrit à cet événement. Un email de confirmation vous a été envoyé.</p>
                    <button 
                      onClick={() => setRegistered(false)}
                      className="text-est-blue hover:underline"
                    >
                      Modifier mon inscription
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-est-blue mb-4">Inscription requise</h3>
                    <p className="text-gray-600 mb-6">Pour participer à cet événement, veuillez vous inscrire en remplissant le formulaire ci-dessous.</p>
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-gray-700 mb-1">Nom complet</label>
                        <input
                          type="text"
                          id="name"
                          required
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          id="email"
                          required
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-gray-700 mb-1">Téléphone</label>
                        <input
                          type="tel"
                          id="phone"
                          required
                          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRegister}
                        className="bg-est-blue text-white py-2 px-6 rounded-md hover:bg-blue-900 transition w-full"
                      >
                        S'inscrire à l'événement
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default EventDetailsPage;