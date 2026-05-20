import {useEffect, useMemo, useRef, useState} from "react";
import type {MatchResult, SubmitMatchPredictionsRequest} from "@shared/types.ts";
import {fetchMatches} from "../api_helpers.ts";
import ScoreInput from "../components/ScoreInput.tsx";
import {MatchResultTable} from "../components/GroupStageTable.tsx";
import "./predict-matches.css";

export default function PredictMatches() {
    const [matches, setMatches] = useState<MatchResult[]>([]);
    const [name, setName] = useState("");
    const firstMissingInputRef = useRef<HTMLInputElement | null>(null);
    const [showValidationErrors, setShowValidationErrors] = useState(false);

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

    const firstMissing = (() => {
        for (const match of matches) {
            if (match.score[0] === null) {
                return {
                    matchNum: match.matchNum,
                    teamIndex: 0 as const,
                };
            }

            if (match.score[1] === null) {
                return {
                    matchNum: match.matchNum,
                    teamIndex: 1 as const,
                };
            }
        }

        return null;
    })();

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

        setShowValidationErrors(true);
        if (firstMissing) {
            alert("Please enter scores for every match.");

            requestAnimationFrame(() => {
                firstMissingInputRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });

                firstMissingInputRef.current?.focus();
            });

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
                                {groupMatches.map((match) => {
                                    const homeMissing = match.score[0] === null;
                                    const awayMissing = match.score[1] === null;
                                    const isFirstMissingHome =
                                        firstMissing?.matchNum === match.matchNum &&
                                        firstMissing.teamIndex === 0;
                                    const isFirstMissingAway =
                                        firstMissing?.matchNum === match.matchNum &&
                                        firstMissing.teamIndex === 1;
                                    return(
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
                                            showError={showValidationErrors && homeMissing}
                                            inputRef={isFirstMissingHome ? firstMissingInputRef : undefined}
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
                                            showError={showValidationErrors && awayMissing}
                                            inputRef={isFirstMissingAway ? firstMissingInputRef : undefined}
                                        />
                                    </div>
                                )})}
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
