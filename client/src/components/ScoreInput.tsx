import type {Team} from "@shared/types.ts";
import {getFlagUrl} from "@shared/utils.ts";

type ScoreInputProps = {
    team: Team;
    value: number | null;
    onChange: (value: string) => void;
};

export default function ScoreInput({team, value, onChange}: ScoreInputProps) {
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
                type="number"
                min={0}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="score-input"
            />
        </div>
    );
}
