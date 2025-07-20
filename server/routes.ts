import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema, insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    // Simple session-based auth (in production, use proper JWT or session management)
    if (req.session?.user?.role === 'admin') {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password || user.role !== 'admin') {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Store user in session
      req.session.user = user;
      
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          role: user.role 
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/admin/me", (req, res) => {
    if (req.session?.user) {
      res.json({ 
        user: { 
          id: req.session.user.id, 
          username: req.session.user.username, 
          role: req.session.user.role 
        } 
      });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Registration routes
  app.post("/api/registrations", async (req, res) => {
    try {
      const registrationData = insertRegistrationSchema.parse(req.body);
      const registration = await storage.createRegistration(registrationData);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create registration" });
      }
    }
  });

  app.get("/api/registrations", requireAuth, async (req, res) => {
    try {
      const registrations = await storage.getRegistrations();
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch registrations" });
    }
  });

  app.patch("/api/registrations/:id/status", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const registration = await storage.updateRegistrationStatus(id, status);
      
      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }
      
      res.json(registration);
    } catch (error) {
      res.status(500).json({ message: "Failed to update registration status" });
    }
  });

  // Contact message routes
  app.post("/api/contact", async (req, res) => {
    try {
      const messageData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to send message" });
      }
    }
  });

  app.get("/api/contact", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourseById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const registrationStats = await storage.getRegistrationStats();
      const courses = await storage.getCourses();
      
      // Calculate revenue (simplified)
      const totalRevenue = registrationStats.byCourse.reduce((sum, item) => {
        const course = courses.find(c => c.title === item.course);
        return sum + (course ? parseFloat(course.price) * item.count : 0);
      }, 0);

      const stats = {
        totalRegistrations: registrationStats.total,
        thisMonthRegistrations: registrationStats.thisMonth,
        activeCourses: courses.length,
        revenue: totalRevenue,
        completionRate: 87, // Mock data
        registrationTrends: registrationStats.byMonth,
        coursePopularity: registrationStats.byCourse
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
