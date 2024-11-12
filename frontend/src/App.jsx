/* eslint-disable react/prop-types */
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import HomeAdmin from "./views/admin/HomeAdmin";
import Game from "./views/User/Game/Game";
import PreFetch from "./PreFetch";
import HomeUser from "./views/User/Home";
import Summary from "./views/User/Summary/Summary";
import Result from "./views/User/Result/Result";
import Project from "./views/admin/Project";
import Candidate from "./views/admin/Candidate";
import CandidateDetails from "./views/admin/CandidateDetails/CandidateDetails";
import Profile from "./views/admin/Profile/Profile";
import ProfileUser from "./views/User/Profile/Profile";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Routes admin */}
      <Route path="/admin" element={<PreFetch />}>
        <Route path="home" element={<HomeAdmin />} />
        <Route path="projects" element={<Project />} />
        <Route path="candidates" element={<Candidate />} />
        <Route path="candidates/details" element={<CandidateDetails />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Routes user  */}
      <Route path="/" element={<PreFetch />}>
        <Route index path="user" element={<HomeUser />} />
        <Route path="game" element={<Game />} />
        <Route path="summary" element={<Summary />} />
        <Route path="result" element={<Result />} />
        <Route path="profile" element={<ProfileUser />} />
      </Route>
    </Routes>
  );
};

export default App;
