import './App.css'
import PredictGroups from "./pages/PredictGroups.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import DisplayPredictions from "./pages/DisplayPredictions.tsx";
import PredictMatches from "./pages/PredictMatches.tsx";
import DisplayMatchPredictions from "./pages/DisplayMatchPredictions.tsx";
import LeaderboardPage from "./pages/LeaderboardPage.tsx";

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/predict-groups" element={<PredictGroups />} />
              <Route path="/predict-matches" element={<PredictMatches />} />
              <Route
                  path="/predictions/:id"
                  element={<DisplayPredictions />}
              />
              <Route
                  path="/match-predictions/:id"
                  element={<DisplayMatchPredictions />}
              />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App
