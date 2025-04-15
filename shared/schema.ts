import { pgTable, text, serial, integer, boolean, timestamp, decimal, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  displayName: text("display_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Challenge model
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  entryFee: decimal("entry_fee", { precision: 10, scale: 2 }).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  initialBalance: decimal("initial_balance", { precision: 10, scale: 2 }).notNull().default("10000"),
  prizeAmount: decimal("prize_amount", { precision: 10, scale: 2 }).notNull(),
  maxParticipants: integer("max_participants").notNull(),
  type: text("type").notNull(), // forex, crypto, stocks
  status: text("status").notNull().default("upcoming"), // upcoming, active, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Participation model
export const participations = pgTable("participations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  currentBalance: decimal("current_balance", { precision: 10, scale: 2 }).notNull(),
  pnl: decimal("pnl", { precision: 10, scale: 2 }).notNull().default("0"),
  pnlPercentage: decimal("pnl_percentage", { precision: 10, scale: 2 }).notNull().default("0"),
  position: integer("position"),
  status: text("status").notNull().default("active"), // active, completed
  paymentStatus: text("payment_status").notNull(), // pending, completed
  paymentIntentId: text("payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Trade model
export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  participationId: integer("participation_id").notNull().references(() => participations.id),
  symbol: text("symbol").notNull(),
  type: text("type").notNull(), // buy, sell
  openPrice: decimal("open_price", { precision: 10, scale: 5 }).notNull(),
  closePrice: decimal("close_price", { precision: 10, scale: 5 }),
  volume: decimal("volume", { precision: 10, scale: 2 }).notNull(),
  profit: decimal("profit", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("open"), // open, closed
  openTime: timestamp("open_time").defaultNow().notNull(),
  closeTime: timestamp("close_time"),
});

// Activity model
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // challenge_join, challenge_win, trade, payment
  description: text("description").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  displayName: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  name: true,
  description: true,
  entryFee: true,
  startTime: true,
  endTime: true,
  initialBalance: true,
  prizeAmount: true,
  maxParticipants: true,
  type: true,
  status: true,
});

export const insertParticipationSchema = createInsertSchema(participations).pick({
  userId: true,
  challengeId: true,
  currentBalance: true,
  paymentStatus: true,
  paymentIntentId: true,
});

export const insertTradeSchema = createInsertSchema(trades).pick({
  participationId: true,
  symbol: true,
  type: true,
  openPrice: true,
  volume: true,
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  type: true,
  description: true,
  metadata: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

export type InsertParticipation = z.infer<typeof insertParticipationSchema>;
export type Participation = typeof participations.$inferSelect;

export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Trade = typeof trades.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Auth schemas
export type LoginData = Pick<InsertUser, "username" | "password">;
