import React from 'react';

const ContactSection = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-est-blue mb-4 md:mb-6">
              Contactez-nous
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-6 md:mb-8">
              Vous avez des questions sur nos formations, l'admission ou la vie étudiante ? Notre équipe est à votre disposition.
            </p>
            
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-est-blue mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm md:text-base">Adresse</h4>
                  <p className="text-gray-600 text-xs md:text-sm">Route de Kenitra, Salé, Maroc</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-est-blue mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm md:text-base">Téléphone</h4>
                  <p className="text-gray-600 text-xs md:text-sm">+212 5 37 81 23 45</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-est-blue mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm md:text-base">Email</h4>
                  <p className="text-gray-600 text-xs md:text-sm">contact@estsale.ma</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 md:p-6 lg:p-8 rounded-xl shadow-sm">
            <form className="space-y-3 md:space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 text-sm md:text-base mb-1">Nom complet</label>
                <input type="text" id="name" name="name" required className="w-full px-3 py-2 md:px-4 md:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue text-sm md:text-base" />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm md:text-base mb-1">Email</label>
                <input type="email" id="email" name="email" required className="w-full px-3 py-2 md:px-4 md:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue text-sm md:text-base" />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-gray-700 text-sm md:text-base mb-1">Sujet</label>
                <select id="subject" name="subject" className="w-full px-3 py-2 md:px-4 md:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue text-sm md:text-base">
                  <option value="admission">Admission</option>
                  <option value="formation">Formation</option>
                  <option value="stage">Stage</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-700 text-sm md:text-base mb-1">Message</label>
                <textarea id="message" name="message" rows="4" required className="w-full px-3 py-2 md:px-4 md:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue text-sm md:text-base"></textarea>
              </div>
              
              <button type="submit" className="bg-est-blue text-white py-2 px-4 md:py-3 md:px-6 rounded-md hover:bg-blue-900 transition w-full text-sm md:text-base">
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;