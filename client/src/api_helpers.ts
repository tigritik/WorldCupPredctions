import type {
    Group,
    GroupPredictions,
    LoadedGroup,
    SubmitGroupPredictionRequest,
    SubmitPredictionResponse,
    Team
} from "@shared/types.ts";

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
    const response = await fetch(`${endpoint}/predictions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return response.json();
}

export async function fetchGroupPredictions(name: string): Promise<LoadedGroup[]> {
    const response = await fetch(`${endpoint}/predictions/${name}`);

    if (!response.ok) return [];

    const predictions: GroupPredictions = (await response.json()).predictions;

    return Promise.all(
        Object.entries(predictions).map(async ([name, teamIds]) => {
            const teams = await Promise.all(
                teamIds.map(teamId => fetchTeam(teamId))
            );

            return {name, teams};
        })
    );
}
