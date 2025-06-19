import React from 'react';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-gray-50 p-4 md:p-8 rounded-xl">
      <div className="flex items-center mb-3 md:mb-4">
        <img 
          src={testimonial.avatar || 'https://via.placeholder.com/60'} 
          alt={testimonial.name} 
          className="rounded-full h-10 w-10 md:h-12 md:w-12 mr-3 md:mr-4" 
        />
        <div>
          <h4 className="font-semibold text-sm md:text-base">{testimonial.name}</h4>
          <p className="text-gray-600 text-xs md:text-sm">{testimonial.position}</p>
        </div>
      </div>
      <p className="text-gray-700 italic text-sm md:text-base">"{testimonial.quote}"</p>
      <div className="flex mt-3 md:mt-4 text-yellow-400 text-sm md:text-base">
        {'★'.repeat(testimonial.rating || 5)}
      </div>
    </div>
  );
};

export default TestimonialCard;