import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export auth schema (required for Replit Auth)
export * from "./models/auth";

// === 1. Landing Page Product ===
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// === 2. Bio Link Buttons ===
export const bioLinks = pgTable("bio_links", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull(), // lucide icon name
  order: integer("order").notNull().default(0),
});

export const insertBioLinkSchema = createInsertSchema(bioLinks).omit({ id: true });
export type BioLink = typeof bioLinks.$inferSelect;
export type InsertBioLink = z.infer<typeof insertBioLinkSchema>;

// === 3. Telegram Bot Logs ===
export const botLogs = pgTable("bot_logs", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  direction: text("direction").notNull(), // 'inbound' or 'outbound'
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertBotLogSchema = createInsertSchema(botLogs).omit({ id: true, timestamp: true });
export type BotLog = typeof botLogs.$inferSelect;
export type InsertBotLog = z.infer<typeof insertBotLogSchema>;

// === 4. Game Top-up Requests ===
export const topupRequests = pgTable("topup_requests", {
  id: serial("id").primaryKey(),
  playerId: text("player_id").notNull(),
  amount: text("amount").notNull(),
  status: text("status").notNull().default("pending"), // pending, completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTopupRequestSchema = createInsertSchema(topupRequests).omit({ id: true, status: true, createdAt: true });
export type TopupRequest = typeof topupRequests.$inferSelect;
export type InsertTopupRequest = z.infer<typeof insertTopupRequestSchema>;

// === 5. SaaS Tool Generations ===
export const saasGenerations = pgTable("saas_generations", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  result: text("result").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSaasGenerationSchema = createInsertSchema(saasGenerations).omit({ id: true, createdAt: true });
export type SaasGeneration = typeof saasGenerations.$inferSelect;
export type InsertSaasGeneration = z.infer<typeof insertSaasGenerationSchema>;

// === 6. Bot Settings (for persisting auto-post state) ===
export const botSettings = pgTable("bot_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBotSettingSchema = createInsertSchema(botSettings).omit({ id: true, updatedAt: true });
export type BotSetting = typeof botSettings.$inferSelect;
export type InsertBotSetting = z.infer<typeof insertBotSettingSchema>;
