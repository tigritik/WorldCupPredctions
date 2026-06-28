import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import type {KnockoutMatchResult} from "@shared/types.ts";
import {fetchBracket} from "../api_helpers.ts";
import {Bracket} from "../components/Bracket.tsx";
import {buildInitialBracket} from "@shared/bracket.ts";

export default function DisplayBracket() {
    const { id } = useParams<{id: string}>();
    const [name, setName] = useState("");
    const [bracket, setBracket] = useState<KnockoutMatchResult[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("fetching bracket...")
        if (!id) {
            navigate("/");
            return;
        }
        fetchBracket(id).then(({name, data}) => {
            if (!data || data.length === 0 || !name) {
                navigate("/");
                return;
            }
            setName(name);
            setBracket(buildInitialBracket(data, false));
        });
    }, [id, navigate]);

    return (
        <div className="prediction-page">
            <div className="prediction-header">
                {name && <h1>{name}'s Bracket</h1>}
            </div>

            <div className="predicted-matches">
                <Bracket editable={false} matches={bracket} setMatches={setBracket} />
            </div>
        </div>
    );
}
