import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
import { getStatus } from "../bot/status";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

router.get("/ping", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

router.get("/bot-status", (_req, res) => {
  res.json(getStatus());
});

export default router;
