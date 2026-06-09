// file to store all database interactions
import {Pool, PoolClient} from "pg";
import {SubmitMatchPredictionsRequest} from "@shared/types";
import {Match} from "@shared//types";

export async function insertMatchPredictions(client: PoolClient, body: SubmitMatchPredictionsRequest): Promise<string> {
    let predictionSetId: string;

    if (body.id) {
        predictionSetId = body.id;

        await client.query(`
        INSERT INTO match_prediction_sets(id, name)
        VALUES ($1, $2)
    `, [predictionSetId, body.name]);
    } else {
        const result = await client.query(`
        INSERT INTO match_prediction_sets(name)
        VALUES ($1)
        RETURNING id
    `, [body.name]);

        predictionSetId = result.rows[0].id;
    }

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

    return predictionSetId;
}

export async function fetchMatches(pool: Pool): Promise<Match[]> {
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

    return result.rows;
}
