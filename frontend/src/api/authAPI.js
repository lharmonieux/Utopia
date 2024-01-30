import axios from "axios";

export const login = async (credentials) => {
  const result = await axios({
    method: "post",
    baseURL: import.meta.env.VITE_REACT_URL_BACK || "",
    url: "/auth",
    withCredentials: true,
    data: credentials,
  });

  return result;
};
