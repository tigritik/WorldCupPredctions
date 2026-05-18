import './App.css'
import PredictGroups from "./pages/PredictGroups.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import DisplayPredictions from "./pages/DisplayPredictions.tsx";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<PredictGroups />} />
              <Route
                  path="/predictions/:name"
                  element={<DisplayPredictions />}
              />
          </Routes>
      </BrowserRouter>
  );
}

export default App
