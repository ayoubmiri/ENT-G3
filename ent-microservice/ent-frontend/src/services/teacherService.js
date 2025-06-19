import api from './api';

export const getTeacherById = async (id, params = {}) => {
  try {
    const response = await api.get(`/teachers/${id}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher:', error);
    throw error;
  }
};

export const getTeacherByEmail = async (email, params = {}) => {
  try {
    const response = await api.get('/teachers', {
      params: { email, ...params }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher by email:', error);
    throw error;
  }
};

export const updateTeacher = async (id, teacherData) => {
  try {
    const response = await api.put(`/teachers/${id}`, teacherData);
    return response.data;
  } catch (error) {
    console.error('Error updating teacher:', error);
    throw error;
  }
};