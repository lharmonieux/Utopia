import axios from "axios";
export const createUser = async (user) => {
  const result = await axios({
    method: "post",
    baseURL: import.meta.env.VITE_REACT_URL_BACK,
    url: "users/register",
    withCredentials: true,
    data: user,
  });

  return result;
};
