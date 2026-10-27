import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import gameRoutes from "./routes/gameRoutes";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.use("/api/games", gameRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled request error:", error);
  res.status(500).json({ message: "Something went wrong." });
});
