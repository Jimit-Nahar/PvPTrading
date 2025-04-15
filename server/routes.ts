import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import Stripe from "stripe";
import { insertParticipationSchema } from "@shared/schema";

// Setup Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing STRIPE_SECRET_KEY - using test mode');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_51OqmtTIsQQhakIRV8jw8X8u5jA7V7YKFnUKFbfJVpMSEDtEEIJIOMtXXKYXNODVPPBujuxsHcF0EtwkbXRHbEcEM00CTZ8XvJN", {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup auth routes
  setupAuth(app);

  // Get upcoming challenges
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getChallenges();
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Error fetching challenges" });
    }
  });

  // Get challenge by ID
  app.get("/api/challenges/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const challenge = await storage.getChallenge(id);
      
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      const participants = await storage.getParticipationsByChallenge(id);
      
      res.json({ 
        ...challenge, 
        participantsCount: participants.length
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching challenge" });
    }
  });

  // Get leaderboard for challenge
  app.get("/api/challenges/:id/leaderboard", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const challenge = await storage.getChallenge(id);
      
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      // Get participants for the challenge
      const participants = await storage.getParticipationsByChallenge(id);
      
      // Sort by current balance (descending)
      const sortedParticipants = [...participants].sort((a, b) => {
        return parseFloat(b.currentBalance) - parseFloat(a.currentBalance);
      });
      
      // Add position to each participant
      const leaderboard = await Promise.all(sortedParticipants.map(async (p, index) => {
        const user = await storage.getUser(p.userId);
        
        if (!user) {
          return null;
        }
        
        await storage.updateParticipation(p.id, { position: index + 1 });
        
        return {
          position: index + 1,
          participationId: p.id,
          userId: p.userId,
          username: user.username,
          displayName: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
          currentBalance: p.currentBalance,
          pnl: p.pnl,
          pnlPercentage: p.pnlPercentage
        };
      }));
      
      res.json(leaderboard.filter(item => item !== null));
    } catch (error) {
      res.status(500).json({ message: "Error fetching leaderboard" });
    }
  });

  // Get user activities
  app.get("/api/activities", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const activities = await storage.getActivitiesByUser(req.user.id, limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching activities" });
    }
  });

  // Get user participations (challenges)
  app.get("/api/participations", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const participations = await storage.getParticipationsByUser(req.user.id);
      
      const result = await Promise.all(participations.map(async (p) => {
        const challenge = await storage.getChallenge(p.challengeId);
        return {
          ...p,
          challenge: challenge || undefined
        };
      }));
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching participations" });
    }
  });

  // Get active participations (challenges)
  app.get("/api/participations/active", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const participations = await storage.getParticipationsByUser(req.user.id);
      const activeParticipations = participations.filter(p => p.status === "active");
      
      const result = await Promise.all(activeParticipations.map(async (p) => {
        const challenge = await storage.getChallenge(p.challengeId);
        return {
          ...p,
          challenge: challenge || undefined
        };
      }));
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching active participations" });
    }
  });

  // Get trades for participation
  app.get("/api/participations/:id/trades", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const participation = await storage.getParticipation(id);
      
      if (!participation) {
        return res.status(404).json({ message: "Participation not found" });
      }
      
      // Verify ownership
      if (participation.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const trades = await storage.getTradesByParticipation(id);
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: "Error fetching trades" });
    }
  });

  // Create a payment intent for joining a challenge
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const { challengeId } = req.body;
      
      if (!challengeId) {
        return res.status(400).json({ message: "Challenge ID is required" });
      }
      
      const challenge = await storage.getChallenge(parseInt(challengeId));
      
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      // Check if user is already participating
      const existingParticipation = await storage.getParticipationByUserAndChallenge(
        req.user.id,
        challenge.id
      );
      
      if (existingParticipation) {
        return res.status(400).json({ message: "You are already participating in this challenge" });
      }
      
      // Check if challenge start time has passed
      if (new Date(challenge.startTime) < new Date()) {
        return res.status(400).json({ message: "This challenge has already started" });
      }
      
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(challenge.entryFee) * 100), // Convert to cents
        currency: "usd",
        metadata: {
          userId: req.user.id.toString(),
          challengeId: challenge.id.toString()
        }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ message: "Error creating payment intent" });
    }
  });

  // Join a challenge
  app.post("/api/challenges/:id/join", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const { paymentIntentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ message: "Payment intent ID is required" });
      }
      
      const challenge = await storage.getChallenge(id);
      
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      // Check if challenge start time has passed
      if (new Date(challenge.startTime) < new Date()) {
        return res.status(400).json({ message: "This challenge has already started" });
      }
      
      // Check if user is already participating
      const existingParticipation = await storage.getParticipationByUserAndChallenge(
        req.user.id,
        challenge.id
      );
      
      if (existingParticipation) {
        return res.status(400).json({ message: "You are already participating in this challenge" });
      }
      
      // Create participation
      const participation = await storage.createParticipation({
        userId: req.user.id,
        challengeId: challenge.id,
        currentBalance: challenge.initialBalance,
        paymentStatus: "completed",
        paymentIntentId: paymentIntentId
      });
      
      // Create activity
      await storage.createActivity({
        userId: req.user.id,
        type: "challenge_join",
        description: `You joined "${challenge.name}" challenge`,
        metadata: JSON.stringify({ challengeId: challenge.id })
      });
      
      res.status(201).json(participation);
    } catch (error) {
      res.status(500).json({ message: "Error joining challenge" });
    }
  });

  // Create a trade
  app.post("/api/participations/:id/trades", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const { symbol, type, openPrice, volume } = req.body;
      
      if (!symbol || !type || !openPrice || !volume) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const participation = await storage.getParticipation(id);
      
      if (!participation) {
        return res.status(404).json({ message: "Participation not found" });
      }
      
      // Verify ownership
      if (participation.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Create trade
      const trade = await storage.createTrade({
        participationId: participation.id,
        symbol,
        type,
        openPrice,
        volume
      });
      
      res.status(201).json(trade);
    } catch (error) {
      res.status(500).json({ message: "Error creating trade" });
    }
  });

  // Close a trade
  app.patch("/api/trades/:id/close", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const id = parseInt(req.params.id);
      const { closePrice, profit } = req.body;
      
      if (!closePrice || profit === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const trade = await storage.getTrade(id);
      
      if (!trade) {
        return res.status(404).json({ message: "Trade not found" });
      }
      
      const participation = await storage.getParticipation(trade.participationId);
      
      if (!participation) {
        return res.status(404).json({ message: "Participation not found" });
      }
      
      // Verify ownership
      if (participation.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Update trade
      const updatedTrade = await storage.updateTrade(id, {
        closePrice,
        profit: profit.toString(),
        status: "closed",
        closeTime: new Date()
      });
      
      // Update participation balance
      const newBalance = parseFloat(participation.currentBalance) + parseFloat(profit.toString());
      const pnl = newBalance - parseFloat(participation.currentBalance);
      const pnlPercentage = (pnl / parseFloat(participation.currentBalance)) * 100;
      
      await storage.updateParticipation(participation.id, {
        currentBalance: newBalance.toString(),
        pnl: pnl.toString(),
        pnlPercentage: pnlPercentage.toString()
      });
      
      res.json(updatedTrade);
    } catch (error) {
      res.status(500).json({ message: "Error closing trade" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
