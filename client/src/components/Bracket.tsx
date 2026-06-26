import { useEffect, useMemo, useState } from "react";
import type {
    KnockoutMatchResult,
    Team,
    BracketPrediction
} from "@shared/types";

import {
    buildInitialBracket,
    updateWinner,
    matchesToPredictions
} from "@shared/bracket";
import "./Bracket.css";
import { fetchKnockoutMatches } from "../api_helpers";
import BracketRound from "./BracketRound.tsx";

type BracketProps = {
    editable: boolean;
    onChange?: (predictions: BracketPrediction[]) => void;
};

export function Bracket({ editable, onChange }: BracketProps) {
    const [matches, setMatches] = useState<KnockoutMatchResult[]>([]);
    const [loading, setLoading] = useState(true);

    // load bracket
    useEffect(() => {
        fetchKnockoutMatches().then(
            data => setMatches(buildInitialBracket(data, editable))
        ).finally(() => setLoading(false));

    }, [loading, editable]);

    // propagate changes upward
    useEffect(() => {
        if (!onChange) return;

        onChange(matchesToPredictions(matches));
    }, [matches, onChange]);

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

        return groups;
    }, [matches]);

    if (loading) {
        return <div className="bracket-loading">Loading bracket...</div>;
    }

    return (
        <div className="bracket-container">
            <div className="bracket-scroll">
                <BracketRound
                    title="Round of 32"
                    matches={rounds.RO32}
                    editable={editable}
                    onSelectWinner={handleSelectWinner}
                />

                <BracketRound
                    title="Round of 16"
                    matches={rounds.RO16}
                    editable={editable}
                    onSelectWinner={handleSelectWinner}
                />

                <BracketRound
                    title="Quarterfinals"
                    matches={rounds.QF}
                    editable={editable}
                    onSelectWinner={handleSelectWinner}
                />

                <BracketRound
                    title="Semifinals"
                    matches={rounds.SF}
                    editable={editable}
                    onSelectWinner={handleSelectWinner}
                />

                <BracketRound
                    title="3rd Place"
                    matches={rounds.F3}
                    editable={editable}
                    onSelectWinner={handleSelectWinner}
                />

                <BracketRound
                    title="Final"
                    matches={rounds.FINAL}
                    editable={editable}
                    onSelectWinner={handleSelectWinner}
                />
            </div>
        </div>
    );
}