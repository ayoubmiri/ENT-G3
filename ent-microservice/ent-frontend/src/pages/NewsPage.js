import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import NewsCard from '../components/cards/NewsCard';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchNews = async () => {
      try {
        // In a real app, you would fetch from your API
        const mockNews = [
          {
            id: 1,
            title: "Nouveau programme de génie logiciel",
            date: "15 Mars 2025",
            description: "Découvrez notre programme renouvelé avec des modules sur l'IA, le cloud computing et la cybersécurité.",
            content: "Le contenu complet de l'article...",
            image: "/assets/images/news1.jpg"
          },
          {
            id: 2,
            title: "Journée portes ouvertes",
            date: "10 Mars 2025",
            description: "Rencontrez nos enseignants et étudiants le 15 mai pour découvrir nos formations et installations.",
            content: "Le contenu complet de l'article...",
            image: "/assets/images/news2.jpg"
          }
        ];
        setNews(mockNews);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <>
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-est-blue mb-4">Actualités</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Restez informé des dernières nouvelles et événements de l'EST Salé.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-est-blue"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map(item => (
              <NewsCard key={item.id} newsItem={item} />
            ))}
          </div>
        )}
      </main>

    </>
  );
};

export default NewsPage;