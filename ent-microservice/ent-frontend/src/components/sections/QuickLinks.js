import React from 'react';
import { Link } from 'react-router-dom';

const QuickLinks = () => {
  return (
    <section className="bg-white py-6 md:py-8 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          <Link 
            to="/calendrier" 
            className="bg-gray-100 p-3 md:p-4 rounded-lg flex items-center hover:bg-est-blue hover:text-white transition text-sm md:text-base"
          >
            <span className="mr-2">📅</span>
            <span>Calendrier académique</span>
          </Link>
          <Link 
            to="/emploi-du-temps" 
            className="bg-gray-100 p-3 md:p-4 rounded-lg flex items-center hover:bg-est-blue hover:text-white transition text-sm md:text-base"
          >
            <span className="mr-2">⏱️</span>
            <span>Emploi du temps</span>
          </Link>
          <Link 
            to="/bibliotheque" 
            className="bg-gray-100 p-3 md:p-4 rounded-lg flex items-center hover:bg-est-blue hover:text-white transition text-sm md:text-base"
          >
            <span className="mr-2">📚</span>
            <span>Bibliothèque en ligne</span>
          </Link>
          <Link 
            to="/contact" 
            className="bg-gray-100 p-3 md:p-4 rounded-lg flex items-center hover:bg-est-blue hover:text-white transition text-sm md:text-base"
          >
            <span className="mr-2">📧</span>
            <span>Contact</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default QuickLinks;