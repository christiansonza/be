import "dotenv/config";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
import { app } from "./app";
import { connectDatabase } from "./config/database";

const PORT = process.env.PORT ?? 4000;

async function start(): Promise<void> {
  try {
    await connectDatabase();
  } catch (error) {
    console.error("MongoDB is not reachable:", error);
  }

  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

start();
