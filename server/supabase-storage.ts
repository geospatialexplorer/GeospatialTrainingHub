import { supabase } from './supabase';
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
import type { IStorage } from './storage';

export class SupabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data as User;
  }

  // Registration operations
  async createRegistration(registration: InsertRegistration): Promise<Registration> {
    // Map camelCase to snake_case for database columns
    const dbRegistration = {
      first_name: registration.firstName,
      last_name: registration.lastName,
      email: registration.email,
      phone: registration.phone,
      country: registration.country,
      course_id: registration.courseId,
      experience_level: registration.experienceLevel,
      goals: registration.goals,
      agree_terms: registration.agreeTerms,
      newsletter: registration.newsletter
    };

    const { data, error } = await supabase
      .from('registrations')
      .insert(dbRegistration)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create registration: ${error.message}`);
    
    // Update course enrollment count
    await this.updateCourseEnrollment(registration.courseId, 1);
    
    // Map snake_case back to camelCase for the response
    const mappedData = {
      id: data.id,
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email,
      phone: data.phone,
      country: data.country,
      courseId: data.course_id,
      experienceLevel: data.experience_level,
      goals: data.goals,
      agreeTerms: data.agree_terms,
      newsletter: data.newsletter,
      status: data.status,
      registrationDate: data.registration_date
    };
    
    return mappedData as Registration;
  }

  async getRegistrations(): Promise<Registration[]> {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('registration_date', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch registrations: ${error.message}`);
    return data as Registration[];
  }

  async getRegistrationById(id: number): Promise<Registration | undefined> {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as Registration;
  }

  async updateRegistrationStatus(id: number, status: string): Promise<Registration | undefined> {
    const { data, error } = await supabase
      .from('registrations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    return data as Registration;
  }

  async getRegistrationStats(): Promise<{
    total: number;
    thisMonth: number;
    byMonth: number[];
    byCourse: { course: string; count: number; }[];
  }> {
    // Get total registrations
    const { count: total, error: totalError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true });
    
    if (totalError) throw new Error(`Failed to get total registrations: ${totalError.message}`);

    // Get this month's registrations
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const { count: thisMonth, error: thisMonthError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .gte('registration_date', startOfMonth.toISOString());
    
    if (thisMonthError) throw new Error(`Failed to get this month's registrations: ${thisMonthError.message}`);

    // Get registrations by month (last 12 months)
    const byMonth = Array(12).fill(0);
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const { data: monthlyData, error: monthlyError } = await supabase
      .from('registrations')
      .select('registration_date')
      .gte('registration_date', twelveMonthsAgo.toISOString());

    if (monthlyError) throw new Error(`Failed to get monthly registrations: ${monthlyError.message}`);

    // Process monthly data
    monthlyData?.forEach(reg => {
      const regDate = new Date(reg.registration_date);
      const monthDiff = (new Date().getFullYear() - regDate.getFullYear()) * 12 + 
                       (new Date().getMonth() - regDate.getMonth());
      if (monthDiff >= 0 && monthDiff < 12) {
        byMonth[11 - monthDiff]++;
      }
    });

    // Get registrations by course
    const { data: courseData, error: courseError } = await supabase
      .from('registrations')
      .select('course_id')
      .gte('registration_date', twelveMonthsAgo.toISOString());

    if (courseError) throw new Error(`Failed to get course registrations: ${courseError.message}`);

    const courseMap = new Map<string, number>();
    courseData?.forEach(reg => {
      courseMap.set(reg.course_id, (courseMap.get(reg.course_id) || 0) + 1);
    });

    // Get course titles
    const courseIds = Array.from(courseMap.keys());
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title')
      .in('id', courseIds);

    if (coursesError) throw new Error(`Failed to get courses: ${coursesError.message}`);

    const byCourse = Array.from(courseMap.entries()).map(([courseId, count]) => {
      const course = courses?.find(c => c.id === courseId);
      return {
        course: course?.title || courseId,
        count
      };
    });

    return {
      total: total || 0,
      thisMonth: thisMonth || 0,
      byMonth,
      byCourse
    };
  }

  // Contact message operations
  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(message)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create contact message: ${error.message}`);
    return data as ContactMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch contact messages: ${error.message}`);
    return data as ContactMessage[];
  }

  // Course operations
  async getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('title');
    
    if (error) throw new Error(`Failed to fetch courses: ${error.message}`);
    return data as Course[];
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as Course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .insert(course)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase createCourse error:', error);
      throw new Error(`Failed to create course: ${error.message}`);
    }
    return data as Course;
  }

  async updateCourse(id: string, courseData: Partial<InsertCourse>): Promise<Course | undefined> {
    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    return data as Course;
  }

  async deleteCourse(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  async updateCourseEnrollment(id: string, increment: number): Promise<Course | undefined> {
    // First get current enrollment
    const { data: currentCourse, error: fetchError } = await supabase
      .from('courses')
      .select('enrolled')
      .eq('id', id)
      .single();
    
    if (fetchError || !currentCourse) return undefined;

    // Update enrollment
    const { data, error } = await supabase
      .from('courses')
      .update({ enrolled: currentCourse.enrolled + increment })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    return data as Course;
  }

  // Banner operations
  async getBanners(): Promise<Banner[]> {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order');
    
    if (error) throw new Error(`Failed to fetch banners: ${error.message}`);
    return data as Banner[];
  }

  async getBannerById(id: number): Promise<Banner | undefined> {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as Banner;
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    // Map camelCase to snake_case for database columns
    const dbBanner = {
      title: banner.title,
      subtitle: banner.subtitle || null,
      image_url: banner.imageUrl,
      link_url: banner.linkUrl || null,
      link_text: banner.linkText || null,
      is_active: banner.isActive !== undefined ? banner.isActive : true,
      display_order: banner.displayOrder || 0
    };

    const { data, error } = await supabase
      .from('banners')
      .insert(dbBanner)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create banner: ${error.message}`);
    return data as Banner;
  }

  async updateBanner(id: number, banner: Partial<InsertBanner>): Promise<Banner | undefined> {
    // Map camelCase to snake_case for database columns
    const dbBanner: Record<string, any> = {};
    
    if (banner.title !== undefined) dbBanner.title = banner.title;
    if (banner.subtitle !== undefined) dbBanner.subtitle = banner.subtitle;
    if (banner.imageUrl !== undefined) dbBanner.image_url = banner.imageUrl;
    if (banner.linkUrl !== undefined) dbBanner.link_url = banner.linkUrl;
    if (banner.linkText !== undefined) dbBanner.link_text = banner.linkText;
    if (banner.isActive !== undefined) dbBanner.is_active = banner.isActive;
    if (banner.displayOrder !== undefined) dbBanner.display_order = banner.displayOrder;
    
    // Add updated_at timestamp
    dbBanner.updated_at = new Date();

    const { data, error } = await supabase
      .from('banners')
      .update(dbBanner)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    return data as Banner;
  }

  async deleteBanner(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Website settings operations
  async getWebsiteSettings(): Promise<WebsiteSetting[]> {
    const { data, error } = await supabase
      .from('website_settings')
      .select('*');
    
    if (error) throw new Error(`Failed to fetch website settings: ${error.message}`);
    return data as WebsiteSetting[];
  }

  async getWebsiteSettingByKey(key: string): Promise<WebsiteSetting | undefined> {
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .eq('key', key)
      .single();
    
    if (error || !data) return undefined;
    return data as WebsiteSetting;
  }

  async createWebsiteSetting(setting: InsertWebsiteSetting): Promise<WebsiteSetting> {
    const { data, error } = await supabase
      .from('website_settings')
      .insert(setting)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create website setting: ${error.message}`);
    return data as WebsiteSetting;
  }

  async updateWebsiteSetting(key: string, value: string): Promise<WebsiteSetting | undefined> {
    const { data, error } = await supabase
      .from('website_settings')
      .update({ value, updated_at: new Date() })
      .eq('key', key)
      .select()
      .single();
    
    if (error || !data) return undefined;
    return data as WebsiteSetting;
  }
}