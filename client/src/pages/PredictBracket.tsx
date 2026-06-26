import {useCallback, useState} from "react";
import {Bracket} from "../components/Bracket.tsx";
import type {BracketPrediction} from "@shared/types";
import {submitBracketPredictions} from "../api_helpers.ts";
import {useNavigate} from "react-router-dom";

export default function PredictBracket() {
    const [name, setName] = useState<string>("");
    const [predictions, setPredictions] = useState<BracketPrediction[]>([]);

    const onChange = useCallback(
        (preds: BracketPrediction[]) => setPredictions(preds), []
    );

    const navigate = useNavigate();

    async function handleSubmit() {
        const payload = {predictions, name};
        const result = await submitBracketPredictions(payload);

        if (result.ok) {
            navigate(`/bracket/${result.id}`);
        } else {
            alert(result.error);
        }
    }

    return (
        <div className="predict-page">
            <div className="hero">
                <h1>Predict Bracket</h1>
                <p>
                    Select a winner in every match to predict the champion.
                </p>
            </div>

            <div className="top-bar">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Bracket name"
                    className="name-input"
                />

                <button onClick={handleSubmit} className="submit-button">
                    Submit Bracket
                </button>
            </div>

            <div>
                <Bracket editable={true} onChange={onChange} />
            </div>
        </div>
    );
}