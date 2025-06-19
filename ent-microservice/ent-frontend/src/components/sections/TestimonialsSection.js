import React from 'react';
import TestimonialCard from '../cards/TestimonialCard';

const TestimonialsSection = ({ testimonials }) => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-est-blue text-center mb-8 md:mb-12">
          Témoignages
        </h2>
        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          {testimonials.slice(0, 2).map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;