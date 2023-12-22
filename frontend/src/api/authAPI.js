import axios from "axios";
import { loginFail, setToken } from "../utils/redux/authSlice";

export const login = (credentials, dispatch) => {
  axios
    .post(`${import.meta.env.VITE_REACT_URL_BACK}/auth`, credentials, {
      withCredentials: true,
    })
    .then((response) => {
      dispatch(setToken({ token: response.data.accessToken, error: null }));
    })
    .catch((error) => {
      dispatch(loginFail({ error: error.response.data.message, token: null }));
    });
};
