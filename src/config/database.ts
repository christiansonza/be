import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB ?? "tic_tac_toe";

export async function connectDatabase(): Promise<void> {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env and add your connection string.",
    );
  }

  mongoose.connection.on("error", (error: Error) => {
    console.error("MongoDB connection error:", error.message);
  });

  await mongoose.connect(MONGODB_URI, {
    dbName: MONGODB_DB,
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB connected to "${mongoose.connection.name}"`);
}
