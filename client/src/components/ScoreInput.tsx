import type {Team} from "@shared/types.ts";
import {getFlagUrl} from "@shared/utils.ts";
import type {Ref} from "react";

type ScoreInputProps = {
    team: Team;
    value: number | null;
    onChange: (value: string) => void;
    showError: boolean;
    inputRef?: Ref<HTMLInputElement>;
};

export default function ScoreInput(props: ScoreInputProps) {
    const {team, value, onChange, showError, inputRef} = props;
    return (
        <div className="team-input">
            <div className="team-info">
                <img
                    src={getFlagUrl(team.code)}
                    alt={`${team.name} flag`}
                    className="team-flag"
                />
                <span className="team-name">{team.name}</span>
            </div>

            <input
                ref={inputRef}
                type="number"
                min={0}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className={`score-input ${showError ? "score-input-error" : ""}`}
            />
        </div>
    );
}
