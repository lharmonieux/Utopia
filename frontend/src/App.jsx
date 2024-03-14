/* eslint-disable react/prop-types */
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Act from "./views/admin/Act";
import Game from "./views/User/Game";
import PreFetch from "./PreFetch";
import HomeUser from "./views/User/Home";
import Summary from "./views/User/Summary";
import Result from "./views/User/Result";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Routes admin */}
      <Route path="/admin/acts" element={<Act />} />

      {/* Routes user  */}
      <Route path="/" element={<PreFetch />}>
        <Route index path="user" element={<HomeUser />} />
        <Route path="game" element={<Game />} />
        <Route path="summary" element={<Summary />} />
        <Route path="result" element={<Result />} />
      </Route>
    </Routes>
  );
};

export default App;
