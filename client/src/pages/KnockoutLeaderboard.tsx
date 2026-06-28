import type {BracketLeaderboardEntry} from "@shared/types.ts";
import {useEffect, useState} from "react";
import {fetchBracketLeaderboard} from "../api_helpers.ts";
import KnockoutLeaderboardCard from "../components/KnockoutLeaderboardCard.tsx";

export default function KnockoutLeaderboardPage() {
    const [data, setData] = useState<BracketLeaderboardEntry[]>([]);

    useEffect(() => {
        fetchBracketLeaderboard().then(setData);
    }, []);

    return (
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h1>Leaderboard</h1>

            {data.map(entry => (
                <KnockoutLeaderboardCard
                    key={entry.id}
                    entry={entry}
                />
            ))}
        </div>
    );
}
