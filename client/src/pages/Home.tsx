import { useNavigate } from "react-router-dom";
import "./home.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="home">
            {/* HERO */}
            <section className="home__hero">
                <h1>2026 World Cup Prediction System</h1>
                <p>
                    Predict group standings, match results, and compete on a live
                    leaderboard as real-world results update.
                </p>
            </section>

            {/* FEATURES */}
            <section className="home__grid">
                {/* Predict Groups */}
                <div className="home__card">
                    <h2>Predict Groups</h2>
                    <p>
                        Submit predictions for how teams will finish in their group stage,
                        including ranking the selected third-place teams.
                    </p>
                    <p className="home__note">
                        These predictions are currently not scored on the leaderboard.
                        You must save the URL after submission to revisit them later.
                    </p>

                    <button onClick={() => navigate("/predict-groups")}>
                        Go to Predict Groups
                    </button>
                </div>

                {/* Predict Matches */}
                <div className="home__card">
                    <h2>Predict Matches</h2>
                    <p>
                        Predict every group-stage match individually. As you enter scores,
                        group tables update dynamically so you can see standings in real time.
                    </p>
                    <p className="home__note">
                        Note: Ties between teams are broken by H2H, GD, and GF (in that order).
                        Click <a href="https://en.wikipedia.org/wiki/2026_FIFA_World_Cup#Group_stage">here</a> for more information.
                        Further tie-breakers like fair play score are not currently implemented.
                    </p>
                    <p>
                        Your predictions are scored automatically on a live leaderboard as
                        real match results come in.
                    </p>

                    <button onClick={() => navigate("/predict-matches")}>
                        Go to Predict Matches
                    </button>
                </div>

                {/* Leaderboard */}
                <div className="home__card">
                    <h2>Leaderboard</h2>
                    <p>
                        View all submitted predictions ranked from best to worst based on
                        scoring accuracy.
                    </p>

                    <p>
                        Scoring system (3 points per match):
                        <br />• 1 point for correct result (W/L/D)
                        <br />• 1 point for correct goal difference
                        <br />• 1 point for exact scoreline
                    </p>

                    <p>
                        Click any entry to view full prediction breakdowns and compare them
                        with actual results.
                    </p>

                    <button onClick={() => navigate("/leaderboard")}>
                        View Leaderboard
                    </button>
                </div>
            </section>
        </div>
    );
}
