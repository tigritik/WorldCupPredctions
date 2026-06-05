import { useEffect, useState } from "react";
import type {LeaderboardEntry} from "@shared/types";
import LeaderboardCard from "../components/LeaderboardCard.tsx";
import {fetchLeaderboard} from "../api_helpers.ts";

export default function LeaderboardPage() {
    const [data, setData] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        fetchLeaderboard().then(setData);
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
