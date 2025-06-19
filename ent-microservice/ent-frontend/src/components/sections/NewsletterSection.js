import React, { useState } from 'react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('Subscribed with:', email);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <section className="py-8 md:py-12 bg-est-blue text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Restez informé</h2>
        <p className="max-w-2xl mx-auto mb-4 md:mb-6 text-sm md:text-base">
          Abonnez-vous à notre newsletter pour recevoir les dernières actualités et événements de l'EST Salé.
        </p>
        
        {subscribed ? (
          <div className="bg-green-100 text-green-800 inline-block px-4 py-2 rounded-md">
            Merci pour votre abonnement!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow px-3 py-2 md:px-4 md:py-3 rounded-l-md focus:outline-none text-gray-800 text-sm md:text-base"
            />
            <button
              type="submit"
              className="bg-est-yellow text-black px-4 py-2 md:px-6 md:py-3 rounded-r-md hover:bg-yellow-600 transition text-sm md:text-base"
            >
              S'abonner
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSection;