import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";

import {StaticTable} from "../components/GroupStageTable";
import type {LoadedGroup, Team} from "@shared/types.ts";
import {fetchGroupPredictions} from "../api_helpers.ts";

import "./display-predictions.css"

export default function DisplayPredictions() {
    const { id } = useParams<{id: string}>();
    const [name, setName] = useState("");
    const [groups, setGroups] = useState<LoadedGroup[]>([]);
    const [thirdPlaceTeams, setThirdPlaceTeams] = useState<Team[]>([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        console.log("fetching groups")
        if (!id) {
            navigate("/");
            return;
        }
        fetchGroupPredictions(id).then(({name, data}) => {
            if (!data || data.groups.length === 0 || !name) {
                navigate("/");
                return;
            }
            setGroups(data.groups);
            setThirdPlaceTeams(data.thirdPlaceTeams);
            setName(name);
        });
    }, [id, navigate]);

    return (
        <div className="prediction-page">
            <div className="prediction-header">
                {name && <h1>{name}'s Predictions</h1>}

                <p>
                    Predicted World Cup group standings
                </p>
            </div>

            <div className="groups-grid">
                {groups.map((group) => (
                    <div key={group.name}>
                        <h2>Group {group.name}</h2>
                        <StaticTable group={group} />
                    </div>
                ))}
            </div>
            {thirdPlaceTeams.length > 0 && (
                <div style={{ marginTop: "3rem" }}>
                    <h2>Third Place Team Rankings</h2>
                    <StaticTable
                        group={{
                            name: "Third Place",
                            teams: thirdPlaceTeams,
                        }}
                    />
                </div>
            )}
        </div>
    );
}
