import React from 'react';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:transform hover:-translate-y-1 transition duration-300">
      {event.image && (
        <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
      )}
      <div className="p-6">
        <div className="flex items-start mb-4">
          <div className="bg-est-blue text-white p-3 text-center rounded-lg mr-4">
            <div className="text-xl font-bold">{event.date}</div>
            <div className="text-xs uppercase">{event.month}</div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-est-blue mb-1">{event.title}</h3>
            {event.time && (
              <p className="text-gray-600 text-sm">{event.time}</p>
            )}
          </div>
        </div>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="flex items-center text-gray-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {event.location}
        </div>
      </div>
    </div>
  );
};

export default EventCard;