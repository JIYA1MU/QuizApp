import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Button from "./components/Button";
import Quiz from "./pages/Quiz";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Button />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
