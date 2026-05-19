import type {MatchResult, TeamStats} from "./types";

export const getFlagUrl = (code: string) =>
    `https://api.fifa.com/api/v3/picture/flags-sq-2/${code}`;

// helper function which resolves ranking between teams level on points
function resolveTieGroup(group: TeamStats[], matches: MatchResult[]) {
    if (group.length <= 1) return group;

    const ids = new Set(group.map(t => t.team.id));

    // overall lookup
    const overall = new Map(
        group.map(g => [g.team.id, g])
    );

    // initialize ALL tied teams
    const h2h = new Map<string, TeamStats>();

    for (const g of group) {
        h2h.set(g.team.id, {
            team: g.team,
            points: 0,
            gf: 0,
            ga: 0,
            gd: 0,
            w: 0,
            d: 0,
            l: 0,
        });
    }

    let hasH2HMatches = false;

    // build head-to-head table
    for (const m of matches) {
        const [a, b] = m.teams;

        if (!ids.has(a.id) || !ids.has(b.id)) {
            continue;
        }

        hasH2HMatches = true;

        const [sa, sb] = m.score as [number, number];

        const A = h2h.get(a.id)!;
        const B = h2h.get(b.id)!;

        A.gf += sa;
        A.ga += sb;

        B.gf += sb;
        B.ga += sa;

        if (sa > sb) {
            A.points += 3;
            A.w++;
            B.l++;
        } else if (sb > sa) {
            B.points += 3;
            B.w++;
            A.l++;
        } else {
            A.points += 1;
            B.points += 1;
            A.d++;
            B.d++;
        }
    }

    for (const s of h2h.values()) {
        s.gd = s.gf - s.ga;
    }

    const list = group.map(g => h2h.get(g.team.id)!);

    const compareOverall = (a: TeamStats, b: TeamStats) => {
        const oa = overall.get(a.team.id)!;
        const ob = overall.get(b.team.id)!;

        if (ob.points !== oa.points) return ob.points - oa.points;
        if (ob.gd !== oa.gd) return ob.gd - oa.gd;
        if (ob.gf !== oa.gf) return ob.gf - oa.gf;

        return oa.team.name.localeCompare(ob.team.name);
    };

    const compareH2H = (a: TeamStats, b: TeamStats) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;

        return compareOverall(a, b);
    };

    // if no H2H games exist, skip directly to overall
    list.sort(hasH2HMatches ? compareH2H : compareOverall);

    // recursively resolve remaining exact H2H ties
    // if (!hasH2HMatches) {
    //     return list;
    // }

    const final: TeamStats[] = [];

    let i = 0;

    while (i < list.length) {
        let j = i + 1;

        while (
            j < list.length &&
            list[j].points === list[i].points &&
            list[j].gd === list[i].gd &&
            list[j].gf === list[i].gf
            ) {
            j++;
        }

        const tied = list.slice(i, j);

        // recurse only on smaller subsets
        if (tied.length > 1 && tied.length < group.length) {
            const originalStats = tied.map(
                t => overall.get(t.team.id)!
            );

            final.push(
                ...resolveTieGroup(originalStats, matches)
            );
        } else {
            final.push(
                ...tied.map(t => overall.get(t.team.id)!)
            );
        }

        i = j;
    }

    return final;
}

export function rankTeams(teams: TeamStats[], matches: MatchResult[]) {
    // primary sort by points
    const sorted = [...teams].sort((a, b) => b.points - a.points);
    console.log(sorted);

    const result: TeamStats[] = [];

    let i = 0;

    while (i < sorted.length) {
        let j = i;

        // find tie group by points
        while (j < sorted.length && sorted[j].points === sorted[i].points) {
            j++;
        }

        const group = sorted.slice(i, j);
        console.log(group);

        result.push(...resolveTieGroup(group, matches));
        console.log("resolution: ", resolveTieGroup(group, matches));

        i = j;
    }

    return result;
}
