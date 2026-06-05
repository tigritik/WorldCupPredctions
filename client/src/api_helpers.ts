import type {
    FetchGroupPredictionResponse,
    FetchMatchPredictionResponse,
    Group,
    GroupPredictions,
    LoadedGroup, Match, MatchPrediction, MatchResult,
    SubmitGroupPredictionRequest, SubmitMatchPredictionsRequest,
    SubmitPredictionResponse,
    Team
} from "@shared/types.ts";
import type {LeaderboardEntry} from "@shared/types";

const endpoint = "http://localhost:3000";

export async function fetchGroups(): Promise<LoadedGroup[]> {
    const response = await fetch(`${endpoint}/groups`);

    const groups: Group[] = await response.json();

    return Promise.all(groups.map(async group => {
        const teams = await Promise.all(
            group.teamIds.map(teamId => fetchTeam(teamId))
        );

        return {
          name: group.name,
          teams
        };
    }));
}

export async function fetchTeam(id: string): Promise<Team> {
    const response = await fetch(`${endpoint}/teams/${id}`);

    return response.json();
}

export async function submitGroupPredictions(payload: SubmitGroupPredictionRequest): Promise<SubmitPredictionResponse> {
    const response = await fetch(`${endpoint}/group-predictions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return response.json();
}

export async function fetchGroupPredictions(id: string): Promise<FetchGroupPredictionResponse> {
    const response = await fetch(`${endpoint}/group-predictions/${id}`);

    if (!response.ok) return {name: null, data: null};

    const json = await response.json();
    const name = json.name;
    const predictions: GroupPredictions = json.predictions;

    const loadedGroups: LoadedGroup[] = await Promise.all(
        Object.entries(predictions.groups).map(async ([name, teamIds]) => {
            const teams = await Promise.all(
                teamIds.map(teamId => fetchTeam(teamId))
            );

            return {name, teams};
        })
    );

    const groupsByName = new Map(
        loadedGroups.map(group => [group.name, group])
    );

    const thirdPlaceTeams = await Promise.all(
        predictions.thirdPlaceRanking.map(groupName => {
            const group = groupsByName.get(groupName);

            if (!group) throw new Error(`Missing loaded group: ${groupName}`);

            // return the 3rd place team in that group
            return group.teams[2];
        })
    );

    return {
        name,
        data: {
            groups: loadedGroups,
            thirdPlaceTeams: thirdPlaceTeams
        }
    };
}

export async function fetchMatches(): Promise<MatchResult[]> {
    const response = await fetch(`${endpoint}/matches`);

    const matches: Match[] = await response.json();

    return Promise.all(matches.map(async match => {
        const [a, b] = match.teamIds;
        return {
            matchNum: match.matchNum,
            group: match.group,
            teams: [await fetchTeam(a), await fetchTeam(b)],
            score: [null, null]
        };
    }));
}

export async function submitMatchPredictions(payload: SubmitMatchPredictionsRequest): Promise<SubmitPredictionResponse> {
    const response = await fetch(`${endpoint}/match-predictions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return response.json();
}

export async function fetchMatchPredictions(id: string): Promise<FetchMatchPredictionResponse> {
    const response = await fetch(`${endpoint}/match-predictions/${id}`);

    if (!response.ok) return {name: null, data: null};

    const json = await response.json();
    const name: string = json.name;
    const predictions: MatchPrediction[] = json.predictions;
    const matches = await fetchMatches();

    // map match number to match object for fast lookup
    const matchMap = new Map<number, MatchResult>(
        matches.map(match => [match.matchNum, match])
    );

    return {
        name,
        data: predictions.map(p => {
            const match = matchMap.get(p.matchNum);

            if (!match) throw new Error(`Predictions missing match ${p.matchNum}`);

            return {
                matchNum: p.matchNum,
                group: match.group,
                teams: match.teams,
                score: p.score
            }
        })
    };
}

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${endpoint}/leaderboard`);

    if (!response.ok) return [];

    return response.json();
}
