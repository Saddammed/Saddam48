import { db } from "./db";
import {
  products, bioLinks, botLogs, topupRequests, saasGenerations, botSettings,
  type Product, type BioLink, type BotLog, type TopupRequest, type SaasGeneration,
  type InsertTopupRequest, type InsertBotLog, type InsertSaasGeneration
} from "@shared/schema";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  // Project 1
  getProducts(): Promise<Product[]>;
  seedProducts(): Promise<void>;
  
  // Project 2
  getBioLinks(): Promise<BioLink[]>;
  seedBioLinks(): Promise<void>;
  
  // Project 3
  getBotLogs(): Promise<BotLog[]>;
  createBotLog(log: InsertBotLog): Promise<BotLog>;
  
  // Project 4
  createTopupRequest(request: InsertTopupRequest): Promise<TopupRequest>;
  getTopupRequests(): Promise<TopupRequest[]>;
  
  // Project 5
  createSaasGeneration(gen: InsertSaasGeneration): Promise<SaasGeneration>;
  
  // Bot Settings
  getBotSetting(key: string): Promise<string | null>;
  setBotSetting(key: string, value: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // === Project 1 ===
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }
  
  async seedProducts(): Promise<void> {
    const existing = await this.getProducts();
    if (existing.length === 0) {
      await db.insert(products).values({
        name: "Premium Wireless Headphones",
        description: "Experience high-fidelity sound with active noise cancellation and 30-hour battery life.",
        price: "$299.00",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      });
    }
  }

  // === Project 2 ===
  async getBioLinks(): Promise<BioLink[]> {
    return await db.select().from(bioLinks).orderBy(bioLinks.order);
  }
  
  async seedBioLinks(): Promise<void> {
    const existing = await this.getBioLinks();
    if (existing.length === 0) {
      await db.insert(bioLinks).values([
        { title: "Visit Website", url: "https://example.com", icon: "Globe", order: 1 },
        { title: "Instagram", url: "https://instagram.com", icon: "Instagram", order: 2 },
        { title: "WhatsApp Support", url: "https://wa.me/1234567890", icon: "MessageCircle", order: 3 },
        { title: "My Portfolio", url: "#", icon: "Briefcase", order: 4 },
      ]);
    }
  }

  // === Project 3 ===
  async getBotLogs(): Promise<BotLog[]> {
    return await db.select().from(botLogs).orderBy(desc(botLogs.timestamp)).limit(20);
  }
  
  async createBotLog(log: InsertBotLog): Promise<BotLog> {
    const [newLog] = await db.insert(botLogs).values(log).returning();
    return newLog;
  }

  // === Project 4 ===
  async createTopupRequest(request: InsertTopupRequest): Promise<TopupRequest> {
    const [req] = await db.insert(topupRequests).values(request).returning();
    return req;
  }
  
  async getTopupRequests(): Promise<TopupRequest[]> {
    return await db.select().from(topupRequests).orderBy(desc(topupRequests.createdAt)).limit(10);
  }

  // === Project 5 ===
  async createSaasGeneration(gen: InsertSaasGeneration): Promise<SaasGeneration> {
    const [newGen] = await db.insert(saasGenerations).values(gen).returning();
    return newGen;
  }

  // === Bot Settings ===
  async getBotSetting(key: string): Promise<string | null> {
    const result = await db.select().from(botSettings).where(eq(botSettings.key, key)).limit(1);
    return result[0]?.value || null;
  }

  async setBotSetting(key: string, value: string): Promise<void> {
    const existing = await this.getBotSetting(key);
    if (existing !== null) {
      await db.update(botSettings).set({ value, updatedAt: new Date() }).where(eq(botSettings.key, key));
    } else {
      await db.insert(botSettings).values({ key, value });
    }
  }
}

export const storage = new DatabaseStorage();
