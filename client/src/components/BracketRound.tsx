import type { KnockoutMatchResult, Team } from "@shared/types";
import "./BracketRound.css";
import EditableBracketMatch from "./EditableBracketMatch.tsx";
import StaticBracketMatch from "./StaticBracketMatch.tsx";

type Props = {
    title: string;
    matches: KnockoutMatchResult[];
    editable: boolean;

    onSelectWinner: (matchNum: number, team: Team) => void;
};

export default function BracketRound(props: Props) {
    return (
        <div className="bracket-round">
            <div className="bracket-round-title">
                {props.title}
            </div>

            <div className="bracket-round-matches">
                {props.matches.map(match => (
                    props.editable ?
                        <EditableBracketMatch
                            key={match.matchNum}
                            match={match}
                            onSelectWinner={props.onSelectWinner}
                        /> :
                        <StaticBracketMatch
                            key={match.matchNum}
                            match={match}
                        />
                ))}
            </div>
        </div>
    );
}
