import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/sections/HeroSection';
import QuickLinks from '../components/sections/QuickLinks';
import NewsSection from '../components/sections/NewsSection';
import ProgramsSection from '../components/sections/ProgramsSection';
import StatsSection from '../components/sections/StatsSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import EventsSection from '../components/sections/EventsSection';
import ContactSection from '../components/sections/ContactSection';
import NewsletterSection from '../components/sections/NewsletterSection';
import MapSection from '../components/sections/MapSection';

const HomePage = () => {
  // Mock data - in a real app, this would come from an API
  const [news, setNews] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [events, setEvents] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      // Mock news data
      setNews([
        {
          id: 1,
          title: "Nouveau programme de génie logiciel",
          date: "15 Mars 2025",
          description: "Découvrez notre programme renouvelé avec des modules sur l'IA, le cloud computing et la cybersécurité.",
          image: "/assets/images/news1.jpg"
        },
        // Add more news items
      ]);

      // Mock programs data
      setPrograms([
        {
          id: 1,
          title: "Génie Logiciel",
          description: "Formation complète en développement logiciel, architectures distribuées et méthodes agiles.",
          icon: "code"
        },
        // Add more programs
      ]);

      // Mock events data
      setEvents([
        {
          id: 1,
          title: "Journée Portes Ouvertes",
          date: "15",
          month: "MAI",
          description: "Découvrez nos formations, rencontrez nos enseignants et étudiants.",
          location: "Campus EST Salé"
        },
        // Add more events
      ]);

      // Mock testimonials data
      setTestimonials([
        {
          id: 1,
          name: "Ahmed El Amrani",
          role: "Diplômé en Génie Logiciel, 2023",
          text: "La formation pratique et les projets concrets m'ont permis de décrocher un poste de développeur full-stack avant même l'obtention de mon diplôme.",
          rating: 5,
          image: "/assets/images/testimonial1.jpg"
        },
        // Add more testimonials
      ]);
    };

    fetchData();
  }, []);

  return (
    <>
      
      <main>
        <HeroSection />
        <QuickLinks />
        <NewsSection news={news} />
        <ProgramsSection programs={programs} />
        <StatsSection />
        <TestimonialsSection testimonials={testimonials} />
        <EventsSection events={events} />
        <ContactSection />
        <NewsletterSection />
        <MapSection />
      </main>
      
    </>
  );
};

export default HomePage;