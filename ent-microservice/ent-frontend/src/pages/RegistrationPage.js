import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: '',
    bacYear: '',
    bacType: ''
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const programs = [
    "Génie Logiciel",
    "Réseaux et Systèmes",
    "Développement Mobile",
    "Data Science",
    "Cybersécurité"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "Ce champ est requis";
    if (!formData.lastName) newErrors.lastName = "Ce champ est requis";
    if (!formData.email) {
      newErrors.email = "Ce champ est requis";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.phone) newErrors.phone = "Ce champ est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.program) newErrors.program = "Veuillez sélectionner une formation";
    if (!formData.bacYear) newErrors.bacYear = "Ce champ est requis";
    if (!formData.bacType) newErrors.bacType = "Ce champ est requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      // In a real app, you would send this to your backend
      console.log('Form submitted:', formData);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <>
        <main className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl md:text-3xl font-bold text-est-blue mb-4">Candidature soumise avec succès!</h1>
            <p className="text-gray-600 mb-6">
              Nous avons bien reçu votre candidature. Vous recevrez un email de confirmation sous peu avec les prochaines étapes.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-est-blue text-white py-2 px-6 rounded-md hover:bg-blue-900 transition"
            >
              Retour à l'accueil
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-est-blue mb-2">Formulaire de Candidature</h1>
            <div className="flex justify-center mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-est-blue text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
              <div className={`w-20 h-1 mt-3 ${step >= 2 ? 'bg-est-blue' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-est-blue text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl shadow-md">
            {step === 1 ? (
              <>
                <h2 className="text-xl font-semibold text-est-blue mb-6">Informations personnelles</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 mb-1">Prénom *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 mb-1">Nom *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-1">Téléphone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-est-blue text-white py-2 px-6 rounded-md hover:bg-blue-900 transition"
                  >
                    Suivant
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-est-blue mb-6">Informations académiques</h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="program" className="block text-gray-700 mb-1">Formation souhaitée *</label>
                    <select
                      id="program"
                      name="program"
                      value={formData.program}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue ${errors.program ? 'border-red-500' : ''}`}
                    >
                      <option value="">Sélectionnez une formation</option>
                      {programs.map((program, i) => (
                        <option key={i} value={program}>{program}</option>
                      ))}
                    </select>
                    {errors.program && <p className="text-red-500 text-sm mt-1">{errors.program}</p>}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="bacYear" className="block text-gray-700 mb-1">Année d'obtention du Bac *</label>
                      <input
                        type="number"
                        id="bacYear"
                        name="bacYear"
                        min="2000"
                        max="2025"
                        value={formData.bacYear}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue ${errors.bacYear ? 'border-red-500' : ''}`}
                      />
                      {errors.bacYear && <p className="text-red-500 text-sm mt-1">{errors.bacYear}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="bacType" className="block text-gray-700 mb-1">Type de Bac *</label>
                      <select
                        id="bacType"
                        name="bacType"
                        value={formData.bacType}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue ${errors.bacType ? 'border-red-500' : ''}`}
                      >
                        <option value="">Sélectionnez un type</option>
                        <option value="Sciences Math">Sciences Math</option>
                        <option value="Sciences Exp">Sciences Exp</option>
                        <option value="Techniques">Techniques</option>
                        <option value="Autre">Autre</option>
                      </select>
                      {errors.bacType && <p className="text-red-500 text-sm mt-1">{errors.bacType}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Documents à joindre (max 5MB par fichier):</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                      <input type="file" multiple className="w-full" />
                      <p className="text-sm text-gray-500 mt-2">Copie du Bac, Relevés de notes, CV, Lettre de motivation</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-est-blue hover:underline"
                  >
                    ← Retour
                  </button>
                  <button
                    type="submit"
                    className="bg-est-blue text-white py-2 px-6 rounded-md hover:bg-blue-900 transition"
                  >
                    Soumettre ma candidature
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </main>

    </>
  );
};

export default RegistrationPage;