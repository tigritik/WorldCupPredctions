import type {KnockoutMatchResult, Team} from "@shared/types.ts";

export function buildInitialBracket(matches: KnockoutMatchResult[], editable: boolean) {
    const bracket = matches.map(match => ({
        ...match,
        teams: editable && match.matchNum > 88 ? [null, null] as [null, null] : match.teams,
        winner: editable ? null : match.winner
    }));
    
    return recomputeBracket(bracket);
}

function resolveReference(ref: string, matches: Map<number, KnockoutMatchResult>) {
    // Initial Round (already populated by backend)
    if (!ref.startsWith("W") && !ref.startsWith("L"))
        return undefined;

    const winner = ref.startsWith("W");
    const matchNum = Number(ref.substring(1));
    const match = matches.get(matchNum);

    if (!match) return null;

    const selectedWinner = match.winner;

    if (!selectedWinner) return null;

    if (winner) return selectedWinner;

    // loser case (for 3rd place match)
    const [home, away] = match.teams;
    if (!home || !away) return null;
    return selectedWinner.id === home.id ? away : home;
}

function recomputeBracket(matches: KnockoutMatchResult[]) {
    const updated = matches.map(m => ({
        ...m
    }));

    const map = new Map(
        updated.map(match => [match.matchNum, match])
    );

    for (const match of updated) {
        const home = resolveReference(match.homeRef, map);
        if (home !== undefined) match.teams[0] = home;

        const away = resolveReference(match.awayRef, map);
        if (away !== undefined) match.teams[1] = away;

        if (match.winner &&
            match.winner.id !== match.teams[0]?.id &&
            match.winner.id !== match.teams[1]?.id
        ) match.winner = null;
    }

    return updated;
}

export function updateWinner(matches: KnockoutMatchResult[], matchNum: number, winner: Team|null) {
    const updated = matches.map(match =>
        match.matchNum === matchNum
            ? {
                ...match,
                winner: winner,
            }
            : match
    );

    return recomputeBracket(updated);
}

export function matchesToPredictions(matches: KnockoutMatchResult[]) {
    return matches.map(match => ({
        matchNum: match.matchNum,
        winnerTeamId: match.winner?.id ?? null,
    }));
}

export function orderMatchGroup(currRound: KnockoutMatchResult[], nextRound: KnockoutMatchResult[]) {
    const sortedCurrentRound: KnockoutMatchResult[] = [];
    
    const map = new Map(
        currRound.map(match => [match.matchNum, match])
    );
    
    for (const match of nextRound) {
        sortedCurrentRound.push(
            map.get(Number(match.homeRef.substring(1)))!,
            map.get(Number(match.awayRef.substring(1)))!
        )
    }
    
    return sortedCurrentRound;
}
