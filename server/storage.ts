import { 
  User, InsertUser, 
  Challenge, InsertChallenge, 
  Participation, InsertParticipation,
  Trade, InsertTrade,
  Activity, InsertActivity
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Challenge operations
  getChallenge(id: number): Promise<Challenge | undefined>;
  getChallenges(): Promise<Challenge[]>;
  getUpcomingChallenges(): Promise<Challenge[]>;
  getActiveChallenges(): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  updateChallenge(id: number, challenge: Partial<Challenge>): Promise<Challenge | undefined>;
  
  // Participation operations
  getParticipation(id: number): Promise<Participation | undefined>;
  getParticipationByUserAndChallenge(userId: number, challengeId: number): Promise<Participation | undefined>;
  getParticipationsByChallenge(challengeId: number): Promise<Participation[]>;
  getParticipationsByUser(userId: number): Promise<Participation[]>;
  createParticipation(participation: InsertParticipation): Promise<Participation>;
  updateParticipation(id: number, participation: Partial<Participation>): Promise<Participation | undefined>;
  
  // Trade operations
  getTrade(id: number): Promise<Trade | undefined>;
  getTradesByParticipation(participationId: number): Promise<Trade[]>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  updateTrade(id: number, trade: Partial<Trade>): Promise<Trade | undefined>;
  
  // Activity operations
  getActivitiesByUser(userId: number, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Session storage
  sessionStore: session.SessionStore;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private challenges: Map<number, Challenge>;
  private participations: Map<number, Participation>;
  private trades: Map<number, Trade>;
  private activities: Map<number, Activity>;
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private challengeIdCounter: number;
  private participationIdCounter: number;
  private tradeIdCounter: number;
  private activityIdCounter: number;

  constructor() {
    this.users = new Map();
    this.challenges = new Map();
    this.participations = new Map();
    this.trades = new Map();
    this.activities = new Map();
    
    this.userIdCounter = 1;
    this.challengeIdCounter = 1;
    this.participationIdCounter = 1;
    this.tradeIdCounter = 1;
    this.activityIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Initialize with some demo challenges
    this.seedData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      updatedAt: now 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Challenge operations
  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async getUpcomingChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values())
      .filter(challenge => challenge.status === 'upcoming');
  }

  async getActiveChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values())
      .filter(challenge => challenge.status === 'active');
  }

  async createChallenge(insertChallenge: InsertChallenge): Promise<Challenge> {
    const id = this.challengeIdCounter++;
    const now = new Date();
    const challenge: Challenge = {
      ...insertChallenge,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.challenges.set(id, challenge);
    return challenge;
  }

  async updateChallenge(id: number, challengeData: Partial<Challenge>): Promise<Challenge | undefined> {
    const challenge = await this.getChallenge(id);
    if (!challenge) return undefined;
    
    const updatedChallenge: Challenge = {
      ...challenge,
      ...challengeData,
      updatedAt: new Date()
    };
    
    this.challenges.set(id, updatedChallenge);
    return updatedChallenge;
  }

  // Participation operations
  async getParticipation(id: number): Promise<Participation | undefined> {
    return this.participations.get(id);
  }

  async getParticipationByUserAndChallenge(userId: number, challengeId: number): Promise<Participation | undefined> {
    return Array.from(this.participations.values()).find(
      (p) => p.userId === userId && p.challengeId === challengeId,
    );
  }

  async getParticipationsByChallenge(challengeId: number): Promise<Participation[]> {
    return Array.from(this.participations.values())
      .filter((p) => p.challengeId === challengeId);
  }

  async getParticipationsByUser(userId: number): Promise<Participation[]> {
    return Array.from(this.participations.values())
      .filter((p) => p.userId === userId);
  }

  async createParticipation(insertParticipation: InsertParticipation): Promise<Participation> {
    const id = this.participationIdCounter++;
    const now = new Date();
    const participation: Participation = {
      ...insertParticipation,
      id,
      pnl: "0",
      pnlPercentage: "0",
      position: null,
      status: "active",
      createdAt: now,
      updatedAt: now
    };
    this.participations.set(id, participation);
    return participation;
  }

  async updateParticipation(id: number, participationData: Partial<Participation>): Promise<Participation | undefined> {
    const participation = await this.getParticipation(id);
    if (!participation) return undefined;
    
    const updatedParticipation: Participation = {
      ...participation,
      ...participationData,
      updatedAt: new Date()
    };
    
    this.participations.set(id, updatedParticipation);
    return updatedParticipation;
  }

  // Trade operations
  async getTrade(id: number): Promise<Trade | undefined> {
    return this.trades.get(id);
  }

  async getTradesByParticipation(participationId: number): Promise<Trade[]> {
    return Array.from(this.trades.values())
      .filter((t) => t.participationId === participationId);
  }

  async createTrade(insertTrade: InsertTrade): Promise<Trade> {
    const id = this.tradeIdCounter++;
    const now = new Date();
    const trade: Trade = {
      ...insertTrade,
      id,
      profit: null,
      closePrice: null,
      status: "open",
      openTime: now,
      closeTime: null
    };
    this.trades.set(id, trade);
    return trade;
  }

  async updateTrade(id: number, tradeData: Partial<Trade>): Promise<Trade | undefined> {
    const trade = await this.getTrade(id);
    if (!trade) return undefined;
    
    const updatedTrade: Trade = {
      ...trade,
      ...tradeData
    };
    
    this.trades.set(id, updatedTrade);
    return updatedTrade;
  }

  // Activity operations
  async getActivitiesByUser(userId: number, limit?: number): Promise<Activity[]> {
    const activities = Array.from(this.activities.values())
      .filter((a) => a.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return limit ? activities.slice(0, limit) : activities;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const now = new Date();
    const activity: Activity = {
      ...insertActivity,
      id,
      createdAt: now
    };
    this.activities.set(id, activity);
    return activity;
  }

  // Seed demo data
  private seedData() {
    // Create demo challenges
    const now = new Date();
    const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
    
    const challenges = [
      {
        name: "FX Pro Challenge",
        description: "Trading all major currency pairs",
        entryFee: "25.00",
        startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + threeDaysInMs),
        initialBalance: "10000.00",
        prizeAmount: "50000.00",
        maxParticipants: 50,
        type: "forex",
        status: "upcoming",
      },
      {
        name: "Crypto Weekend Sprint",
        description: "Trading top cryptocurrencies",
        entryFee: "35.00",
        startTime: new Date(now.getTime() + 18 * 60 * 60 * 1000), // 18 hours from now
        endTime: new Date(now.getTime() + 18 * 60 * 60 * 1000 + threeDaysInMs),
        initialBalance: "10000.00",
        prizeAmount: "75000.00",
        maxParticipants: 30,
        type: "crypto",
        status: "upcoming",
      },
      {
        name: "Stock Market Challenge",
        description: "Trading US stocks and indices",
        entryFee: "15.00",
        startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + threeDaysInMs),
        initialBalance: "10000.00",
        prizeAmount: "25000.00",
        maxParticipants: 100,
        type: "stocks",
        status: "upcoming",
      },
      {
        name: "Forex Masters Challenge",
        description: "Trading all major currency pairs",
        entryFee: "40.00",
        startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000),
        initialBalance: "10000.00",
        prizeAmount: "50000.00",
        maxParticipants: 15,
        type: "forex",
        status: "active",
      }
    ];

    for (const challenge of challenges) {
      this.createChallenge(challenge as InsertChallenge);
    }
  }
}

export const storage = new MemStorage();
