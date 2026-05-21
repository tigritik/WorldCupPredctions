export type Team = {
    id: string;
    name: string;
    code: string;
};

export type Group = {
    name: string;
    teamIds: string[];
};

export type LoadedGroup = {
    name: string;
    teams: Team[];
}

export type Match = {
    matchNum: number;
    group: string;
    teamIds: [string, string];
};

export type MatchResult = {
    matchNum: number;
    group: string;
    teams: [Team, Team];
    score: [number|null, number|null];
};

export type TeamStats = {
    team: Team;
    points: number;
    gf: number;
    ga: number;
    gd: number;
    w: number;
    d: number;
    l: number;
};

export type GroupPredictions = {
    groups: Record<string, string[]>;
    thirdPlaceRanking: string[];
};

export type LoadedGroupPredictions = {
    groups: LoadedGroup[];
    thirdPlaceTeams: Team[];
};

export type SubmitGroupPredictionRequest = {
    name: string;
    predictions: GroupPredictions;
};

export type MatchPrediction = {
    matchNum: number;
    score: [number | null, number | null];
};

export type SubmitMatchPredictionsRequest = {
    name: string;
    predictions: MatchPrediction[];
};

export type SubmitPredictionResponse =
    | { ok: true }
    | { ok: false; error: string };
