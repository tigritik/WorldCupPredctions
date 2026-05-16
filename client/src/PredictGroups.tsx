import { groups as initialGroups } from "./data/groups";
import { useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTeamRow from "./components/SortableTeamRow.tsx";

export default function GroupStageTable() {
    const [groups, setGroups] = useState(initialGroups);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    function handleDragEnd(event: DragEndEvent, groupName: string) {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        setGroups((prev) =>
            prev.map((group) => {
                if (group.name !== groupName) return group;

                const oldIndex = group.teams.findIndex((t) => t.id === active.id);
                const newIndex = group.teams.findIndex((t) => t.id === over.id);

                return {
                    ...group,
                    teams: arrayMove(group.teams, oldIndex, newIndex),
                };
            })
        );
    }

    function buildPredictionPayload() {
        return {
            predictions: Object.fromEntries(
                groups.map((group) => [
                    group.name,
                    group.teams.map((team) => team.id),
                ])
            ),
        };
    }

    function handleSubmitPredictions() {
        const payload = buildPredictionPayload();

        console.log("Submitting predictions:");
        console.log(payload);
    }

    return (
        <div style={{ display: "grid", gap: "2rem" }}>
            {groups.map((group) => (
                <div key={group.name}>
                    <h2>Group {group.name}</h2>

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
                </div>
            ))}
            <button
                onClick={handleSubmitPredictions}
                style={{
                    marginTop: 24,
                    padding: "12px 20px",
                    borderRadius: 8,
                    border: "none",
                    background: "#111827",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                }}
            >
                Submit Predictions
            </button>
        </div>
    );
}
