import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import EventCard from '../components/cards/EventCard';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchEvents = async () => {
      try {
        // In a real app, you would fetch from your API
        const mockEvents = [
          {
            id: 1,
            title: "Journée Portes Ouvertes",
            date: "15",
            month: "MAI",
            description: "Découvrez nos formations, rencontrez nos enseignants et étudiants.",
            location: "Campus EST Salé",
            time: "09:00 - 17:00",
            image: "/assets/images/event1.jpg"
          },
          {
            id: 2,
            title: "Forum Entreprises",
            date: "28",
            month: "JUIN",
            description: "Rencontrez des recruteurs et découvrez des opportunités de stage et d'emploi.",
            location: "Amphithéâtre Principal",
            time: "10:00 - 16:00",
            image: "/assets/images/event2.jpg"
          }
        ];
        setEvents(mockEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-est-blue mb-4">Événements à venir</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez les prochains événements organisés par l'EST Salé.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-est-blue"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </main>

    </>
  );
};

export default EventsPage;