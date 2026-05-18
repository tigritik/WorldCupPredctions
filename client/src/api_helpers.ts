import type {
    Group,
    GroupPredictions,
    LoadedGroup, LoadedGroupPredictions,
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

export async function fetchGroupPredictions(name: string): Promise<LoadedGroupPredictions | null> {
    const response = await fetch(`${endpoint}/predictions/${name}`);

    if (!response.ok) return null;

    const predictions: GroupPredictions = (await response.json()).predictions;

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
        groups: loadedGroups,
        thirdPlaceTeams: thirdPlaceTeams
    }
}
