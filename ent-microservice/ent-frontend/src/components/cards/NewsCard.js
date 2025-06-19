import React from 'react';
import { Link } from 'react-router-dom';

const NewsCard = ({ newsItem }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden news-card transition">
      <img 
        src={newsItem.image || 'https://via.placeholder.com/600x400'} 
        alt={newsItem.title} 
        className="w-full h-40 md:h-48 object-cover" 
      />
      <div className="p-4 md:p-6">
        <div className="text-xs md:text-sm text-gray-500 mb-2">{newsItem.date}</div>
        <h3 className="text-lg md:text-xl font-semibold text-est-blue mb-2 md:mb-3">{newsItem.title}</h3>
        <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">{newsItem.summary}</p>
        <Link 
          to={`/actualites/${newsItem.id}`} 
          className="text-est-blue font-medium hover:underline flex items-center text-sm md:text-base"
        >
          Lire la suite
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;