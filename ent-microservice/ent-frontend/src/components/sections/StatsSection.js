import React from 'react';

const StatsSection = () => {
  const stats = [
    { value: '95%', label: "Taux d'insertion" },
    { value: '15+', label: "Partenaires industriels" },
    { value: '1200', label: "Étudiants" },
    { value: '50+', label: "Enseignants experts" }
  ];

  return (
    <section className="bg-est-blue text-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-2 md:p-4">
              <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">{stat.value}</div>
              <div className="text-sm md:text-xl">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;