import type {MatchResult, TeamStats} from "./types";
import type {Match, Team, GroupPredictions, MatchPrediction} from "@shared/types.ts";

export const getFlagUrl = (code: string) =>
    `https://api.fifa.com/api/v3/picture/flags-sq-2/${code}`;

export function groupPredsToMatchPreds(groupPredictions: GroupPredictions, matches: Match[]): MatchPrediction[] {
    // teamId -> rank within group
    const teamRankMap = new Map<string, number>();

    for (const teamIds of Object.values(groupPredictions.groups)) {
        teamIds.forEach((teamId, index) => {
            teamRankMap.set(teamId, index + 1);
        });
    }

    // groupName -> winning margin for 3rd-place team
    const thirdPlaceMarginMap = new Map<string, number>();

    groupPredictions.thirdPlaceRanking.forEach((groupName, index) => {
        thirdPlaceMarginMap.set(
            groupName,
            groupPredictions.thirdPlaceRanking.length - index + 1
        );
    });

    const predictions: MatchPrediction[] = [];

    for (const match of matches) {
        const [home_id, away_id] = match.teamIds;
        const homeRank = teamRankMap.get(home_id);
        const awayRank = teamRankMap.get(away_id);

        if (!homeRank || !awayRank)
            throw new Error(`Missing rank for teams ${home_id} / ${away_id}`);

        let homeScore: number;
        let awayScore: number;

        // Higher-ranked team always wins
        if (homeRank < awayRank) {
            // Special case: 3rd beats 4th
            if (homeRank === 3 && awayRank === 4) {
                const margin = thirdPlaceMarginMap.get(match.group) ?? 1;
                homeScore = margin;
                awayScore = 0;
            } else {
                homeScore = 1;
                awayScore = 0;
            }
        } else {
            // Special case: 3rd beats 4th
            if (awayRank === 3 && homeRank === 4) {
                const margin = thirdPlaceMarginMap.get(match.group) ?? 1;
                homeScore = 0;
                awayScore = margin;
            } else {
                homeScore = 0;
                awayScore = 1;
            }
        }

        predictions.push({
            matchNum: match.matchNum,
            score: [homeScore, awayScore]
        });
    }

    return predictions;
}

export function calculatePoints( // calculate points for a prediction
    predictedHome: number | null, predictedAway: number | null, 
    actualHome: number, actualAway: number): number {
    
    if (predictedHome === null || predictedAway === null) {
        return 0;
    }

    let points = 0;

    const predictedDiff = predictedHome - predictedAway;
    const actualDiff = actualHome - actualAway;

    const predictedResult =
        predictedDiff > 0 ? "W" :
            predictedDiff < 0 ? "L" : "D";

    const actualResult =
        actualDiff > 0 ? "W" :
            actualDiff < 0 ? "L" : "D";

    // 1 point for correct result
    if (predictedResult === actualResult) points++;

    // 1 point for correct goal difference
    if (predictedDiff === actualDiff) points++;

    // 1 point for exact score
    if (predictedHome === actualHome && predictedAway === actualAway)
        points++;

    return points;
}

// create empty stats object for a team
function createStats(team: Team): TeamStats {
    return {
        team,
        points: 0,
        gf: 0, ga: 0, gd: 0,
        w: 0, d: 0, l: 0
    };
}

// update team stats with a given match score
function updateStats(A: TeamStats|undefined, B: TeamStats|undefined, sa: number, sb: number) {
    if (A) {
        A.gf += sa;
        A.ga += sb;
        A.gd += (sa - sb);

        if (sa > sb) {
            A.points += 3;
            A.w++;
        }
        else if (sb > sa) {
            A.l++;
        }
        else {
            A.points++;
            A.d++;
        }
    }

    if (B) {
        B.gf += sb;
        B.ga += sa;
        B.gd += (sb - sa);

        if (sb > sa) {
            B.points += 3;
            B.w++;
        }
        else if (sa > sb) {
            B.l++;
        }
        else {
            B.points++;
            B.d++;
        }
    }
}

// helper function to construct map (teamId => teamStats) from the given matches
export function buildTable(teams: Team[], matches: MatchResult[]): Map<string, TeamStats> {
    const map = new Map<string, TeamStats>();

    for (const team of teams) {
        map.set(team.id, createStats(team));
    }

    for (const match of matches) {
        const [sa, sb] = match.score;

        if (sa == null || sb == null) continue;

        const [a, b] = match.teams;

        const A = map.get(a.id);
        const B = map.get(b.id);

        updateStats(A, B, sa, sb);
    }

    return map;
}

// helper function to partition teams into subsets that are determined by isSame
function partition(arr: TeamStats[], isSame: (a:TeamStats, b:TeamStats)=>boolean) {
    const groups: TeamStats[][] = [];

    let i = 0;

    while (i < arr.length) {
        let j = i + 1;

        while (j < arr.length && isSame(arr[i], arr[j])) j++;

        groups.push(arr.slice(i, j));

        i = j;
    }

    return groups;
}

// helper function to compare two team stats
function compareStats(a: TeamStats, b: TeamStats) {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;

    return a.team.name.localeCompare(b.team.name);
}

// helper function which resolves ranking between teams level on points
function resolveTieGroup(group: TeamStats[], matches: MatchResult[]) {
    if (group.length <= 1) return group;

    // track which teams are in the currently tied group
    const ids = new Set(group.map(t => t.team.id));

    // original full standings lookup
    const overall = new Map(
        group.map(g => [g.team.id, g])
    );

    // filter matches only between the tied teams
    const h2hMatches = matches.filter(m => {
        const [a, b] = m.teams;
        return ids.has(a.id) && ids.has(b.id);
    });

    // if no H2H games exist, fallback immediately
    if (h2hMatches.length === 0)
        return [...group].sort(compareStats);

    // build head-to-head table
    const h2hTable = buildTable(
        group.map(g => g.team),
        h2hMatches
    );

    // sort the tied set of teams based only on h2h results
    const h2hList = group.map(g => h2hTable.get(g.team.id)!);
    h2hList.sort(compareStats);

    // repartition the teams into subsets which are still tied
    const stillTiedGroups = partition(
        h2hList,
        (a, b) =>
            a.points === b.points &&
            a.gd === b.gd &&
            a.gf === b.gf
    );

    // compute the final sorted order
    const final: TeamStats[] = [];

    for (const tiedGroup of stillTiedGroups) {
        // continue applying H2H recursively (only if group size decreased)
        if (tiedGroup.length < group.length) {
            final.push(
                ...resolveTieGroup(
                    tiedGroup.map( // make sure to pass team stats from ALL matches
                        t => overall.get(t.team.id)!
                    ),
                    matches
                )
            );
        }
        // otherwise h2h cannot reduce further so apply overall stats
        else {
            final.push(
                ...tiedGroup
                    .map(t =>
                        overall.get(t.team.id)!
                    )
                    .sort(compareStats)
            );
        }
    }

    return final;
}

// return an ordered ranking of given TeamStats based on matches played
export function rankTeams(teams: TeamStats[], matches: MatchResult[]) {
    // primary sort by points
    const sorted = [...teams].sort((a, b) => b.points - a.points);

    // partition teams into subsets that are level on points
    // then recursively resolve ties within each subset
    return partition(
        sorted,
        (a, b) => a.points === b.points
    ).flatMap(group =>
        resolveTieGroup(group, matches)
    );
}
