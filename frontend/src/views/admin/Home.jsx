import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "./GameContext.jsx";
// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { ActContext } from "./GameContext";

const Home = () => {
  const {loading} = useContext(AppContext);
  
  return (
      <div>
        {loading ? (
          <p>Chargement des données...</p>
        ) : (
          <div>
            <Link
              to= 'acts'
            >
              <button className="border" type="button">Administrer les actes</button>
            </Link>
          </div>
        )}
      </div>
  );
};

export default Home;
