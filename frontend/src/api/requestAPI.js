/* eslint-disable no-useless-catch */
import axios from "axios";

const request = async (endpoint, method, accessToken, options) => {
  try {
    const response = await axios({
      method: method,
      baseURL: import.meta.env.VITE_REACT_URL_BACK,
      url: endpoint,
      withCredentials: true,
      headers: { Authorization: `Bearer ${accessToken}` },
      ...options,
    });
    return response;
  } catch (error) {
    throw error; // Relancer l'erreur pour la capturer à un niveau supérieur si nécessaire
  }
};

const refreshToken = async () => {
  try {
    const response = await axios({
      method: "get",
      baseURL: import.meta.env.VITE_REACT_URL_BACK,
      url: "auth/refresh",
      withCredentials: true,
    });
    return response.data.accessToken;
  } catch (error) {
    throw error; // Relancer l'erreur pour la capturer à un niveau supérieur si nécessaire
  }
};

const apiRequest = async (endpoint, method, accessToken, options) => {
  try {
    const response = await request(endpoint, method, accessToken, options);
    return { accessToken, response };
  } catch (error) {
    try {
      const newAccessToken = await refreshToken();
      const response = await request(endpoint, method, newAccessToken, options);
      return { accessToken: newAccessToken, response };
    } catch (refreshError) {
      return refreshError.response || refreshError; // Retourner l'erreur du refresh ou sa réponse s'il y en a une
    }
  }
};

export default apiRequest;
