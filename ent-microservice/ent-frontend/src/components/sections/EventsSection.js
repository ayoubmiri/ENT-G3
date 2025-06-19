import React from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../cards/EventCard';

const EventsSection = ({ events }) => {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-est-blue mb-4 md:mb-0">
            Événements à venir
          </h2>
          <Link to="/evenements" className="text-est-blue hover:underline text-sm md:text-base">
            Voir tous les événements →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {events.slice(0, 3).map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;