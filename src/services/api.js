// src/services/api.js
import axios from 'axios';

const API_URL = 'https://api-ejemplo.com'; // Cambia esta URL por la de tu API

// Función para autenticar usuario
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error("Error en la autenticación", error);
    throw error;
  }
};

// Funciones CRUD para alojamientos
export const fetchAccommodations = async () => {
  const response = await axios.get(`${API_URL}/accommodations`);
  return response.data;
};

export const createAccommodation = async (data) => {
  const response = await axios.post(`${API_URL}/accommodations`, data);
  return response.data;
};

export const updateAccommodation = async (id, data) => {
  const response = await axios.put(`${API_URL}/accommodations/${id}`, data);
  return response.data;
};

export const deleteAccommodation = async (id) => {
  const response = await axios.delete(`${API_URL}/accommodations/${id}`);
  return response.data;
};

// Funciones CRUD para reservas
export const fetchReservations = async () => {
  const response = await axios.get(`${API_URL}/reservations`);
  return response.data;
};

export const createReservation = async (data) => {
  const response = await axios.post(`${API_URL}/reservations`, data);
  return response.data;
};
