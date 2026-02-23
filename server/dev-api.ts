/**
 * Local dev server for /api/wilbur when not using `vercel dev`.
 * Run with: npx tsx server/dev-api.ts
 * Vite proxies /api to this server (see vite.config.ts).
 */
import "dotenv/config";
import express from "express";
import type { Response } from "express";
// Vercel serverless handler; Express res is compatible (setHeader, status, json)
// @ts-expect-error - Vercel handler signature; res is compatible
import handler from "../api/wilbur";

const PORT = 3001;
const app = express();
app.use(express.json({ limit: "64kb" }));

app.post("/api/wilbur", async (req, res) => {
  const vercelReq = {
    method: "POST" as const,
    body: req.body,
    headers: req.headers as Record<string, string | string[] | undefined>,
  };
  await handler(vercelReq, res);
});

app.listen(PORT, () => {
  console.log(`[Wilbur] API dev server at http://localhost:${PORT}`);
});
