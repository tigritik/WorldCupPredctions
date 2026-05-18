import {closestCenter, DndContext, type DragEndEvent, type SensorDescriptor, type SensorOptions} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import SortableTeamRow from "./SortableTeamRow.tsx";
import type {LoadedGroup} from "@shared/types.ts";
import StaticTeamRow from "./StaticTeamRow.tsx";

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
