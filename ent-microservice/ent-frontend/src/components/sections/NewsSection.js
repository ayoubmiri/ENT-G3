import React from 'react';
import { Link } from 'react-router-dom';
import NewsCard from '../cards/NewsCard';

const NewsSection = ({ news }) => {
  return (
    <section className="container mx-auto py-12 md:py-16 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-est-blue border-b-4 border-est-yellow pb-2 mb-4 md:mb-0">Actualités</h2>
        <Link to="/actualites" className="text-est-blue hover:underline text-sm md:text-base">Voir toutes les actualités →</Link>
      </div>
      
      {news.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {news.map(item => (
            <NewsCard key={item.id} newsItem={item} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Aucune actualité pour le moment</p>
      )}
    </section>
  );
};

export default NewsSection;