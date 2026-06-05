import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFlagUrl, calculatePoints } from "@shared/utils.ts";
import "./view-match.css";
import type {MatchViewResponse} from "@shared/types.ts";
import {fetchMatchView} from "../api_helpers.ts";

export default function MatchViewPage() {
    const { id, matchNum } = useParams();

    const [data, setData] = useState<MatchViewResponse|null>(null);

    useEffect(() => {
        if (!id || !matchNum) return;

        fetchMatchView(id, matchNum).then(setData);
    }, [id, matchNum]);

    if (!data) return <div>Loading...</div>;

    const [predHome, predAway] = data.predictedScore;
    const [actHome, actAway] = data.actualScore;

    const points = calculatePoints(predHome, predAway, actHome ?? 0, actAway ?? 0);

    const score = {
        result: points >= 1,
        goalDiff: points >= 2,
        exact: points >= 3
    };

    return (
        <div className="match-view">
            <h2>
                Match {data.matchNum} - Group {data.group}
            </h2>

            <div className="match-detail-card">

                {/* HOME */}
                <div className="team-block">
                    <img
                        src={getFlagUrl(data.homeTeam.code)}
                        alt={data.homeTeam.name}
                    />
                    <div>{data.homeTeam.name}</div>
                </div>

                {/* SCORE */}
                <div className="score-block">
                    <div>
                        <strong>Actual:</strong>{" "}
                        {actHome ?? "-"} : {actAway ?? "-"}
                    </div>

                    <div>
                        <strong>Your prediction:</strong>{" "}
                        {predHome ?? "-"} : {predAway ?? "-"}
                    </div>

                    <div className="score-breakdown">
                        <div>
                            Result: {score.result ? "✓ (+1)" : "✗"}
                        </div>
                        <div>
                            Goal diff: {score.goalDiff ? "✓ (+1)" : "✗"}
                        </div>
                        <div>
                            Exact: {score.exact ? "✓ (+1)" : "✗"}
                        </div>

                        <div className="total">
                            {points} / 3 pts
                        </div>
                    </div>
                </div>

                {/* AWAY */}
                <div className="team-block">
                    <img
                        src={getFlagUrl(data.awayTeam.code)}
                        alt={data.awayTeam.name}
                    />
                    <div>{data.awayTeam.name}</div>
                </div>

            </div>
        </div>
    );
}