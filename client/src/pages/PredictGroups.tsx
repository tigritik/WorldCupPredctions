import {useEffect, useState} from "react";
import {type DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors} from "@dnd-kit/core";
import {arrayMove} from "@dnd-kit/sortable";
import type {GroupPredictions, LoadedGroup, SubmitGroupPredictionRequest} from "@shared/types.ts";
import {fetchGroups, submitGroupPredictions} from "../api_helpers.ts";
import {useNavigate} from "react-router-dom";
import {DraggableTable} from "../components/GroupStageTable.tsx";

export default function PredictGroups() {
    const [groups, setGroups] = useState<LoadedGroup[]>([]);
    const [name, setName] = useState("");
    const [thirdPlaceRanking, setThirdPlaceRanking] = useState<string[]>([]);

    useEffect(() => {
        console.log("fetching groups")
        fetchGroups().then(groups => {
            setGroups(groups);
            setThirdPlaceRanking(groups.map(group => group.name));
        });
    }, []);

    const rankedThirdPlaceTeams = thirdPlaceRanking
        .map(groupName =>
            groups.find(g => g.name === groupName)?.teams[2]
        )
        .filter(team => team !== undefined);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 25,
                tolerance: 8
            }
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

    function handleThirdPlaceDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        // active id and over id are team ids like A2 or B3
        // we need to extract the group name from the id
        const groupActiveTeamIsFrom = (active.id as string)[0];
        const groupOverTeamIsFrom = (over.id as string)[0];

        setThirdPlaceRanking(prev => {
            const oldIndex = prev.indexOf(groupActiveTeamIsFrom);
            const newIndex = prev.indexOf(groupOverTeamIsFrom);

            return arrayMove(prev, oldIndex, newIndex);
        });
    }

    function buildPredictionPayload(): GroupPredictions {
        return {
            groups: Object.fromEntries(
                groups.map((group) => [
                    group.name,
                    group.teams.map((team) => team.id),
                ])
            ),
            thirdPlaceRanking: thirdPlaceRanking
        };
    }

    const navigate = useNavigate();

    async function handleSubmitPredictions() {
        if (name === "") {
            alert("Name is required!");
            return;
        }

        const payload: SubmitGroupPredictionRequest = {
            name,
            predictions: buildPredictionPayload(),
        };

        console.log("Submitting predictions:");
        console.log(payload);

        const result = await submitGroupPredictions(payload);

        if (result.ok) {
            navigate(`/predictions/${result.id}`);
        } else {
            alert(result.error);
        }
    }

    return (
        <div style={{ display: "grid", gap: "2rem" }}>
            {groups.map((group) => (
                <div style={{padding: "0px 24px"}} key={group.name}>
                    <h2>Group {group.name}</h2>
                    <DraggableTable
                        group={group}
                        sensors={sensors}
                        handleDragEnd={handleDragEnd}
                    />
                </div>
            ))}
            {thirdPlaceRanking.length > 0 && (
                <div style={{padding: "0px 24px"}}>
                    <h2>Third Place Team Rankings</h2>
                    <DraggableTable
                        group={{
                            name: "Third Place",
                            teams: rankedThirdPlaceTeams,
                        }}
                        sensors={sensors}
                        handleDragEnd={handleThirdPlaceDragEnd}
                    />
                </div>
            )}
            {groups.length > 0 ? <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your prediction name"
                style={{
                    padding: "12px",
                    borderRadius: 8,
                    border: "1px solid #d1d5db",
                    width: 320,
                    marginTop: 24,
                    marginBottom: 16,
                    fontSize: 16,
                }}
            /> : <></>}
            {groups.length > 0 ? <button
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
            </button> : <></>}
        </div>
    );
}
