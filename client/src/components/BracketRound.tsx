import type { KnockoutMatchResult, Team } from "@shared/types";
import "./BracketRound.css";
import EditableBracketMatch from "./EditableBracketMatch.tsx";
import StaticBracketMatch from "./StaticBracketMatch.tsx";
import type {CSSProperties} from "react";

type Props = {
    title: string;
    matches: KnockoutMatchResult[];
    editable: boolean;
    round: number;
    onSelectWinner: (matchNum: number, team: Team) => void;
};

export default function BracketRound(props: Props) {
    const pad = `${8 + 50*(2**props.round-1)}px 0px`;
    const gap = `${(132 + 12) * (2 ** props.round) - 132}px 0px`;

    return (
        <div className="bracket-round">
            <div className="bracket-round-title">
                {props.title}
            </div>

            <div
                className="bracket-round-matches"
                style={ {
                    "--round-padding": pad,
                    "--round-gap": gap
                } as CSSProperties}
            >
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
