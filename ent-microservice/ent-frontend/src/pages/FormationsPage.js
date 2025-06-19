import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProgramCard from '../components/cards/ProgramCard';

const FormationsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchPrograms = async () => {
      try {
        // In a real app, you would fetch from your API
        const mockPrograms = [
          {
            id: 1,
            title: "Génie Logiciel",
            description: "Formation complète en développement logiciel, architectures distribuées et méthodes agiles.",
            duration: "2 ans",
            degree: "DUT",
            icon: "code"
          },
          {
            id: 2,
            title: "Réseaux et Systèmes",
            description: "Maîtrisez l'administration des systèmes et réseaux informatiques d'entreprise.",
            duration: "2 ans",
            degree: "DUT",
            icon: "network"
          },
          {
            id: 3,
            title: "Développement Mobile",
            description: "Apprenez à développer des applications natives et hybrides pour iOS et Android.",
            duration: "1 an",
            degree: "Licence Professionnelle",
            icon: "mobile"
          }
        ];
        setPrograms(mockPrograms);
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return (
    <>
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-est-blue mb-4">Nos Formations</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez nos programmes de formation professionnalisants conçus pour répondre aux besoins du marché.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-est-blue"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map(program => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        )}
      </main>

    </>
  );
};

export default FormationsPage;