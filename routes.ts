import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { initTelegramBot, getBotStatus, setupWebhookRoute, checkAndPostOnWake } from "./telegram-bot";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup authentication (BEFORE other routes)
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // Setup Telegram webhook route first (before other routes)
  setupWebhookRoute(app);
  
  // Initialize Telegram bot with app for webhook mode
  await initTelegramBot(app);
  
  // === Project 1: Landing Page ===
  app.get(api.products.list.path, async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  // === Project 2: Bio Link ===
  app.get(api.bioLinks.list.path, async (req, res) => {
    const links = await storage.getBioLinks();
    res.json(links);
  });

  // === Project 3: Telegram Bot (Mock) ===
  app.get(api.bot.logs.path, async (req, res) => {
    const logs = await storage.getBotLogs();
    res.json(logs);
  });

  app.get(api.bot.status.path, async (req, res) => {
    const botStatus = getBotStatus();
    res.json({ 
      status: botStatus.running ? 'running' : 'stopped', 
      username: botStatus.username || null,
      uptime: process.uptime() 
    });
  });

  // Wake endpoint - triggers auto-post if interval has passed (for free plan sleep recovery)
  app.post("/api/bot/wake", async (req, res) => {
    try {
      const posted = await checkAndPostOnWake();
      res.json({ woken: true, posted });
    } catch (error) {
      res.status(500).json({ woken: false, error: "Wake failed" });
    }
  });

  // === Project 4: Game Top-up ===
  app.post(api.topups.create.path, async (req, res) => {
    try {
      const input = api.topups.create.input.parse(req.body);
      const topup = await storage.createTopupRequest(input);
      res.status(201).json(topup);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.get(api.topups.list.path, async (req, res) => {
    const requests = await storage.getTopupRequests();
    res.json(requests);
  });

  // === Project 5: SaaS Tool ===
  app.post(api.saas.generate.path, async (req, res) => {
    try {
      const { keyword } = req.body;
      if (!keyword) return res.status(400).json({ message: "Keyword required" });

      // Mock AI generation logic
      const hashtags = [
        `#${keyword}`,
        `#${keyword}Life`,
        `#${keyword}2024`,
        `#Best${keyword}`,
        `#${keyword}Lover`,
        `#${keyword}Daily`,
        `#Insta${keyword}`,
        `#${keyword}Gram`
      ].join(" ");

      const gen = await storage.createSaasGeneration({
        keyword,
        result: hashtags
      });

      res.status(201).json(gen);
    } catch (err) {
      res.status(500).json({ message: "Generation failed" });
    }
  });

  // Initialize seed data
  await storage.seedProducts();
  await storage.seedBioLinks();

  return httpServer;
}
