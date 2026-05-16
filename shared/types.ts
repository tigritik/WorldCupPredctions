export type Team = {
    id: string;
    name: string;
    code: string;
};

export type Group = {
    name: string;
    teams: Team[];
};
