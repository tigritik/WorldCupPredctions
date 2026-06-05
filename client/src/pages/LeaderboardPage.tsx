import { useEffect, useState } from "react";
import type {LeaderboardEntry} from "@shared/types";
import LeaderboardCard from "../components/LeaderboardCard.tsx";
import {fetchLeaderboard} from "../api_helpers.ts";

export default function LeaderboardPage() {
    const [data, setData] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        fetchLeaderboard()
            .then(d => setData([...d,
            {
                id: "106c7899-879a-49e2-89e1-0c0b9dd8a98b",
                name: "test",
                rank: 1,
                points: 11,
                maxPoints: 100,
            },
            {
                id: "106c7899-879a-49e2-89e1-0c0b9dd8a98b",
                name: "test",
                rank: 2,
                points: 7,
                maxPoints: 100,
            },
            {
            id: "106c7899-879a-49e2-89e1-0c0b9dd8a98b",
                name: "test",
                rank: 3,
                points: 5,
                maxPoints: 100,
            }
        ]));
    }, []);

    return (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h1>Leaderboard</h1>

            {data.map(entry => (
                <LeaderboardCard
                    key={entry.id}
                    entry={entry}
                />
            ))}
        </div>
    );
}
