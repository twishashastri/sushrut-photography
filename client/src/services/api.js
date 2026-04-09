import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const API = axios.create({ 
  baseURL: API_URL
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers['x-auth-token'] = token;
  }
  return req;
});

export const fetchEvents = () => API.get('/events');
export const createEvent = (data) => API.post('/events', data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

export const fetchPhotos = (event) => {
  const params = event ? { event } : {};
  return API.get('/photos', { params });
};
export const fetchPhotosByEvent = (event) => API.get(`/photos/event/${event}`);
export const fetchPhotosBySection = (section) => API.get(`/photos/section/${section}`);
export const deletePhoto = (id) => API.delete(`/photos/${id}`);
export const fetchPhotosByCategory = (category) => API.get(`/photos/category/${category}`);

export const login = (data) => API.post('/auth/login', data);

export default API;