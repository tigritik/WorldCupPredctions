import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";

import {StaticTable} from "../components/GroupStageTable";
import type {LoadedGroup} from "@shared/types.ts";
import {fetchGroupPredictions} from "../api_helpers.ts";

import "./display-predictions.css"

export default function DisplayPredictions() {
    const { name } = useParams<{name: string}>();
    const [groups, setGroups] = useState<LoadedGroup[]>([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        console.log("fetching groups")
        if (!name) {
            navigate("/");
            return;
        }
        fetchGroupPredictions(name).then(groups => {
            if (!groups || groups.length === 0) {
                navigate("/");
                return;
            }
            setGroups(groups)
        });
    }, [name, navigate]);

    return (
        <div className="prediction-page">
            <div className="prediction-header">
                <h1>{name}'s Predictions</h1>

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
        </div>
    );
}
