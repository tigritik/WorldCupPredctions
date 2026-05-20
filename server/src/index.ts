import express, { Request, Response, Application } from 'express';
import {groups} from "./data/groups";
import {teams} from "./data/teams";
import {predictionsStore} from "./data/predictions";
import {SubmitGroupPredictionRequest} from "@shared/types";
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

app.post("/predictions", (req: Request, res: Response) => {
    const body = req.body as SubmitGroupPredictionRequest;

    if (predictionsStore[body.name]) {
        return res.json({
            ok: false,
            error: "Name already exists",
        });
    }

    predictionsStore[body.name] = body.predictions;

    return res.json({
        ok: true,
    });
});

app.get("/predictions/:name", (req: Request<{name: string}>, res: Response) => {
    const prediction = predictionsStore[req.params.name];

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

// Start Server
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
