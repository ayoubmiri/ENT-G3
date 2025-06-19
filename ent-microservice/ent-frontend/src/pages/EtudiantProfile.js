import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getStudentByEmail, getStudentById, getFiliereById, updateStudent } from '../services/studentService';

const EtudiantProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchStudentData = async () => {
      if (authLoading) return; // Wait for auth to initialize

      console.log('User from useAuth:', user); // Debug

      if (!user) {
        setErrors({ fetch: 'No user is logged in. Please log in to view your profile.' });
        setLoading(false);
        return;
      }

      if (!user.email) {
        setErrors({ fetch: 'User email is not available. Please ensure your account is properly configured.' });
        setLoading(false);
        return;
      }

      try {
        // Fetch student by email to get UUID with cache-busting
        console.log('Fetching student by email:', user.email); // Debug
        const emailResponse = await getStudentByEmail(user.email, { _t: Date.now() });
        console.log('Email response:', emailResponse); // Debug

        // Filter for the record matching user.email
        const studentByEmail = Array.isArray(emailResponse)
          ? emailResponse.find(student => student.email === user.email)
          : emailResponse;

        if (!studentByEmail?.id) {
          throw new Error(`Student ID (UUID) not found for email: ${user.email}`);
        }

        // Fetch full student profile by UUID with cache-busting
        console.log('Fetching student by ID:', studentByEmail.id); // Debug
        const studentData = await getStudentById(studentByEmail.id, { _t: Date.now() });
        console.log('Student data:', studentData); // Debug

        // Fetch filiere name
        let filiereName = 'N/A';
        if (studentData.filiere_id) {
          try {
            const filiere = await getFiliereById(studentData.filiere_id, { _t: Date.now() });
            filiereName = filiere.name || 'N/A';
            console.log('Filiere:', filiere); // Debug
          } catch (err) {
            console.warn('Failed to fetch filiere name:', err);
          }
        }

        // Mock schedule and grades until endpoints are confirmed
        const mockData = {
          emploiDuTemps: [
            { jour: 'Lundi', cours: 'Algorithmique', salle: 'B12', heure: '08:30-10:30' },
            { jour: 'Mardi', cours: 'Base de données', salle: 'A07', heure: '10:45-12:45' },
          ],
          notes: [
            { module: 'Algorithmique', note: 16.5, coefficient: 3 },
            { module: 'Base de données', note: 14, coefficient: 2 },
          ],
        };

        setStudent({
          ...studentData,
          id: studentData.id, // UUID for API calls
          student_id: studentData.student_id, // Human-readable ID
          nom: studentData.last_name,
          prenom: studentData.first_name,
          email: studentData.email,
          telephone: studentData.phone,
          filiere: filiereName,
          niveau: studentData.year ? `${studentData.year}ème année` : 'N/A',
          dateNaissance: studentData.date_of_birth?.split('T')[0] || '',
          photo: studentData.photo || '/assets/images/student-avatar.jpg',
          emploiDuTemps: mockData.emploiDuTemps,
          notes: mockData.notes,
        });
        setFormData({
          nom: studentData.last_name,
          prenom: studentData.first_name,
          email: studentData.email,
          telephone: studentData.phone,
          dateNaissance: studentData.date_of_birth?.split('T')[0] || '',
        });
      } catch (error) {
        console.error('Error fetching student data:', error);
        setErrors({ fetch: `Failed to load student information for ${user.email}. Ensure your email is registered or contact support.` });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [user, authLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom?.trim()) newErrors.nom = 'Nom is required';
    if (!formData.prenom?.trim()) newErrors.prenom = 'Prénom is required';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (formData.dateNaissance && isNaN(new Date(formData.dateNaissance).getTime()))
      newErrors.dateNaissance = 'Invalid date of birth';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!student.id) {
      setErrors({ submit: 'Cannot update profile: Invalid student ID' });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        last_name: formData.nom,
        first_name: formData.prenom,
        email: formData.email,
        phone: formData.telephone,
        date_of_birth: formData.dateNaissance || null,
      };
      await updateStudent(student.id, payload);
      setStudent(prev => ({
        ...prev,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        dateNaissance: formData.dateNaissance,
      }));
      setEditing(false);
    } catch (error) {
      console.error('Error updating student:', error);
      let errorMessage = 'Failed to update profile. Please try again.';
      if (error.response?.status === 422 && error.response.data?.detail) {
        const details = Array.isArray(error.response.data.detail)
          ? error.response.data.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join('; ')
          : error.response.data.detail;
        errorMessage = `Validation errors: ${details}`;
      }
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-est-blue"></div>
      </div>
    );
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-est-blue">Profil Étudiant</h1>
        </div>

        {errors.fetch && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errors.fetch}</div>
        )}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errors.submit}</div>
        )}

        {student ? (
          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-md">
              <div className="text-center mb-6">
                <img 
                  src={student.photo} 
                  alt={`${student.prenom} ${student.nom}`} 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h2 className="text-xl font-semibold">{student.prenom} {student.nom}</h2>
                <p className="text-gray-600">{student.filiere}</p>
                <p className="text-sm text-gray-500">{student.niveau}</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setEditing(!editing)}
                  className="w-full bg-est-blue text-white py-2 px-4 rounded-md hover:bg-blue-900 transition"
                  disabled={loading}
                >
                  {editing ? 'Annuler' : 'Modifier le profil'}
                </button>
                <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition">
                  Changer le mot de passe
                </button>
                <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition">
                  Mes documents
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {editing ? (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-6">
                  <h2 className="text-xl font-semibold text-est-blue mb-4">Modifier le profil</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-1">Nom</label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom || ''}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue ${errors.nom ? 'border-red-500' : ''}`}
                      />
                      {errors.nom && <p className="text-red-500 text-xs italic">{errors.nom}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Prénom</label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom || ''}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue ${errors.prenom ? 'border-red-500' : ''}`}
                      />
                      {errors.prenom && <p className="text-red-500 text-xs italic">{errors.prenom}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue ${errors.email ? 'border-red-500' : ''}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Téléphone</label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Date de naissance</label>
                    <input
                      type="date"
                      name="dateNaissance"
                      value={formData.dateNaissance || ''}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue ${errors.dateNaissance ? 'border-red-500' : ''}`}
                      />
                    {errors.dateNaissance && <p className="text-red-500 text-xs italic">{errors.dateNaissance}</p>}
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 transition"
                      disabled={loading}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="bg-est-blue text-white py-2 px-6 rounded-md hover:bg-blue-900 transition"
                      disabled={loading}
                    >
                      {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Personal Info */}
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-est-blue mb-4">Informations personnelles</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-500">Nom complet</p>
                        <p className="font-medium">{student.prenom} {student.nom}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">ID étudiant</p>
                        <p className="font-medium">{student.student_id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{student.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Téléphone</p>
                        <p className="font-medium">{student.telephone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date de naissance</p>
                        <p className="font-medium">{student.dateNaissance ? new Date(student.dateNaissance).toLocaleDateString('fr-FR') : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Filière</p>
                        <p className="font-medium">{student.filiere}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Niveau</p>
                        <p className="font-medium">{student.niveau}</p>
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-est-blue mb-4">Emploi du temps</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jour</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cours</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {student.emploiDuTemps.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">{item.jour}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.cours}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.salle}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.heure}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Grades */}
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-est-blue mb-4">Notes</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coefficient</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {student.notes.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">{item.module}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.note}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.coefficient}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No profile data available. Please ensure you are logged in with a registered student account.</p>
          </div>
        )}
      </main>
    </>
  );
};

export default EtudiantProfile;