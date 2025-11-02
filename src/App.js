import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExpensePage from "./pages/ExpensePage";
import SummaryPage from "./pages/SummaryPage";

/**
 * App Component
 * --------------
 * Handles routing between pages.
 */
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExpensePage />} />
        <Route path="/summary" element={<SummaryPage />} />
      </Routes>
    </Router>
  );
};

export default App;

