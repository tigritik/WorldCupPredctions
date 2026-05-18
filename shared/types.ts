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

export type SubmitPredictionResponse =
    | { ok: true }
    | { ok: false; error: string };
