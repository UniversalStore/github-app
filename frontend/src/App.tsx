import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import CodeReviewsPage from "./pages/CodeReviews/CodeReviewsPage";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" Component={HomePage}/>
          <Route path="/code-reviews" Component={CodeReviewsPage}/>
        </Routes>
      </Router>
  );
}

export default App;
