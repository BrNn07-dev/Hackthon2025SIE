import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const API_URL = 'http://192.168.56.1'; 

export const register = async (username, password, email, nume, prenume, telefon) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username: username,
      password: password,
      email: email,
      nume: nume,
      prenume: prenume,
      telefon: telefon
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
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
    
    // Salvăm token-ul local
    await AsyncStorage.setItem('userToken', accessToken);
    
    // Setăm header-ul default pentru TOATE cererile viitoare
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
    // Ștergem token-ul local
    await AsyncStorage.removeItem('userToken');
    // Ștergem header-ul default
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

// Poți adăuga aici și funcții pentru updateTask, deleteTask etc.