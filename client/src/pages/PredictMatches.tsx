import {useEffect, useMemo, useState} from "react";
import type {MatchResult, SubmitMatchPredictionsRequest} from "@shared/types.ts";
import {fetchMatches} from "../api_helpers.ts";
import ScoreInput from "../components/ScoreInput.tsx";
import {MatchResultTable} from "../components/GroupStageTable.tsx";
import "./predict-matches.css";

export default function PredictMatches() {
    const [matches, setMatches] = useState<MatchResult[]>([]);
    const [name, setName] = useState("");

    useEffect(() => {
        fetchMatches().then(setMatches);
    }, []);

    const groupedMatches = useMemo(() => {
        return matches.reduce<Record<string, MatchResult[]>>((acc, match) => {
            if (!acc[match.group]) acc[match.group] = [];

            acc[match.group].push(match);

            return acc;
        }, {});
    }, [matches]);

    function updateScore(matchNum: number, teamIndex: 0 | 1, value: string) {
        setMatches((prev) =>
            prev.map((match) => {
                if (match.matchNum !== matchNum) return match;

                const parsed =
                    value === "" ? null : Math.max(0, parseInt(value));

                const updatedScore: [number | null, number | null] = [
                    match.score[0],
                    match.score[1],
                ];

                updatedScore[teamIndex] = Number.isNaN(parsed)
                    ? null : parsed;

                return {
                    ...match,
                    score: updatedScore,
                };
            })
        );
    }

    function buildPredictionPayload(): SubmitMatchPredictionsRequest {
        return {
            name,
            predictions: matches.map((match) => ({
                matchNum: match.matchNum,
                score: match.score,
            })),
        };
    }

    function handleSubmit() {
        if (!name.trim()) {
            alert("Please enter a name");
            return;
        }

        const payload = buildPredictionPayload();

        console.log("Submitting match predictions:");
        console.log(payload);

        alert("Prediction schema printed to console");
    }

    return (
        <div className="predict-page">
            <div className="hero">
                <h1>Predict Match Results</h1>
                <p>
                    Enter scores for every group stage match and watch the table
                    update live.
                </p>
            </div>

            <div className="top-bar">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Prediction name"
                    className="name-input"
                />

                <button onClick={handleSubmit} className="submit-button">
                    Submit Predictions
                </button>
            </div>

            {Object.entries(groupedMatches).map(([groupName, groupMatches]) => (
                <section key={groupName} className="group-section">
                    <div className="group-header">
                        <h2>Group {groupName}</h2>
                    </div>

                    <div className="group-layout">
                        <div className="matches-card">
                            <h3>Matches</h3>

                            <div className="matches-list">
                                {groupMatches.map((match) => (
                                    <div
                                        key={match.matchNum}
                                        className="match-row"
                                    >
                                        <ScoreInput
                                            team={match.teams[0]}
                                            value={match.score[0]}
                                            onChange={(value) =>
                                                updateScore(
                                                    match.matchNum,
                                                    0,
                                                    value
                                                )
                                            }
                                        />

                                        <div className="vs">vs</div>

                                        <ScoreInput
                                            team={match.teams[1]}
                                            value={match.score[1]}
                                            onChange={(value) =>
                                                updateScore(
                                                    match.matchNum,
                                                    1,
                                                    value
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="table-card">
                            <h3>Live Table</h3>

                            <MatchResultTable matches={groupMatches} />
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
}
