import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { GameSessionModel, type Round } from "../models/GameSession";

interface SessionBody {
  playerOne?: string;
  playerTwo?: string;
  playerOneScore?: number;
  playerTwoScore?: number;
  draws?: number;
  winner?: string | null;
  rounds?: Round[];
}

function toCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
}

function toRound(value: Round, index: number): Round {
  return {
    round: toCount(value?.round) || index + 1,
    winner: typeof value?.winner === "string" ? value.winner : null,
    winningLine: Array.isArray(value?.winningLine) ? value.winningLine : [],
    moves: Array.isArray(value?.moves) ? value.moves : [],
  };
}

export async function getSessions(_req: Request, res: Response): Promise<void> {
  try {
    const sessions = await GameSessionModel.find().sort({ createdAt: -1 }).limit(50);
    res.json(sessions);
  } catch (error) {
    console.error("Could not list game sessions:", error);
    res.status(500).json({ message: "Could not load saved games." });
  }
}

export async function getSessionById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400).json({ message: "That is not a valid game id." });
    return;
  }

  try {
    const session = await GameSessionModel.findById(id);

    if (!session) {
      res.status(404).json({ message: "Game not found." });
      return;
    }

    res.json(session);
  } catch (error) {
    console.error(`Could not load game session ${id}:`, error);
    res.status(500).json({ message: "Could not load that game." });
  }
}

export async function createSession(req: Request, res: Response): Promise<void> {
  const body = (req.body ?? {}) as SessionBody;
  const playerOne = body.playerOne?.trim();
  const playerTwo = body.playerTwo?.trim();

  if (!playerOne || !playerTwo) {
    res.status(400).json({ message: "Both player names are required." });
    return;
  }

  const rounds = Array.isArray(body.rounds) ? body.rounds.map(toRound) : [];

  if (rounds.length === 0) {
    res.status(400).json({ message: "A finished game needs at least one round." });
    return;
  }

  try {
    const session = await GameSessionModel.create({
      playerOne,
      playerTwo,
      playerOneScore: toCount(body.playerOneScore),
      playerTwoScore: toCount(body.playerTwoScore),
      draws: toCount(body.draws),
      winner: typeof body.winner === "string" ? body.winner : null,
      rounds,
    });

    res.status(201).json(session);
  } catch (error) {
    console.error("Could not save game session:", error);
    res.status(500).json({ message: "Could not save the game." });
  }
}
