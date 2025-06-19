import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState([]);

  useEffect(() => {
    // Simulate API call to fetch news item by ID
    const fetchNewsItem = async () => {
      try {
        // In a real app, you would fetch from your API using the id
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockNewsItem = {
          id: 1,
          title: "Nouveau programme de génie logiciel",
          date: "15 Mars 2025",
          author: "Dr. Karim El Mansouri",
          image: "/assets/images/news-detail.jpg",
          content: `
            <p>L'École Supérieure de Technologie de Salé est fière d'annoncer le lancement de son nouveau programme de Génie Logiciel pour l'année académique 2025-2026. Ce programme a été entièrement repensé pour répondre aux besoins actuels du marché de l'emploi dans le domaine des technologies de l'information.</p>
            
            <h2 class="text-xl font-semibold mt-6 mb-3">Contenu du programme</h2>
            <p>Le nouveau curriculum intègre des modules avancés sur :</p>
            <ul class="list-disc pl-5 space-y-1 my-3">
              <li>Intelligence Artificielle et Machine Learning</li>
              <li>Développement Cloud et Architecture Microservices</li>
              <li>Cybersécurité et Bonnes Pratiques de Codage</li>
              <li>DevOps et Intégration Continue</li>
            </ul>
            
            <h2 class="text-xl font-semibold mt-6 mb-3">Perspectives professionnelles</h2>
            <p>Les diplômés de ce programme pourront prétendre à des postes tels que :</p>
            <ul class="list-disc pl-5 space-y-1 my-3">
              <li>Développeur Full-Stack</li>
              <li>Ingénieur en Intelligence Artificielle</li>
              <li>Architecte Logiciel</li>
              <li>Spécialiste DevOps</li>
            </ul>
            
            <p class="mt-4">Les inscriptions pour ce nouveau programme sont ouvertes jusqu'au 30 juin 2025. Pour plus d'informations, veuillez consulter notre page d'admission ou contacter notre service des relations avec les étudiants.</p>
          `,
          tags: ["Formation", "Génie Logiciel", "Nouveauté"]
        };
        
        setNewsItem(mockNewsItem);
        
        // Simulate fetching related news
        const mockRelatedNews = [
          {
            id: 2,
            title: "Journée portes ouvertes",
            date: "10 Mars 2025",
            excerpt: "Rencontrez nos enseignants et étudiants le 15 mai pour découvrir nos formations et installations."
          },
          {
            id: 3,
            title: "Partenariat avec Microsoft",
            date: "5 Février 2025",
            excerpt: "Signature d'un accord de partenariat pour des certifications Azure gratuites pour nos étudiants."
          }
        ];
        setRelatedNews(mockRelatedNews);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
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

  if (!newsItem) {
    return (
      <>
        <Navbar />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-est-blue mb-4">Article non trouvé</h1>
          <p className="text-gray-600">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
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
          <article>
            <div className="mb-6">
              <span className="text-sm text-gray-500">{newsItem.date}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-est-blue mt-2 mb-4">{newsItem.title}</h1>
              <div className="flex items-center text-gray-600">
                <span>Par {newsItem.author}</span>
              </div>
            </div>
            
            {newsItem.image && (
              <img 
                src={newsItem.image} 
                alt={newsItem.title} 
                className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
              />
            )}
            
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: newsItem.content }}
            />
            
            {newsItem.tags && newsItem.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {newsItem.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
          
          {relatedNews.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl md:text-2xl font-bold text-est-blue mb-6">Actualités similaires</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedNews.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition">
                    <span className="text-sm text-gray-500">{item.date}</span>
                    <h3 className="text-lg font-semibold text-est-blue mt-1 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.excerpt}</p>
                    <a 
                      href={`/actualites/${item.id}`} 
                      className="inline-block text-est-blue hover:underline mt-3"
                    >
                      Lire la suite →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default NewsDetailPage;