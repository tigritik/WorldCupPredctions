import express, { Request, Response, Application } from 'express';
import {LeaderboardEntry, SubmitGroupPredictionRequest, SubmitMatchPredictionsRequest} from "@shared/types";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";
import {calculatePoints} from "@shared/utils";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to allow cors for the frontend
app.use(cors({
    origin: process.env.FRONTEND_URL
}));

app.get("/groups", async (_: Request, res: Response) => {
    const result = await pool.query(`
        SELECT
            g.name,
            ARRAY_AGG(t.id ORDER BY t.id) AS team_ids
        FROM groups g
        JOIN teams t
            ON t.group_id = g.id
        GROUP BY g.id, g.name
        ORDER BY g.name
    `);

    const groups = result.rows.map(row => ({
        name: row.name,
        teamIds: row.team_ids,
    }));

    res.json(groups);
});

app.get("/teams/:id", async (req: Request<{id: string}>, res: Response) => {
    const result = await pool.query(`
        SELECT
            id,
            name,
            code
        FROM teams
        WHERE id = $1
    `, [req.params.id]);

    if (result.rowCount === 0) {
        return res.status(404).json({
            error: "Team not found",
        });
    }

    res.json(result.rows[0]);
});

app.post("/group-predictions", async (req, res) => {
    const body = req.body as SubmitGroupPredictionRequest;
    if (body.name === "") return res.status(400).json({error: "Invalid Name!"});
    if (body.name.length > 100)
        return res.status(400).json({error: "Name too long!"});

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const predictionSetResult = await client.query(`
            INSERT INTO group_prediction_sets(name)
            VALUES ($1)
            RETURNING id
        `, [body.name]);

        const predictionSetId = predictionSetResult.rows[0].id;

        // Load all groups once
        const groupsResult = await client.query(`
            SELECT id, name
            FROM groups
        `);

        const groupIdMap = new Map<string, number>();

        for (const row of groupsResult.rows) {
            groupIdMap.set(row.name, row.id);
        }

        // Build all group prediction rows
        const groupValues: unknown[] = [];
        const groupPlaceholders: string[] = [];

        let paramIndex = 1;

        for (const [groupName, teamIds] of Object.entries(body.predictions.groups)) {
            const groupId = groupIdMap.get(groupName);

            if (!groupId) {
                await client.query("ROLLBACK");
                return res.status(400).json({
                    ok: false,
                    error: `Unknown group ${groupName}`
                });
            }

            teamIds.forEach((teamId, index) => {
                groupPlaceholders.push(
                    `($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`
                );

                groupValues.push(
                    predictionSetId,
                    groupId,
                    index + 1,
                    teamId
                );

                paramIndex += 4;
            });
        }

        await client.query(`
            INSERT INTO group_predictions (
                prediction_set_id,
                group_id,
                position,
                team_id
            )
            VALUES ${groupPlaceholders.join(",")}
        `, groupValues);

        // Build all third-place rows
        const thirdPlaceValues: unknown[] = [];
        const thirdPlacePlaceholders: string[] = [];

        paramIndex = 1;

        body.predictions.thirdPlaceRanking.forEach(
            (groupName, index) => {
                thirdPlacePlaceholders.push(
                    `($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2})`
                );

                const groupId = groupIdMap.get(groupName);

                if (!groupId) {
                    throw new Error(`Unknown group ${groupName}`);
                }

                thirdPlaceValues.push(
                    predictionSetId,
                    index + 1,
                    groupId
                );

                paramIndex += 3;
            }
        );

        await client.query(`
            INSERT INTO third_place_predictions (
                prediction_set_id,
                ranking_position,
                group_id
            )
            VALUES ${thirdPlacePlaceholders.join(",")}
        `, thirdPlaceValues);

        await client.query("COMMIT");

        return res.json({
            ok: true,
            id: predictionSetId,
        });
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
});

app.get("/group-predictions/:id", async (req: Request<{ id: string }>, res) => {
    const predictionSetResult = await pool.query(`
        SELECT name
        FROM group_prediction_sets
        WHERE id = $1
    `, [req.params.id]);

    const groupsResult = await pool.query(`
        SELECT
            g.name,
            gp.position,
            gp.team_id
        FROM group_predictions gp
        JOIN groups g
            ON g.id = gp.group_id
        WHERE gp.prediction_set_id = $1
        ORDER BY g.name, gp.position
    `, [req.params.id]);

    if (groupsResult.rowCount === 0) {
        return res.status(404).json({
            error: "Prediction not found",
        });
    }

    const groups: Record<string, string[]> = {};

    for (const row of groupsResult.rows) {
        if (!groups[row.name]) {
            groups[row.name] = [];
        }

        groups[row.name].push(row.team_id);
    }

    const thirdPlaceResult = await pool.query(`
        SELECT g.name
        FROM third_place_predictions tpp
        JOIN groups g
            ON g.id = tpp.group_id
        WHERE tpp.prediction_set_id = $1
        ORDER BY tpp.ranking_position
    `, [req.params.id]);

    return res.json({
        id: req.params.id,
        name: predictionSetResult.rows[0].name,
        predictions: {
            groups,
            thirdPlaceRanking: thirdPlaceResult.rows.map(
                row => row.name
            )
        },
    });
});

