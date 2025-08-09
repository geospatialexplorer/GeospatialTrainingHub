import { 
  users, 
  registrations, 
  contactMessages, 
  courses,
  banners,
  websiteSettings,
  type User, 
  type InsertUser, 
  type Registration, 
  type InsertRegistration,
  type ContactMessage,
  type InsertContactMessage,
  type Course,
  type InsertCourse,
  type Banner,
  type InsertBanner,
  type WebsiteSetting,
  type InsertWebsiteSetting
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Registration operations
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
  getRegistrationById(id: number): Promise<Registration | undefined>;
  updateRegistrationStatus(id: number, status: string): Promise<Registration | undefined>;
  getRegistrationStats(): Promise<{
    total: number;
    thisMonth: number;
    byMonth: number[];
    byCourse: { course: string; count: number; }[];
  }>;
  
  // Contact message operations
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  
  // Course operations
  getCourses(): Promise<Course[]>;
  getCourseById(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(id: string): Promise<boolean>;
  updateCourseEnrollment(id: string, increment: number): Promise<Course | undefined>;
  
  // Banner operations
  getBanners(): Promise<Banner[]>;
  getBannerById(id: number): Promise<Banner | undefined>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBanner(id: number, banner: Partial<InsertBanner>): Promise<Banner | undefined>;
  deleteBanner(id: number): Promise<boolean>;
  
  // Website settings operations
  getWebsiteSettings(): Promise<WebsiteSetting[]>;
  getWebsiteSettingByKey(key: string): Promise<WebsiteSetting | undefined>;
  createWebsiteSetting(setting: InsertWebsiteSetting): Promise<WebsiteSetting>;
  updateWebsiteSetting(key: string, value: string): Promise<WebsiteSetting | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private registrations: Map<number, Registration>;
  private contactMessages: Map<number, ContactMessage>;
  private courses: Map<string, Course>;
  private banners: Map<number, Banner>;
  private websiteSettings: Map<string, WebsiteSetting>;
  private currentUserId: number;
  private currentRegistrationId: number;
  private currentContactId: number;
  private currentBannerId: number;
  private currentWebsiteSettingId: number;

  constructor() {
    this.users = new Map();
    this.registrations = new Map();
    this.contactMessages = new Map();
    this.courses = new Map();
    this.banners = new Map();
    this.websiteSettings = new Map();
    this.currentUserId = 1;
    this.currentRegistrationId = 1;
    this.currentContactId = 1;
    this.currentBannerId = 1;
    this.currentWebsiteSettingId = 1;
    
    // Initialize with admin user
    this.createUser({
      username: "admin@geospatialacademy.com",
      password: "admin123", // In production, this would be hashed
      role: "admin"
    });
    
    // Initialize with sample courses
    this.initializeCourses();
  }

  private initializeCourses() {
    const sampleCourses: InsertCourse[] = [
      {
        id: "gis-fundamentals",
        title: "GIS Fundamentals & ESRI ArcGIS",
        description: "Master the basics of Geographic Information Systems using industry-standard ESRI ArcGIS software. Perfect for beginners.",
        level: "Beginner",
        duration: "40 hours",
        price: "299.00",
        enrolled: 324,
        imageUrl: "https://pixabay.com/get/g5f7f3b1fbad579eed5df651b5a1122caaea2ed21d4488ecdef7bf626211fbfd07d5876e3afe23548a2550a0e93b93c72_1280.jpg"
      },
      {
        id: "remote-sensing",
        title: "Remote Sensing & Image Analysis",
        description: "Learn advanced satellite image processing, spectral analysis, and environmental monitoring techniques.",
        level: "Intermediate",
        duration: "60 hours",
        price: "449.00",
        enrolled: 189,
        imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        id: "spatial-analysis",
        title: "Advanced Spatial Analysis & Modeling",
        description: "Master complex spatial analysis, 3D modeling, and predictive analytics for professional GIS applications.",
        level: "Advanced",
        duration: "80 hours",
        price: "599.00",
        enrolled: 156,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        id: "python-gis",
        title: "Python for Geospatial Analysis",
        description: "Learn Python programming for GIS automation, data processing, and custom geospatial applications.",
        level: "Intermediate",
        duration: "50 hours",
        price: "399.00",
        enrolled: 278,
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        id: "drone-surveying",
        title: "Drone Surveying & Photogrammetry",
        description: "Master UAV data collection, photogrammetry, and drone-based mapping for professional surveying.",
        level: "Specialized",
        duration: "45 hours",
        price: "549.00",
        enrolled: 142,
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      },
      {
        id: "web-gis",
        title: "Web GIS & Location Services",
        description: "Build interactive web maps and location-based applications using modern web technologies and APIs.",
        level: "Professional",
        duration: "55 hours",
        price: "499.00",
        enrolled: 201,
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300"
      }
    ];
    
    sampleCourses.forEach(course => {
      this.courses.set(course.id, course as Course);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "user",
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    const id = this.currentRegistrationId++;
    const newRegistration: Registration = {
      ...registration,
      id,
      phone: registration.phone || null,
      goals: registration.goals || null,
      agreeTerms: registration.agreeTerms || false,
      newsletter: registration.newsletter || false,
      status: "pending",
      registrationDate: new Date()
    };
    this.registrations.set(id, newRegistration);
    
    // Update course enrollment count
    await this.updateCourseEnrollment(registration.courseId, 1);
    
    return newRegistration;
  }

  async getRegistrations(): Promise<Registration[]> {
    return Array.from(this.registrations.values()).sort(
      (a, b) => b.registrationDate.getTime() - a.registrationDate.getTime()
    );
  }

  async getRegistrationById(id: number): Promise<Registration | undefined> {
    return this.registrations.get(id);
  }

  async updateRegistrationStatus(id: number, status: string): Promise<Registration | undefined> {
    const registration = this.registrations.get(id);
    if (registration) {
      registration.status = status;
      this.registrations.set(id, registration);
      return registration;
    }
    return undefined;
  }

  async getRegistrationStats(): Promise<{
    total: number;
    thisMonth: number;
    byMonth: number[];
    byCourse: { course: string; count: number; }[];
  }> {
    const registrations = Array.from(this.registrations.values());
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get registrations from this month
    const thisMonth = registrations.filter(reg => {
      const regDate = new Date(reg.registrationDate);
      return regDate.getMonth() === currentMonth && regDate.getFullYear() === currentYear;
    }).length;

    // Get registrations by month (last 12 months)
    const byMonth = Array(12).fill(0);
    registrations.forEach(reg => {
      const regDate = new Date(reg.registrationDate);
      const monthDiff = (currentYear - regDate.getFullYear()) * 12 + (currentMonth - regDate.getMonth());
      if (monthDiff >= 0 && monthDiff < 12) {
        byMonth[11 - monthDiff]++;
      }
    });

    // Get registrations by course
    const courseMap = new Map<string, number>();
    registrations.forEach(reg => {
      courseMap.set(reg.courseId, (courseMap.get(reg.courseId) || 0) + 1);
    });
    
    const byCourse = Array.from(courseMap.entries()).map(([courseId, count]) => {
      const course = this.courses.get(courseId);
      return {
        course: course?.title || courseId,
        count
      };
    });

    return {
      total: registrations.length,
      thisMonth,
      byMonth,
      byCourse
    };
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactId++;
    const newMessage: ContactMessage = {
      ...message,
      id,
      createdAt: new Date()
    };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  private generateCourseId(title: string): string {
    // Convert title to lowercase and replace spaces/special chars with hyphens
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Add a unique timestamp suffix
    const timestamp = Date.now().toString(36);
    
    return `${baseSlug}-${timestamp}`;
  }
  
  async createCourse(course: InsertCourse): Promise<Course> {
    const courseId = course.id || this.generateCourseId(course.title);
    const newCourse: Course = {
      ...course,
      id: courseId,
      enrolled: course.enrolled || 0,
      imageUrl: course.imageUrl || null
    };
    this.courses.set(courseId, newCourse);
    return newCourse;
  }

async updateCourse(id: string, courseData: Partial<InsertCourse>): Promise<{ course?: Course; error?: any }> {
  const { data, error } = await supabase
    .from('courses')
    .update(courseData)
    .eq('slug', id) // or 'id' if you're matching ID
    .select()
    .single();

  if (error) return { error };
  if (!data) return { error: "No course found matching the given identifier" };

  return { course: data as Course };
}



  async deleteCourse(id: string): Promise<boolean> {
    return this.courses.delete(id);
  }

  async updateCourseEnrollment(id: string, increment: number): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (course) {
      course.enrolled += increment;
      this.courses.set(id, course);
      return course;
    }
    return undefined;
  }

  // Banner operations
  async getBanners(): Promise<Banner[]> {
    return Array.from(this.banners.values())
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getBannerById(id: number): Promise<Banner | undefined> {
    return this.banners.get(id);
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const id = this.currentBannerId++;
    const newBanner: Banner = {
      ...banner,
      id,
      subtitle: banner.subtitle || null,
      linkUrl: banner.linkUrl || null,
      linkText: banner.linkText || null,
      isActive: banner.isActive !== undefined ? banner.isActive : true,
      displayOrder: banner.displayOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.banners.set(id, newBanner);
    return newBanner;
  }

  async updateBanner(id: number, banner: Partial<InsertBanner>): Promise<Banner | undefined> {
    const existingBanner = this.banners.get(id);
    if (existingBanner) {
      const updatedBanner: Banner = {
        ...existingBanner,
        ...banner,
        updatedAt: new Date()
      };
      this.banners.set(id, updatedBanner);
      return updatedBanner;
    }
    return undefined;
  }

  async deleteBanner(id: number): Promise<boolean> {
    return this.banners.delete(id);
  }

  // Website settings operations
  async getWebsiteSettings(): Promise<WebsiteSetting[]> {
    return Array.from(this.websiteSettings.values());
  }

  async getWebsiteSettingByKey(key: string): Promise<WebsiteSetting | undefined> {
    return this.websiteSettings.get(key);
  }

  async createWebsiteSetting(setting: InsertWebsiteSetting): Promise<WebsiteSetting> {
    const id = this.currentWebsiteSettingId++;
    const newSetting: WebsiteSetting = {
      ...setting,
      id,
      description: setting.description || null,
      updatedAt: new Date()
    };
    this.websiteSettings.set(setting.key, newSetting);
    return newSetting;
  }

  async updateWebsiteSetting(key: string, value: string): Promise<WebsiteSetting | undefined> {
    const existingSetting = this.websiteSettings.get(key);
    if (existingSetting) {
      const updatedSetting: WebsiteSetting = {
        ...existingSetting,
        value,
        updatedAt: new Date()
      };
      this.websiteSettings.set(key, updatedSetting);
      return updatedSetting;
    }
    return undefined;
  }
}

import { SupabaseStorage } from './supabase-storage';

// Use Supabase storage in production, fallback to memory storage for development
const useSupabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;

export const storage = useSupabase ? new SupabaseStorage() : new MemStorage();
