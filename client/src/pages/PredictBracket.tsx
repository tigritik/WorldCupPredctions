import {useEffect, useState} from "react";
import {Bracket} from "../components/Bracket.tsx";
import {fetchKnockoutMatches, submitBracketPredictions} from "../api_helpers.ts";
import {useNavigate} from "react-router-dom";
import type {KnockoutMatchResult} from "@shared/types.ts";
import {buildInitialBracket, matchesToPredictions} from "@shared/bracket.ts";
import "./predict-bracket.css";

export default function PredictBracket() {
    const [name, setName] = useState<string>("");
    const [bracket, setBracket] = useState<KnockoutMatchResult[]>([]);
    const [loading, setLoading] = useState(true);

    // load bracket
    useEffect(() => {
        fetchKnockoutMatches().then(
            data => setBracket(buildInitialBracket(data, true))
        ).finally(() => setLoading(false));
    }, [loading]);

    const navigate = useNavigate();

    async function handleSubmit() {
        const predictions = matchesToPredictions(bracket);
        const payload = {predictions, name};
        const result = await submitBracketPredictions(payload);

        if (result.ok) {
            navigate(`/bracket/${result.id}`);
        } else {
            alert(result.error);
        }
    }

    return (
        <div className="bracket-predict-page">
            <div className="bracket-hero">
                <h1>Predict Bracket</h1>
                <p>
                    Select a winner in every match to predict the champion.
                </p>
            </div>

            <div className="bracket-top-bar">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bracket name"
                    className="bracket-name-input"
                />

                <button onClick={handleSubmit} className="bracket-submit-button">
                    Submit Bracket
                </button>
            </div>

            <div>
                {
                    loading ?
                    <div className="bracket-loading">Loading bracket...</div> :
                    <Bracket editable={true} matches={bracket} setMatches={setBracket} />
                }
            </div>
        </div>
    );
}
