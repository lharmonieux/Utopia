import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "./GameContext.jsx";
// import { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { ActContext } from "./GameContext";

const Home = () => {
  const { loading } = useContext(AppContext);
  //   const [acts, setActs] = useState([]);
  //   const [loading, setLoading] = useState(false);
  //Getting actes from api
  //   useEffect(() => {
  //     setLoading(true);
  //     axios
  //       .get("http://localhost:5555/acts")
  //       .then((response) => {
  //         setActs(response.data);
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         console.error(error.message);
  //         setLoading(false);
  //       });
  //   }, []);
  return (
    <div>
      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        <div>
          <Link
            to="acts"
            //   state={acts}
          >
            <button className="border" type="button">
              Administrer les actes
            </button>
          </Link>
          <Link to="game">
            <button className="border">Accéder à la démo</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
