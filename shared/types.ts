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

export type GroupPredictions = Record<string, string[]>;

export type SubmitGroupPredictionRequest = {
    name: string;
    predictions: GroupPredictions;
};

export type SubmitPredictionResponse =
    | { ok: true }
    | { ok: false; error: string };
