import type { MatchResult } from "@shared/types.ts";
import { getFlagUrl } from "@shared/utils.ts";

import "./PredictedMatchCard.css";
import {useNavigate} from "react-router-dom";

type Props = {
    match: MatchResult;
};

export default function PredictedMatchCard({ match }: Props) {
    const [homeTeam, awayTeam] = match.teams;
    const [homeScore, awayScore] = match.score;
    const navigate = useNavigate();

    function handleClick() {
        navigate(`${location.pathname}/viewMatch/${match.matchNum}`);
    }

    return (
        <div className="match-card clickable" onClick={handleClick}>
            <div className="match-card-header">
                <span>Match {match.matchNum}</span>

                <span className="match-group-badge">
                    Group {match.group}
                </span>
            </div>

            <div className="match-card-body">
                <div className="team-side">
                    <img
                        src={getFlagUrl(homeTeam.code)}
                        alt={`${homeTeam.name} flag`}
                        className="team-flag"
                    />

                    <span className="team-name">
                        {homeTeam.code}
                    </span>
                </div>

                <div className="match-score">
                    <span>{homeScore ?? "-"}</span>

                    <span className="score-divider">:</span>

                    <span>{awayScore ?? "-"}</span>
                </div>

                <div className="team-side team-side-away">
                    <span className="team-name">
                        {awayTeam.code}
                    </span>

                    <img
                        src={getFlagUrl(awayTeam.code)}
                        alt={`${awayTeam.name} flag`}
                        className="team-flag"
                    />
                </div>
            </div>
        </div>
    );
}
