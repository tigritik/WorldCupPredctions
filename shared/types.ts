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

export type KnockoutMatch = {
    matchNum: number;
    homeRef: string;
    awayRef: string;
    teamIds: [string|null, string|null];
    pointValue: number;
    winnerId: string | null;
};

export type KnockoutMatchResult = {
    matchNum: number;
    homeRef: string;
    awayRef: string;
    teams: [Team|null, Team|null];
    pointValue: number;
    winner: Team | null;
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

export type FetchGroupPredictionResponse = {
    name: string | null;
    data: LoadedGroupPredictions | null;
}

export type MatchPrediction = {
    matchNum: number;
    score: [number | null, number | null];
};

export type SubmitMatchPredictionsRequest = {
    id?: string;
    name: string;
    predictions: MatchPrediction[];
};

export type FetchMatchPredictionResponse = {
    name: string | null;
    data: MatchResult[] | null;
}

export type BracketPrediction = {
    matchNum: number;
    winnerTeamId: string | null;
};

export type SubmitBracketPredictionsRequest = {
    name: string;
    predictions: BracketPrediction[];
};

export type FetchBracketResponse = {
    name: string | null;
    data: KnockoutMatchResult[] | null;
}

export type SubmitPredictionResponse =
    | { ok: true; id: string }
    | { ok: false; error: string };

export type LeaderboardEntry = {
    id: string;
    name: string;
    rank: number;
    points: number;
    maxPoints: number;
};

export type BracketLeaderboardEntry = LeaderboardEntry & {
    first: Team;
    second: Team;
    third: Team;
}

export type MatchViewResponse = {
    matchNum: number;
    group: string;

    actualScore: [number | null, number | null];
    predictedScore: [number | null, number | null];

    homeTeam: {
        id: string;
        name: string;
        code: string;
    };

    awayTeam: {
        id: string;
        name: string;
        code: string;
    };
};
