import './App.css'
import PredictGroups from "./pages/PredictGroups.tsx";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import DisplayPredictions from "./pages/DisplayPredictions.tsx";
import PredictMatches from "./pages/PredictMatches.tsx";
import DisplayMatchPredictions from "./pages/DisplayMatchPredictions.tsx";
import LeaderboardPage from "./pages/LeaderboardPage.tsx";
import MatchViewPage from "./pages/ViewMatch.tsx";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home.tsx";

function App() {
  return (
      <BrowserRouter>
          <Routes >
              <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
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
                  <Route
                      path="/match-predictions/:id/viewMatch/:matchNum"
                      element={<MatchViewPage />}
                  />
                  <Route path="/predict-bracket" element={
                      <p>THIS FEATURE WILL GO LIVE ONCE THE KNOCKOUTS ARE FIXED</p>
                  } />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App
