import type {Team} from "@shared/types.ts";
import {getFlagUrl} from "@shared/utils.ts";

type TeamRow = {
    team: Team;
    index: number;
};

export default function StaticTeamRow({ team, index }: TeamRow) {
    return (
        <tr className="group-row">
            <td className="position-cell">
                {index + 1}
            </td>

            <td className="team-cell">
                <img
                    src={getFlagUrl(team.code)}
                    alt={team.name}
                    className="flag"
                />

                <span>{team.name}</span>
            </td>
        </tr>
    );
}
