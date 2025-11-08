import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const API_URL = 'http://192.168.56.1:8000';

const BASE_URL = 'http://192.168.56.1:8000'; 

export const register = async (username, password, email, nume, prenume, telefon) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
      email,
      nume,
      prenume,
      telefon,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data; 
  }

  return data; 
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
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    delete axios.defaults.headers.common['Authorization'];
};


export const getTasks = async () => {
  try {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createTask = async (title, description) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, {
      title: title,
      description: description
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//funcții pentru updateTask, deleteTask etc.