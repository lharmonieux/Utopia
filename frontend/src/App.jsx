/* eslint-disable react/prop-types */
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Act from "./views/admin/Act";
import Game from "./views/User/Game";
import PreFetch from "./PreFetch";
import HomeUser from "./views/User/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Routes admin */}
      <Route path="/admin/acts" element={<Act />} />

      {/* Routes user  */}
      <Route path="/user" element={<PreFetch />}>
        <Route path="home" element={<HomeUser />} />
        <Route path="game" element={<Game />} />
      </Route>
    </Routes>
  );
};

export default App;
