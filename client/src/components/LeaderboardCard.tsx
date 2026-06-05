import type { LeaderboardEntry } from "@shared/types";
import { useNavigate } from "react-router-dom";

type Props = {
    entry: LeaderboardEntry;
};

export default function LeaderboardCard({ entry }: Props) {
    const navigate = useNavigate();
    const shortId = entry.id.split("-")[0];

    return (
        <div
            onClick={() => navigate(`/match-predictions/${entry.id}`)}
            style={{
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                cursor: "pointer",
                marginBottom: "8px",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <strong>{entry.name}</strong>{" "}
                    <span style={{ opacity: 0.6 }}>
                        ({shortId})
                    </span>
                </div>

                <div>
                    #{entry.rank}
                </div>
            </div>

            <div style={{ marginTop: "6px" }}>
                {entry.points} / {entry.maxPoints} pts
            </div>
        </div>
    );
}
