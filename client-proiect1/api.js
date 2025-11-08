import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.56.1:8081'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw { detail: error.response.data.detail || 'Eroare la înregistrare' };
    }
    throw { detail: 'Nu s-a putut conecta la server' };
  }
};


export const login = async (username, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await axios.post(`${API_URL}/login`, formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    
    const accessToken = response.data.access_token;
    await AsyncStorage.setItem('userToken', accessToken);
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw { detail: error.response.data.detail || 'Eroare la autentificare' };
    }
    throw { detail: 'Nu s-a putut conecta la server' };
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem('userToken');
};

export const getTasks = async () => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw { detail: error.response.data.detail || 'Eroare la încărcarea task-urilor' };
    }
    throw { detail: 'Nu s-a putut conecta la server' };
  }
};

export const createTask = async (title, description) => {
  try {
    const response = await api.post('/tasks', { title, description });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw { detail: error.response.data.detail || 'Eroare la crearea task-ului' };
    }
    throw { detail: 'Nu s-a putut conecta la server' };
  }
};

export const createGroup = async (name) => {
  try {
    const response = await api.post('/groups', { name });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw { detail: error.response.data.detail || 'Eroare la crearea grupului' };
    }
    throw { detail: 'Nu s-a putut conecta la server' };
  }
};

export const getTaskDetails = async (taskId) => {
  try {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw { detail: error.response.data.detail || 'Eroare la încărcarea task-ului' };
    }
    throw { detail: 'Nu s-a putut conecta la server' };
  }
};

export const getPublicTasks = async () => {
    try {
        const response = await axios.get(`${API_URL}/tasks/public`);
        return response.data;
    } catch (error) {
        console.error("Eroare la api.getPublicTasks:", error.response.data);
        throw error.response.data;
    }
};

export const delegateTask = async (taskId, username, groupName) => {
  try {
    const response = await api.post(`/tasks/${taskId}/delegate`, {
      targetUsername: username || null,
      targetGroupName: groupName || null,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw { detail: error.response.data.detail || 'Eroare la delegare' };
    }
    throw { detail: 'Nu s-a putut conecta la server' };
  }
};

export default api;