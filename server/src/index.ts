import express, { Request, Response, Application } from 'express';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Base Route
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to your TypeScript Express API!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
