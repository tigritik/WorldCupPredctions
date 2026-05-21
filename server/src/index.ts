import express, { Request, Response, Application } from 'express';
import {groups} from "./data/groups";
import {teams} from "./data/teams";
import {groupPredictionsStore, matchPredictionsStore} from "./data/predictions";
import {SubmitGroupPredictionRequest, SubmitMatchPredictionsRequest} from "@shared/types";
import cors from "cors";
import {matches} from "./data/matches";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to allow cors for the frontend
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.get("/groups", (_: Request, res: Response) => {
    res.json(groups);
});

app.get("/teams/:id", (req: Request<{id: string}>, res: Response) => {
    const team = teams[req.params.id];

    if (!team) {
        return res.status(404).json({
            error: "Team not found",
        });
    }

    res.json(team);
});

app.post("/group-predictions", (req: Request, res: Response) => {
    const body = req.body as SubmitGroupPredictionRequest;

    if (groupPredictionsStore[body.name]) {
        return res.json({
            ok: false,
            error: "Name already exists",
        });
    }

    groupPredictionsStore[body.name] = body.predictions;

    return res.json({
        ok: true,
    });
});

app.get("/group-predictions/:name", (req: Request<{name: string}>, res: Response) => {
    const prediction = groupPredictionsStore[req.params.name];

    if (!prediction) {
        return res.status(404).json({
            error: "Prediction not found",
        });
    }

    res.json({
        name: req.params.name,
        predictions: prediction,
    });
});

app.get("/matches", (_: Request, res: Response) => {
    res.json(matches);
});

app.post("/match-predictions", (req: Request, res: Response) => {
    const body = req.body as SubmitMatchPredictionsRequest;

    if (matchPredictionsStore[body.name]) {
        return res.json({
            ok: false,
            error: "Name already exists",
        });
    }

    matchPredictionsStore[body.name] = body.predictions;

    return res.json({
        ok: true,
    });
});

app.get("/match-predictions/:name", (req: Request<{name: string}>, res: Response) => {
    const prediction = matchPredictionsStore[req.params.name];

    if (!prediction) {
        return res.status(404).json({
            error: "Prediction not found",
        });
    }

    res.json({
        name: req.params.name,
        predictions: prediction,
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
