import api from './api';


export const getStudentById = async (id) => {
  try {
    const response = await api.get(`/students/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};

export const getStudentByEmail = async (email) => {
  try {
    const response = await api.get('/students', {
      params: { email }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching student by email:', error);
    throw error;
  }
};

export const updateStudent = async (id, studentData) => {
  try {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const getFiliereById = async (id) => {
  try {
    const response = await api.get(`/filieres/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching filiere:', error);
    throw error;
  }
};

export const getClassById = async (id, params = {}) => {
  try {
    const response = await api.get(`/classes/${id}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching class:', error);
    throw error;
  }
};