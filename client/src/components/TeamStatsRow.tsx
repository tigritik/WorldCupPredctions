import {getFlagUrl} from "@shared/utils.ts";
import type {TeamStats} from "@shared/types.ts";

type RowProps = {
    stats: TeamStats,
    i: number;
}

export default function TeamStatsRow ({stats, i}: RowProps) {
    return (
        <tr className="group-row">
            <td className="position-cell">{i + 1}</td>
            <td className="team-cell">
                <img
                    src={getFlagUrl(stats.team.code)}
                    alt={stats.team.name} width={20}
                />{" "}
                {stats.team.name}
            </td>
            <td>{stats.points}</td>
            <td>{stats.w}</td>
            <td>{stats.d}</td>
            <td>{stats.l}</td>
            <td>{stats.gf}</td>
            <td>{stats.ga}</td>
            <td>{stats.gd}</td>
            <td>{stats.points}</td>
        </tr>
    );
}
