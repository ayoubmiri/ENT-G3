import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const ResearchPage = () => {
  const researchAreas = [
    {
      title: "Intelligence Artificielle",
      description: "Recherches avancées en machine learning, deep learning et leurs applications.",
      labs: ["LRI", "LIA"]
    },
    {
      title: "Systèmes Distribués",
      description: "Étude des architectures distribuées et des systèmes cloud.",
      labs: ["LSD", "LRI"]
    },
    {
      title: "Cybersécurité",
      description: "Recherche sur la protection des systèmes d'information et la cryptographie.",
      labs: ["LCS"]
    },
    {
      title: "IoT et Systèmes Embarqués",
      description: "Développement de solutions innovantes pour l'Internet des Objets.",
      labs: ["LISE"]
    }
  ];

  const researchLabs = [
    {
      name: "LRI - Laboratoire de Recherche en Informatique",
      director: "Pr. Ahmed Benbrahim",
      focus: "Recherche fondamentale et appliquée en informatique"
    },
    {
      name: "LSD - Laboratoire des Systèmes Distribués",
      director: "Pr. Karim El Khadiri",
      focus: "Architectures distribuées et cloud computing"
    },
    {
      name: "LCS - Laboratoire de Cybersécurité",
      director: "Pr. Fatima Zahra Alaoui",
      focus: "Sécurité des systèmes d'information"
    },
    {
      name: "LISE - Laboratoire d'Informatique et Systèmes Embarqués",
      director: "Pr. Mohamed El Haddad",
      focus: "Systèmes embarqués et IoT"
    }
  ];

  return (
    <>
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-est-blue mb-4">Recherche</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez nos axes de recherche et nos laboratoires spécialisés.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-est-blue mb-6">Axes de recherche</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {researchAreas.map((area, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold text-est-blue mb-2">{area.title}</h3>
                  <p className="text-gray-600 mb-4">{area.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Laboratoires: {area.labs.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-est-blue mb-6">Nos laboratoires</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laboratoire</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Directeur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domaine de recherche</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {researchLabs.map((lab, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lab.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lab.director}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{lab.focus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-est-blue mb-4">Partenariats industriels</h2>
            <p className="text-gray-600 mb-6">
              L'EST Salé collabore avec plusieurs entreprises et institutions pour mener des projets de recherche appliquée.
            </p>
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              <img src="/assets/images/partner1.png" alt="Partenaire 1" className="h-12 md:h-16 object-contain" />
              <img src="/assets/images/partner2.png" alt="Partenaire 2" className="h-12 md:h-16 object-contain" />
              <img src="/assets/images/partner3.png" alt="Partenaire 3" className="h-12 md:h-16 object-contain" />
              <img src="/assets/images/partner4.png" alt="Partenaire 4" className="h-12 md:h-16 object-contain" />
            </div>
          </section>
        </div>
      </main>

    </>
  );
};

export default ResearchPage;