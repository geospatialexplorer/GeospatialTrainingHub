import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema, insertContactMessageSchema, insertBannerSchema, insertWebsiteSettingSchema, insertCourseSchema } from "@shared/schema";
import { z } from "zod";
import { emailService } from "./email-service";

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
      console.log('📝 Registration request body:', req.body);
      
      const registrationData = insertRegistrationSchema.parse(req.body);
      console.log('✅ Registration data validated:', registrationData);
      
      const registration = await storage.createRegistration(registrationData);
      console.log('✅ Registration created:', registration);
      
      // Get the course details for the email
      const course = await storage.getCourseById(registration.courseId);
      if (course) {
        // Send confirmation email to the user
        await emailService.sendAdminNotification(registration, course);
      }
      
      res.status(201).json(registration);
    } catch (error) {
      console.error('❌ Registration error:', error);
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
      
      // If the status is changed to 'confirmed', send a confirmation email
      if (status === 'confirmed') {
        const course = await storage.getCourseById(registration.courseId);
        if (course) {
          await emailService.sendRegistrationConfirmation(registration, course);
        }
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
  
  app.post("/api/courses", requireAuth, async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid course data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create course" });
      }
    }
  });

  app.patch("/api/courses/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id;
      const courseData = req.body;
      const course = await storage.updateCourse(id, courseData);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  app.delete("/api/courses/:id", requireAuth, async (req, res) => {
    try {
      const id = req.params.id;
      const success = await storage.deleteCourse(id);
      
      if (!success) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete course" });
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

  // Banner routes
  app.get("/api/banners", async (req, res) => {
    try {
      const banners = await storage.getBanners();
      // If not admin, only return active banners
      if (req.session?.user?.role !== 'admin') {
        return res.json(banners.filter(banner => banner.isActive));
      }
      res.json(banners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch banners" });
    }
  });

  app.get("/api/banners/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const banner = await storage.getBannerById(id);
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }
      res.json(banner);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch banner" });
    }
  });

  app.post("/api/banners", requireAuth, async (req, res) => {
    try {
      const bannerData = insertBannerSchema.parse(req.body);
      const banner = await storage.createBanner(bannerData);
      res.status(201).json(banner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid banner data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create banner" });
      }
    }
  });

  app.patch("/api/banners/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bannerData = req.body;
      const banner = await storage.updateBanner(id, bannerData);
      
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }
      
      res.json(banner);
    } catch (error) {
      res.status(500).json({ message: "Failed to update banner" });
    }
  });

  app.delete("/api/banners/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBanner(id);
      
      if (!success) {
        return res.status(404).json({ message: "Banner not found" });
      }
      
      res.json({ message: "Banner deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete banner" });
    }
  });

  // Website settings routes
  app.get("/api/website-settings", async (req, res) => {
    try {
      const settings = await storage.getWebsiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch website settings" });
    }
  });

  app.get("/api/website-settings/:key", async (req, res) => {
    try {
      const setting = await storage.getWebsiteSettingByKey(req.params.key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  app.post("/api/website-settings", requireAuth, async (req, res) => {
    try {
      const settingData = insertWebsiteSettingSchema.parse(req.body);
      const setting = await storage.createWebsiteSetting(settingData);
      res.status(201).json(setting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid setting data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create setting" });
      }
    }
  });

  app.patch("/api/website-settings/:key", requireAuth, async (req, res) => {
    try {
      const { value } = req.body;
      if (value === undefined) {
        return res.status(400).json({ message: "Value is required" });
      }
      
      const setting = await storage.updateWebsiteSetting(req.params.key, value);
      
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      
      res.json(setting);
    } catch (error) {
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
