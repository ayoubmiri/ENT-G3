import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTeacherByEmail, getTeacherById, updateTeacher } from '../services/teacherService';

const EnseignantProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTeacherData = async () => {
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
        // Fetch teacher by email to get UUID with cache-busting
        console.log('Fetching teacher by email:', user.email); // Debug
        const emailResponse = await getTeacherByEmail(user.email, { _t: Date.now() });
        console.log('Email response:', emailResponse); // Debug

        // Filter for the record matching user.email
        const teacherByEmail = Array.isArray(emailResponse)
          ? emailResponse.find(teacher => teacher.email === user.email)
          : emailResponse;

        if (!teacherByEmail?.id) {
          throw new Error(`Teacher ID (UUID) not found for email: ${user.email}`);
        }

        // Fetch full teacher profile by UUID with cache-busting
        console.log('Fetching teacher by ID:', teacherByEmail.id); // Debug
        const teacherData = await getTeacherById(teacherByEmail.id, { _t: Date.now() });
        console.log('Teacher data:', teacherData); // Debug

        // Mock courses and availability until endpoints are confirmed
        const mockData = {
          coursEnseignes: [
            { module: 'Algorithmique', filiere: 'GL', niveau: '1ère année' },
            { module: 'Base de données', filiere: 'GL', niveau: '2ème année' },
          ],
          disponibilites: [
            { jour: 'Lundi', heure: '14:00-16:00' },
            { jour: 'Mercredi', heure: '10:00-12:00' },
          ],
        };

        setTeacher({
          ...teacherData,
          id: teacherData.id, // UUID for API calls
          teacher_id: teacherData.teacher_id, // Human-readable ID
          nom: teacherData.last_name,
          prenom: teacherData.first_name,
          email: teacherData.email,
          telephone: teacherData.phone,
          specialite: teacherData.specialization,
          grade: teacherData.grade || 'Professeur', // Fallback
          dateEmbauche: teacherData.hire_date?.split('T')[0] || '', // Fallback
          photo: teacherData.photo || '/assets/images/teacher-avatar.jpg',
          coursEnseignes: mockData.coursEnseignes,
          disponibilites: mockData.disponibilites,
        });
        setFormData({
          nom: teacherData.last_name,
          prenom: teacherData.first_name,
          email: teacherData.email,
          telephone: teacherData.phone,
          specialite: teacherData.specialization,
          grade: teacherData.grade || 'Professeur',
          dateEmbauche: teacherData.hire_date?.split('T')[0] || '',
        });
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        setErrors({ fetch: `Failed to load teacher information for ${user.email}. Ensure your email is registered or contact support.` });
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
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
    if (!formData.specialite?.trim()) newErrors.specialite = 'Spécialité is required';
    if (!formData.grade?.trim()) newErrors.grade = 'Grade is required';
    if (formData.dateEmbauche && isNaN(new Date(formData.dateEmbauche).getTime()))
      newErrors.dateEmbauche = 'Invalid hire date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!teacher.id) {
      setErrors({ submit: 'Cannot update profile: Invalid teacher ID' });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        last_name: formData.nom,
        first_name: formData.prenom,
        email: formData.email,
        phone: formData.telephone,
        specialization: formData.specialite,
        status: teacher.status || 'active', // Fallback status
        // Exclude grade and dateEmbauche as not supported by backend
      };
      await updateTeacher(teacher.id, payload);
      setTeacher(prev => ({
        ...prev,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        specialite: formData.specialite,
        grade: formData.grade,
        dateEmbauche: formData.dateEmbauche,
      }));
      setEditing(false);
    } catch (error) {
      console.error('Error updating teacher:', error);
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

  if (loading || authLoading) {
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
          <h1 className="text-2xl md:text-3xl font-bold text-est-blue">Profil Enseignant</h1>
        </div>

        {errors.fetch && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errors.fetch}</div>
        )}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errors.submit}</div>
        )}

        {teacher ? (
          <div className="grid md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-md">
              <div className="text-center mb-6">
                <img 
                  src={teacher.photo} 
                  alt={`${teacher.prenom} ${teacher.nom}`} 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h2 className="text-xl font-semibold">{teacher.prenom} {teacher.nom}</h2>
                <p className="text-gray-600">{teacher.grade}</p>
                <p className="text-sm text-gray-500">{teacher.specialite}</p>
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
                  Documents administratifs
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

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-1">Spécialité</label>
                      <input
                        type="text"
                        name="specialite"
                        value={formData.specialite || ''}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue ${errors.specialite ? 'border-red-500' : ''}`}
                      />
                      {errors.specialite && <p className="text-red-500 text-xs italic">{errors.specialite}</p>}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Grade</label>
                      <select
                        name="grade"
                        value={formData.grade || ''}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue ${errors.grade ? 'border-red-500' : ''}`}
                      >
                        <option value="Professeur">Professeur</option>
                        <option value="Maître de conférences">Maître de conférences</option>
                        <option value="Assistant">Assistant</option>
                        <option value="Vacataire">Vacataire</option>
                      </select>
                      {errors.grade && <p className="text-red-500 text-xs italic">{errors.grade}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Date d'embauche</label>
                    <input
                      type="date"
                      name="dateEmbauche"
                      value={formData.dateEmbauche || ''}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-est-blue ${errors.dateEmbauche ? 'border-red-500' : ''}`}
                    />
                    {errors.dateEmbauche && <p className="text-red-500 text-xs italic">{errors.dateEmbauche}</p>}
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
                        <p className="font-medium">{teacher.prenom} {teacher.nom}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">ID enseignant</p>
                        <p className="font-medium">{teacher.teacher_id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium">{teacher.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Téléphone</p>
                        <p className="font-medium">{teacher.telephone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Spécialité</p>
                        <p className="font-medium">{teacher.specialite}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Grade</p>
                        <p className="font-medium">{teacher.grade}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Date d'embauche</p>
                        <p className="font-medium">{teacher.dateEmbauche ? new Date(teacher.dateEmbauche).toLocaleDateString('fr-FR') : 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Courses Taught */}
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-est-blue mb-4">Cours enseignés</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filière</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {teacher.coursEnseignes.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">{item.module}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.filiere}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.niveau}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-est-blue mb-4">Disponibilités</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jour</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heure</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {teacher.disponibilites.map((item, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">{item.jour}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{item.heure}</td>
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
            <p className="text-gray-600">No profile data available. Please ensure you are logged in with a registered teacher account.</p>
          </div>
        )}
      </main>
    </>
  );
};

export default EnseignantProfile;