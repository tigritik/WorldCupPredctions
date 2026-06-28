import {useMemo, type SetStateAction, type Dispatch} from "react";
import type {KnockoutMatchResult, Team} from "@shared/types";
import {updateWinner, orderMatchGroup} from "@shared/bracket";
import "./Bracket.css";
import BracketRound from "./BracketRound.tsx";

type BracketProps = {
    editable: boolean;
    matches: KnockoutMatchResult[];
    setMatches:  Dispatch<SetStateAction<KnockoutMatchResult[]>>
};

export function Bracket(props: BracketProps) {
    const { editable, matches, setMatches } = props;

    function handleSelectWinner(matchNum: number, team: Team) {
        if (!editable) return;

        setMatches(prev =>
            updateWinner(prev, matchNum, team)
        );
    }

    const rounds = useMemo(() => {
        const map = new Map<number, KnockoutMatchResult>();

        matches.forEach(m => map.set(m.matchNum, m));

        const groups: Record<string, KnockoutMatchResult[]> = {
            "RO32": [],
            "RO16": [],
            "QF": [],
            "SF": [],
            "F3": [],
            "FINAL": []
        };

        for (const m of matches) {
            if (m.matchNum >= 73 && m.matchNum <= 88) {
                groups.RO32.push(m);
            } else if (m.matchNum <= 96) {
                groups.RO16.push(m);
            } else if (m.matchNum <= 100) {
                groups.QF.push(m);
            } else if (m.matchNum <= 102) {
                groups.SF.push(m);
            } else if (m.matchNum === 103) {
                groups.F3.push(m);
            } else {
                groups.FINAL.push(m);
            }
        }

        groups["SF"] = orderMatchGroup(groups["SF"], groups["FINAL"]);
        groups["QF"] = orderMatchGroup(groups["QF"], groups["SF"]);
        groups["RO16"] = orderMatchGroup(groups["RO16"], groups["QF"]);
        groups["RO32"] = orderMatchGroup(groups["RO32"], groups["RO16"]);

        return groups;
    }, [matches]);

    return (
        <div className="bracket-container">
            <div className="bracket-scroll">
                <BracketRound
                    title="Round of 32"
                    matches={rounds.RO32}
                    editable={editable}
                    round={0}
                    onSelectWinner={handleSelectWinner}
                />

                <BracketRound
                    title="Round of 16"
                    matches={rounds.RO16}
                    editable={editable}
                    round={1}
                    onSelectWinner={handleSelectWinner}
                />

                <BracketRound
                    title="Quarterfinals"
                    matches={rounds.QF}
                    editable={editable}
                    round={2}
                    onSelectWinner={handleSelectWinner}
                />

                <BracketRound
                    title="Semifinals"
                    matches={rounds.SF}
                    editable={editable}
                    round={3}
                    onSelectWinner={handleSelectWinner}
                />

                <BracketRound
                    title="3rd Place"
                    matches={rounds.F3}
                    editable={editable}
                    round={4}
                    onSelectWinner={handleSelectWinner}
                />

                <BracketRound
                    title="Final"
                    matches={rounds.FINAL}
                    editable={editable}
                    round={4}
                    onSelectWinner={handleSelectWinner}
                />
            </div>
        </div>
    );
}