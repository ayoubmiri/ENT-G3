// src/components/sections/ProgramsSection.js
import React from 'react';
import ProgramCard from '../cards/ProgramCard';

const ProgramsSection = ({ programs = [] }) => {
  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-est-blue text-center mb-4">Nos Formations</h2>
        <p className="text-lg md:text-xl text-gray-600 text-center mb-8 md:mb-12 max-w-3xl mx-auto">
          Des parcours professionnalisants adaptés aux besoins du marché
        </p>
        
        {programs.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {programs.map(program => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Aucune formation disponible pour le moment</p>
        )}
      </div>
    </section>
  );
};

export default ProgramsSection;