
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FaceRecognition from "./Pages/FaceRecognition";
import Admin from "./Pages/Admin";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FaceRecognition />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;
