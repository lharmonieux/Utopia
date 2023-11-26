import { useState, useEffect, useReducer } from "react";
import axios from "axios";
import App from "./App";
import { AppContext } from "./views/admin/GameContext.jsx";
import { actReducer } from "./middlewares/ActReducer.js";
import cloudinary from "./utils/cloudinary.js";

const PreFetch = () => {
  const [acts, setActs] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [currentAct, setCurrentAct] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [towns, setTowns] = useState([]);
  const [newActs, dispatch] = useReducer(actReducer, acts);

  //Getting datas from api

  // Acts 
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_REACT_URL_BACK}/acts`)
      .then((response) => {
        //Formatting of act structure
        const formatDatas = response.data.map((act) => ({
          ...act,
          questions: act?.questions.map((question) => ({
            ...question,
            answers: question.answers.map((answer) => ({
              ...answer,
              selected: false,
            })),
          })),
        }));

        setActs(formatDatas);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.message);
        setLoading(false);
      });
  }, [refresh]);

  //Characters
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_URL_BACK}/characters`)
      .then((response) => {
        if (response.data) {
          const charactersLoadImg = response.data.map((character) => {
            return {
              ...character,
              img: cloudinary
                .image(`exploria/${character.img}`)
                .quality("auto:best")
                .format("png"),
            };
          });

          setCharacters(charactersLoadImg);
        }
      })
      .catch((err) => console.log(err.message));
  }, []);

  // Towns 
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_REACT_URL_BACK}/towns`)
      .then((response) => {
        if (response.data) {
          setTowns(response.data);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  //CRUD
  useEffect(() => {
    // Update Act
    if (newActs.type == "updated") {
      axios
        .put(
          `${import.meta.env.VITE_REACT_URL_BACK}/acts/${newActs.idAct}`,
          newActs.act
        )
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
        .delete(`${import.meta.env.VITE_REACT_URL_BACK}/acts/${newActs.idAct}`)
        .then(() => setRefresh((refresh) => ++refresh))
        .catch((error) => console.log(error.message));
    }
  }, [newActs]);

  //Current act for gaming
  useEffect(() => {
    setCurrentAct(acts[0]);
  }, [acts]);

  return (
    <AppContext.Provider
      value={{ acts, loading, dispatch, currentAct, characters, towns }}
    >
      <App />
    </AppContext.Provider>
  );
};

export default PreFetch;
