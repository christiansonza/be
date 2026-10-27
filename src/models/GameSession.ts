import { Schema, model } from "mongoose";

export type Mark = "X" | "O";

export interface Move {
  player: string;
  mark: Mark;
  cell: number;
}

export interface Round {
  round: number;
  winner: string | null;
  winningLine: number[];
  moves: Move[];
}

export interface GameSession {
  playerOne: string;
  playerTwo: string;
  playerOneScore: number;
  playerTwoScore: number;
  draws: number;
  winner: string | null;
  rounds: Round[];
  createdAt: Date;
  updatedAt: Date;
}

const moveSchema = new Schema<Move>(
  {
    player: { type: String, required: true },
    mark: { type: String, enum: ["X", "O"], required: true },
    cell: { type: Number, min: 0, max: 8, required: true },
  },
  { _id: false },
);

const roundSchema = new Schema<Round>(
  {
    round: { type: Number, required: true },
    winner: { type: String, default: null },
    winningLine: { type: [Number], default: [] },
    moves: { type: [moveSchema], default: [] },
  },
  { _id: false },
);

const gameSessionSchema = new Schema<GameSession>(
  {
    playerOne: { type: String, required: true, trim: true },
    playerTwo: { type: String, required: true, trim: true },
    playerOneScore: { type: Number, default: 0, min: 0 },
    playerTwoScore: { type: Number, default: 0, min: 0 },
    draws: { type: Number, default: 0, min: 0 },
    winner: { type: String, default: null },
    rounds: { type: [roundSchema], default: [] },
  },
  { timestamps: true },
);

gameSessionSchema.index({ createdAt: -1 });

export const GameSessionModel = model<GameSession>("GameSession", gameSessionSchema);