app.get("/matches", async (_: Request, res: Response) => {
    const result = await pool.query(`
        SELECT
            m.match_num AS "matchNum",
            g.name AS "group",
            ARRAY[m.home_team_id, m.away_team_id] AS "teamIds"
        FROM matches m
        JOIN groups g
            ON g.id = m.group_id
        ORDER BY g.name, m.match_num
    `);

    res.json(result.rows);
});

app.post("/match-predictions", async (req, res) => {
    const body = req.body as SubmitMatchPredictionsRequest;
    if (body.name === "") return res.status(400).json({error: "Invalid Name!"});
    if (body.name.length > 100)
        return res.status(400).json({error: "Name too long!"});

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const predictionSetResult = await client.query(`
            INSERT INTO match_prediction_sets(name)
            VALUES ($1)
            RETURNING id
        `, [body.name]);

        const predictionSetId = predictionSetResult.rows[0].id;

        const values: unknown[] = [];
        const placeholders: string[] = [];

        let paramIndex = 1;

        for (const prediction of body.predictions) {
            placeholders.push(
                `($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`
            );

            values.push(
                predictionSetId,
                prediction.matchNum,
                prediction.score[0],
                prediction.score[1]
            );

            paramIndex += 4;
        }

        await client.query(`
            INSERT INTO match_predictions (
                prediction_set_id,
                match_num,
                home_score,
                away_score
            )
            VALUES ${placeholders.join(",")}
        `, values);

        await client.query("COMMIT");

        return res.json({
            ok: true,
            id: predictionSetId,
        });
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
});

app.get("/match-predictions/:id", async (req: Request<{ id: string }>, res) => {
    const result = await pool.query(`
        SELECT
            s.name,
            p.match_num,
            p.home_score,
            p.away_score
        FROM match_prediction_sets s
        JOIN match_predictions p
            ON p.prediction_set_id = s.id
        JOIN matches m
             ON m.match_num = p.match_num
        JOIN groups g
             ON g.id = m.group_id
        WHERE s.id = $1
        ORDER BY g.name, p.match_num
    `, [req.params.id]);

    if (result.rowCount === 0) {
        return res.status(404).json({
            error: "Prediction not found",
        });
    }

    const name = result.rows[0].name;

    return res.json({
        id: req.params.id,
        name,
        predictions: result.rows.map(row => ({
            matchNum: row.match_num,
            score: [
                row.home_score,
                row.away_score,
            ] as [number | null, number | null],
        })),
    });
});

app.get("/match-predictions/:id/viewMatch/:matchNum", async (req, res) => {
    const { id, matchNum } = req.params;

    const result = await pool.query(`
        SELECT
            m.match_num,
            g.name AS group_name,
            m.home_score AS actual_home,
            m.away_score AS actual_away,
            p.home_score AS predicted_home,
            p.away_score AS predicted_away,
            ht.id AS home_id,
            ht.name AS home_name,
            ht.code AS home_code,
            at.id AS away_id,
            at.name AS away_name,
            at.code AS away_code
        FROM match_predictions p
        JOIN matches m
            ON m.match_num = p.match_num
        JOIN groups g
            ON g.id = m.group_id
        JOIN teams ht
            ON ht.id = m.home_team_id
        JOIN teams at
            ON at.id = m.away_team_id
        WHERE p.prediction_set_id = $1 AND p.match_num = $2
    `, [id, matchNum]);

    if (result.rowCount === 0) {
        return res.status(404).json({
            error: "Match not found",
        });
    }

    const row = result.rows[0];

    res.json({
        matchNum: row.match_num,
        group: row.group_name,

        actualScore: [
            row.actual_home,
            row.actual_away,
        ],

        predictedScore: [
            row.predicted_home,
            row.predicted_away,
        ],

        homeTeam: {
            id: row.home_id,
            name: row.home_name,
            code: row.home_code,
        },

        awayTeam: {
            id: row.away_id,
            name: row.away_name,
            code: row.away_code,
        },
    });
});

app.get("/leaderboard", async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        // 1. get all matches with results
        const matchesResult = await client.query(`
            SELECT
                match_num,
                home_score,
                away_score
            FROM matches
        `);

        const matchResults = new Map<number, { home: number; away: number; }>();

        for (const row of matchesResult.rows) {
            if (row.home_score === null || row.away_score === null) continue;

            matchResults.set(row.match_num, {
                home: row.home_score,
                away: row.away_score,
            });
        }

        // 2. get all prediction sets
        const setsResult = await client.query(`
            SELECT id, name
            FROM match_prediction_sets
        `);

        const leaderboard: LeaderboardEntry[] = [];

        for (const set of setsResult.rows) {
            const predictions = await client.query(
                `
                SELECT match_num, home_score, away_score
                FROM match_predictions
                WHERE prediction_set_id = $1
            `, [set.id]);

            let points = 0;
            let maxPoints = 0;

            for (const pred of predictions.rows) {
                const actual = matchResults.get(pred.match_num);

                if (!actual) continue;

                maxPoints += 3;

                points += calculatePoints(
                    pred.home_score,
                    pred.away_score,
                    actual.home,
                    actual.away
                );
            }

            leaderboard.push({
                id: set.id,
                name: set.name,
                points,
                maxPoints,
                rank: 0, // filled later
            });
        }

        // 3. sort + rank
        leaderboard.sort((a, b) => b.points - a.points);

        leaderboard.forEach((entry, i) => {
            entry.rank = i + 1;
        });

        res.json(leaderboard);
    } finally {
        client.release();
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
