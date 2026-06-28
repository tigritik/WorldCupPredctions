import type { BracketLeaderboardEntry } from "@shared/types";
import { useNavigate } from "react-router-dom";
import {getFlagUrl} from "@shared/utils.ts";
import type {Team} from "@shared/types.ts";

type CardProps = {
    entry: BracketLeaderboardEntry;
};

type PodiumProps = {
    team: Team;
    place: "1st" | "2nd" | "3rd";
    size?: number;
};

function PodiumTeam({team, place, size=1}: PodiumProps) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 48 * size,
            }}
        >
            <img
                src={getFlagUrl(team.code)}
                alt={team.name}
                style={{
                    width: 28 * size,
                    height: 20 * size,
                    objectFit: "cover",
                    borderRadius: 2,
                }}
            />
            <span
                style={{
                    fontSize: 11 * size,
                    opacity: 0.7,
                    marginTop: 2,
                }}
            >
                {place}
            </span>
        </div>
    );
}

export default function KnockoutLeaderboardCard({ entry }: CardProps) {
    const navigate = useNavigate();
    const shortId = entry.id.split("-")[0];

    return (
        <div
            onClick={() => navigate(`/bracket/${entry.id}`)}
            style={{
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 8,
                cursor: "pointer",
                marginBottom: 8,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <div>
                    <div>
                        <strong>{entry.name}</strong>{" "}
                        <span style={{ opacity: 0.6 }}>
                            ({shortId})
                        </span>
                    </div>

                    <div
                        style={{
                            marginTop: 6,
                            fontSize: 15,
                        }}
                    >
                        {entry.points} / {entry.maxPoints} pts
                    </div>
                </div>

                <div style={{ fontWeight: 600 }}>
                    #{entry.rank}
                </div>
            </div>

            <div
                style={{
                    marginTop: 12,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    gap: 16,
                }}
            >
                <PodiumTeam team={entry.second} place="2nd" />

                <div style={{ marginBottom: 10 }}>
                    <PodiumTeam team={entry.first} place="1st" size={2} />
                </div>

                <PodiumTeam team={entry.third} place="3rd" />
            </div>
        </div>
    );
}