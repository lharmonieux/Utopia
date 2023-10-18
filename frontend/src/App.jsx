import { Routes, Route } from "react-router-dom";
import Home from "./views/admin/Home";
import Act from "./views/admin/Act";
import { ActContext, AppContext } from "./views/admin/GameContext";
import { useContext } from "react";

const App = () => {
  const {acts, loading, dispatch} = useContext(AppContext);
  return (
    <ActContext.Provider value={{acts, dispatch}}>
      <Routes>
        {/* Routes admin */}
        <Route path="/" element={<Home loading={loading} />} />
        <Route path="/acts" element={<Act />} />

      </Routes>
    </ActContext.Provider>
  );
};

export default App;
