import type { KnockoutMatchResult } from "@shared/types";
import "./StaticBracketMatch.css";

type Props = {
    match: KnockoutMatchResult;
};

export default function StaticBracketMatch({ match }: Props) {

    const home = match.teams[0];
    const away = match.teams[1];

    const isHomeWinner = match.winner && home && match.winner.id === home.id;

    const isAwayWinner = match.winner && away && match.winner.id === away.id;

    return (
        <div className="bracket-match">
            <div className={`team ${isHomeWinner ? "winner" : ""}`}>
                {home?.code ?? match.homeRef}
            </div>

            <div className="vs">vs</div>

            <div className={`team ${isAwayWinner ? "winner" : ""}`}>
                {away?.code ?? match.awayRef}
            </div>

        </div>
    );
}