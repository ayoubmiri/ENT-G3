import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const ProgramDetailPage = () => {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch program by ID
    const fetchProgram = async () => {
      try {
        // In a real app, you would fetch from your API using the id
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockProgram = {
          id: 1,
          title: "Génie Logiciel",
          degree: "Diplôme Universitaire de Technologie (DUT)",
          duration: "2 ans (4 semestres)",
          description: "Cette formation prépare des techniciens supérieurs capables de participer à la conception, au développement et à la maintenance d'applications logicielles.",
          objectives: [
            "Maîtriser les concepts fondamentaux du génie logiciel",
            "Développer des applications robustes et sécurisées",
            "Travailler en équipe selon les méthodes agiles",
            "Comprendre les architectures logicielles modernes"
          ],
          curriculum: [
            {
              semester: "Semestre 1",
              courses: [
                "Algorithmique et programmation",
                "Systèmes d'information",
                "Mathématiques pour l'informatique",
                "Bases de données",
                "Langue et communication"
              ]
            },
            {
              semester: "Semestre 2",
              courses: [
                "Programmation orientée objet",
                "Conception UML",
                "Réseaux informatiques",
                "Systèmes d'exploitation",
                "Anglais technique"
              ]
            },
            // Add more semesters...
          ],
          careers: [
            "Développeur Full-Stack",
            "Concepteur d'applications",
            "Analyste programmeur",
            "Responsable qualité logicielle",
            "Chef de projet junior"
          ],
          admissionRequirements: [
            "Baccalauréat scientifique ou technique",
            "Bonne maîtrise des outils informatiques de base",
            "Capacité d'abstraction et de raisonnement logique"
          ],
          image: "/assets/images/program-software.jpg"
        };
        
        setProgram(mockProgram);
      } catch (error) {
        console.error("Error fetching program:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [id]);

  if (loading) {
    return (
      <>
        <main className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-est-blue"></div>
          </div>
        </main>
      </>
    );
  }

  if (!program) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-est-blue mb-4">Formation non trouvée</h1>
          <p className="text-gray-600">La formation que vous recherchez n'existe pas ou a été supprimée.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-est-blue mb-2">{program.title}</h1>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <span>{program.degree}</span>
              <span>•</span>
              <span>{program.duration}</span>
            </div>
          </div>
          
          {program.image && (
            <img 
              src={program.image} 
              alt={program.title} 
              className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
            />
          )}
          
          <div className="prose max-w-none mb-8">
            <p className="text-lg">{program.description}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-xl font-semibold text-est-blue mb-4">Objectifs de la formation</h2>
              <ul className="list-disc pl-5 space-y-2">
                {program.objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-est-blue mb-4">Débouchés professionnels</h2>
              <ul className="list-disc pl-5 space-y-2">
                {program.careers.map((career, i) => (
                  <li key={i}>{career}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-est-blue mb-4">Programme des études</h2>
            <div className="space-y-6">
              {program.curriculum.map((semester, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-est-blue mb-3">{semester.semester}</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {semester.courses.map((course, j) => (
                      <li key={j} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-est-blue mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {course}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-est-blue text-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Conditions d'admission</h2>
            <ul className="list-disc pl-5 space-y-2">
              {program.admissionRequirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
            <div className="mt-6">
              <a 
                href="/admission" 
                className="inline-block bg-white text-est-blue py-2 px-6 rounded-md hover:bg-gray-100 transition font-medium"
              >
                Postuler maintenant
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProgramDetailPage;