import { Routes, Route } from "react-router-dom";
import Home from "./views/admin/Home";
import Act from "./views/admin/Act";
import Game from "./views/Game";

const App = () => {
  return (
      <Routes>
        {/* Routes admin */}
        <Route path="/" element={<Home />} />
        <Route path="/acts" element={<Act />} />

        {/* Routes Game  */}
        <Route path="/game" element={<Game />} />
      </Routes>
  );
};

export default App;
