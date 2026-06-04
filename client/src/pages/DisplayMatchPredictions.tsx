import {useNavigate, useParams} from "react-router-dom";
import type {MatchResult} from "@shared/types.ts";
import {useEffect, useState} from "react";
import {fetchMatchPredictions} from "../api_helpers.ts";
import {MatchResultTable, ThirdPlaceTableFromMatches} from "../components/GroupStageTable.tsx";
import "./display-predictions.css";
import PredictedMatchCard from "../components/PredictedMatchCard.tsx";

export default function DisplayMatchPredictions() {
    const { id } = useParams<{id: string}>();
    const [name, setName] = useState("");
    const [predictedMatches, setPredictedMatches] = useState<MatchResult[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("fetching matches")
        if (!id) {
            navigate("/");
            return;
        }
        fetchMatchPredictions(id).then(({name, data}) => {
            if (!data || data.length === 0 || !name) {
                navigate("/");
                return;
            }
            setName(name);
            setPredictedMatches(data);
        });
    }, [id, navigate]);

    const groupedMatches = predictedMatches.reduce<Record<string, MatchResult[]>>((acc, match) => {
        if (!acc[match.group]) acc[match.group] = [];

        acc[match.group].push(match);

        return acc;
    }, {});

    return (
        <div className="prediction-page">
            <div className="prediction-header">
                {name && <h1>{name}'s Match Predictions</h1>}
            </div>

            {Object.entries(groupedMatches).map(([groupName, groupMatches]) => (
                <section key={groupName}>
                    <h2>Group {groupName}</h2>

                    <MatchResultTable matches={groupMatches} />

                    <div className="predicted-matches">
                        {groupMatches.map((match) => (
                            <PredictedMatchCard
                                key={match.matchNum}
                                match={match}
                            />
                        ))}
                    </div>
                </section>
            ))}

            <section>
                <div >
                    <h3>Third Place Ranking</h3>
                    <ThirdPlaceTableFromMatches matches={predictedMatches} />
                </div>
            </section>
        </div>
    );
}
