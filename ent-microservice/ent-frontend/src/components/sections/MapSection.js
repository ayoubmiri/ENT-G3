import React from 'react';

const MapSection = () => {
  return (
    <div className="h-64 md:h-80 lg:h-96 bg-gray-200">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3309.041706643947!2d-6.820388924039147!3d33.99598007317222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76b8711d7a9a9%3A0x7c5e7e7b8b8b8b8b!2s%C3%89cole%20Sup%C3%A9rieure%20de%20Technologie%20de%20Sal%C3%A9!5e0!3m2!1sfr!2sma!4v1620000000000!5m2!1sfr!2sma" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen="" 
        loading="lazy" 
        title="EST Salé Location"
      ></iframe>
    </div>
  );
};

export default MapSection;