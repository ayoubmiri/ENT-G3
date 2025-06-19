import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="hero-section text-white py-16 md:py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 animate-fade-in">
          Formez-vous aux métiers de demain
        </h2>
        <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in">
          Développez vos compétences avec nos formations professionnalisantes en génie logiciel, réseaux et systèmes informatiques.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
          <Link 
            to="/register" 
            className="bg-est-yellow text-black py-3 px-6 md:px-8 rounded-full hover:bg-yellow-600 font-medium transition transform hover:scale-105"
          >
            S'inscrire
          </Link>
          <Link 
            to="/formations" 
            className="bg-transparent border-2 border-white py-3 px-6 md:px-8 rounded-full hover:bg-white hover:bg-opacity-20 font-medium transition"
          >
            Nos formations
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;