import {closestCenter, DndContext, type DragEndEvent, type SensorDescriptor, type SensorOptions} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import SortableTeamRow from "./SortableTeamRow.tsx";
import type {LoadedGroup, MatchResult, Team} from "@shared/types.ts";
import StaticTeamRow from "./StaticTeamRow.tsx";
import { useMemo } from "react";
import TeamStatsRow from "./TeamStatsRow.tsx";
import {rankTeams, buildTable} from "@shared/utils.ts";

export function ThirdPlaceTableFromMatches({matches}: {matches: MatchResult[]}) {
    const groupedMatches = matches.reduce<Record<string, MatchResult[]>>((acc, match) => {
        if (!acc[match.group]) acc[match.group] = [];

        acc[match.group].push(match);

        return acc;
    }, {});

    const teams = Object.keys(groupedMatches).map(groupName => {
            // code borrowed from the Group Table
            const playedMatches = matches.filter(
                m => m.score[0] != null && m.score[1] != null
            );

            const teams = Array.from(
                new Map(
                    matches
                        .filter(result => result.group === groupName)
                        .flatMap(m => m.teams.map(t => [t.id, t]))
                ).values()
            );

            const table = buildTable(teams, playedMatches);

            // extract the 3rd place team from the group
            return rankTeams(Array.from(table.values()), playedMatches)[2].team;
        });

    return <MatchResultTable matches={matches} teams={teams} />
}

type MatchResultTableProps = {
    matches: MatchResult[];
    teams?: Team[]; // optionally specify teams
};

export function MatchResultTable(props: MatchResultTableProps) {
    const matches = props.matches;

    const standings = useMemo(() => {
        // consider only matches that have been played
        const playedMatches = matches.filter(
            m => m.score[0] != null && m.score[1] != null
        );

        // extract teams from match array (and remove duplicates with map)
        const teams = props.teams || Array.from(
            new Map(
                matches.flatMap(m =>
                    m.teams.map(t => [t.id, t])
                )
            ).values()
        );

        // construct an overall stats table for every match played
        const table = buildTable(teams, playedMatches);

        // use helper function to properly order all teams
        return rankTeams(
            Array.from(table.values()),
            playedMatches
        );
    }, [matches, props.teams]);

    return (
        <table border={1} cellPadding={8}>
            <thead>
            <tr>
                <th>#</th>
                <th>Team</th>
                <th>P</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>GD</th>
                <th>Pts</th>
            </tr>
            </thead>
            <tbody>
                {standings.map((s, i) => (
                    <TeamStatsRow key={s.team.id} stats={s} i={i} />
                ))}
            </tbody>
        </table>
    );
}

export function StaticTable({group}: {group: LoadedGroup}) {
    return (
        <table border={1} cellPadding={8}>
            <thead>
                <tr>
                    <th>Position</th>
                    <th>Team</th>
                </tr>
            </thead>
            <tbody>
                {group.teams.map((team, index) => (
                    <StaticTeamRow key={team.id} team={team} index={index} />
                ))}
            </tbody>
        </table>
    );
}

type DraggableTableProps = {
    group: LoadedGroup;
    sensors: SensorDescriptor<SensorOptions>[];
    handleDragEnd: (event: DragEndEvent, groupName: string) => void;
};

export function DraggableTable({group, sensors, handleDragEnd}: DraggableTableProps) {
    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => handleDragEnd(event, group.name)}
        >
            <table border={1} cellPadding={8}>
                <thead>
                <tr>
                    <th>Position</th>
                    <th>Team</th>
                </tr>
                </thead>

                <SortableContext
                    items={group.teams.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <tbody>
                    {group.teams.map((team, index) => (
                        <SortableTeamRow
                            key={team.id}
                            team={team}
                            index={index}
                        />
                    ))}
                    </tbody>
                </SortableContext>
            </table>
        </DndContext>
    );
}
