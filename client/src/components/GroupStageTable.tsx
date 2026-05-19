import {closestCenter, DndContext, type DragEndEvent, type SensorDescriptor, type SensorOptions} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import SortableTeamRow from "./SortableTeamRow.tsx";
import type {LoadedGroup, MatchResult, Team, TeamStats} from "@shared/types.ts";
import StaticTeamRow from "./StaticTeamRow.tsx";
import { useMemo } from "react";
import TeamStatsRow from "./TeamStatsRow.tsx";
import {rankTeams} from "@shared/utils.ts";

export function MatchResultTable({matches}: {matches: MatchResult[]}) {
    const standings = useMemo(() => {
        const groupMatches = matches
            .filter(m => m.score[0] != null && m.score[1] != null);

        const statsMap = new Map<string, TeamStats>();

        const getOrInit = (team: Team) => {
            if (!statsMap.has(team.id)) {
                statsMap.set(team.id, {
                    team,
                    points: 0,
                    gf: 0, ga: 0, gd: 0,
                    w: 0, d: 0, l: 0
                });
            }
            return statsMap.get(team.id)!;
        };

        // Initialize stats for every team (include those with null matches)
        matches.forEach(m => {
            getOrInit(m.teams[0]);
            getOrInit(m.teams[1]);
        });

        // Build base stats
        for (const m of groupMatches) {
            const [a, b] = m.teams;
            const [sa, sb] = m.score;

            if (sa === null || sb === null) continue;

            const A = getOrInit(a);
            const B = getOrInit(b);

            A.gf += sa;
            A.ga += sb;
            B.gf += sb;
            B.ga += sa;

            if (sa > sb) {
                A.points += 3;
                A.w++; B.l++;
            }
            else if (sb > sa) {
                B.points += 3;
                A.l++; B.w++;
            }
            else {
                A.points += 1;
                B.points += 1;
                A.d++; B.d++;
            }
        }

        for (const s of statsMap.values()) {
            s.gd = s.gf - s.ga;
        }

        const all = Array.from(statsMap.values());

        return rankTeams(all, groupMatches);
    }, [matches]);

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
