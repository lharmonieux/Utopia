import { useState, useEffect, useReducer } from "react";
import axios from "axios";
import App from "./App";
import { AppContext } from "./views/admin/GameContext.jsx";
import { actReducer } from "./middlewares/ActReducer.js";

const PreFetch = () => {
  const [acts, setActs] = useState([]);
  const [currentAct, setCurrentAct] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState({});
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

  //CRUD
  useEffect(() => {
    // Update Act
    if (newActs.type == "updated") {
      axios
        .put(`http://localhost:5555/acts/${newActs.idAct}`, newActs.act)
        .then(() => {
          setRefresh((refresh) => ++refresh);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
    // Delete Act
    else if (newActs.type == "deleted") {
      axios
        .delete(`http://localhost:5555/acts/${newActs.idAct}`)
        .then(() => setRefresh((refresh) => ++refresh))
        .catch((error) => console.log(error.message));
    }
  }, [newActs]);

  //Current act for gaming
  useEffect(() => {
    setCurrentAct(acts[0]);
    setCurrentQuestion(() => {
      const actCopy = [...acts];
      return actCopy[0]?.questions.shift();
    });
  }, [acts]);

  return (
    <AppContext.Provider value={{ acts, loading, dispatch, currentAct, currentQuestion }}>
      <App />
    </AppContext.Provider>
  );
};

export default PreFetch;
