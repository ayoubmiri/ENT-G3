import React from 'react';


const AdmissionPage = () => {
  const admissionSteps = [
    {
      title: "1. Vérification des conditions d'admission",
      description: "Assurez-vous de remplir les conditions nécessaires pour intégrer l'EST Salé."
    },
    {
      title: "2. Préparation du dossier",
      description: "Rassemblez tous les documents nécessaires pour votre candidature."
    },
    {
      title: "3. Soumission en ligne",
      description: "Complétez et soumettez votre dossier via notre plateforme d'admission."
    },
    {
      title: "4. Entretien et sélection",
      description: "Les candidats présélectionnés seront convoqués pour un entretien."
    },
    {
      title: "5. Résultats et inscription",
      description: "Les résultats seront publiés et les admis pourront finaliser leur inscription."
    }
  ];

  return (
    <>
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-est-blue mb-4">Admission</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez le processus d'admission à l'EST Salé et préparez votre candidature.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-est-blue mb-4">Procédure d'admission</h2>
            <div className="space-y-6">
              {admissionSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-est-blue text-white rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold text-est-blue mb-4">Dates importantes</h2>
              <ul className="space-y-4">
                <li className="border-b pb-2">
                  <div className="font-semibold">Ouverture des candidatures</div>
                  <div className="text-gray-600">15 Mars 2025</div>
                </li>
                <li className="border-b pb-2">
                  <div className="font-semibold">Date limite de dépôt</div>
                  <div className="text-gray-600">30 Avril 2025</div>
                </li>
                <li className="border-b pb-2">
                  <div className="font-semibold">Entretiens</div>
                  <div className="text-gray-600">15-30 Mai 2025</div>
                </li>
                <li>
                  <div className="font-semibold">Publication des résultats</div>
                  <div className="text-gray-600">15 Juin 2025</div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold text-est-blue mb-4">Documents requis</h2>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-est-blue mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Relevés de notes du baccalauréat</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-est-blue mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Copie certifiée du diplôme du bac</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-est-blue mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>CV détaillé</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-est-blue mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Lettre de motivation</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 text-est-blue mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Copie de la CIN ou Passeport</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a 
              href="/candidature" 
              className="inline-block bg-est-blue text-white py-3 px-8 rounded-full hover:bg-blue-900 transition font-medium"
            >
              Postuler maintenant
            </a>
          </div>
        </div>
      </main>

    </>
  );
};

export default AdmissionPage;