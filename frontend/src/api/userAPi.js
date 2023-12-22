import axios from "axios";
import { createUserError, createUserSuccess } from "../utils/redux/userSlice.js";

export const createUser = (user, dispatch) => {
  axios
    .post(`${import.meta.env.VITE_REACT_URL_BACK}/users/register`, user)
    .then((response) => {
      dispatch(createUserSuccess(response.data));
    })
    .catch((err) => dispatch(createUserError(err.response.data)));
};
