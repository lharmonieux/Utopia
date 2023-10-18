import { useState, useEffect, useReducer } from "react";
import axios from "axios";
import App from "./App";
import { AppContext } from "./views/admin/GameContext.jsx";
import { actReducer } from "./middlewares/ActReducer.js";

const PreFetch = () => {
  const [acts, setActs] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newActs, dispatch] = useReducer(actReducer, acts);
  //Getting actes from api
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5555/acts")
      .then((response) => {
        setActs(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
        setLoading(false);
      });
  }, [refresh]);

  useEffect(() => {
    axios
      .put(`http://localhost:5555/acts/${newActs.idAct}`, newActs.act)
      .then(() => {
        setRefresh((refresh) => refresh + 1);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, [newActs]);
  return (
    <AppContext.Provider value={{ acts, loading, dispatch }}>
      <App />
    </AppContext.Provider>
  );
};

export default PreFetch;
