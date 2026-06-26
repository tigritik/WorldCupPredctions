import type { KnockoutMatchResult, Team } from "@shared/types";
import "./EditableBracketMatch.css";
import {getFlagUrl} from "@shared/utils.ts";

type Props = {
    match: KnockoutMatchResult;
    onSelectWinner: (matchNum: number, team: Team) => void;
};

export default function EditableBracketMatch(props: Props) {
    const {match, onSelectWinner} = props;

    const home = match.teams[0];
    const away = match.teams[1];

    function isWinner(team: Team | null) {
        if (!team || !match.winner) return false;
        return match.winner.id === team.id;
    }

    function handleClick(team: Team | null) {
        if (!team) return;
        onSelectWinner(match.matchNum, team);
    }

    return (
        <div className="bracket-match">

            <div
                className={`team ${isWinner(home) ? "winner" : ""} ${home ? "clickable" : ""}`}
                onClick={() => handleClick(home)}
            >
                {home?.code && <img className="flag" alt="flag" src={getFlagUrl(home.code)} />}
                {home?.name ?? match.homeRef}
            </div>

            <div className="vs">vs</div>

            <div
                className={`team ${isWinner(away) ? "winner" : ""} ${away ? "clickable" : ""}`}
                onClick={() => handleClick(away)}
            >
                {away?.code && <img className="flag" alt="flag" src={getFlagUrl(away.code)} />}
                {away?.name ?? match.awayRef}
            </div>

        </div>
    );
}