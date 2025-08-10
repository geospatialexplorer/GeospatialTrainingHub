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

interface RegistrationFilters {
  startDate?: string; // ISO date string
  endDate?: string;   // ISO date string
}

export class SupabaseStorage implements IStorage {
  // ------------------ User operations ------------------
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

  // ------------------ Registration operations ------------------
  async createRegistration(registration: InsertRegistration): Promise<Registration> {
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

    return {
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
    } as Registration;
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

  async getRegistrationStats(
      filters: { startDate?: string; endDate?: string } = {}
  ): Promise<{
    total: number;
    thisMonth: number;
    byMonth: number[];
    byCourse: { course: string; count: number }[];
  }> {
    const applyDateFilters = (query: any) => {
      if (filters.startDate) query = query.gte('registration_date', filters.startDate);
      if (filters.endDate) query = query.lte('registration_date', filters.endDate);
      return query;
    };

    // 1️⃣ Total registrations with filters
    const { count: total, error: totalError } = await applyDateFilters(
        supabase.from('registrations').select('*', { count: 'exact', head: true })
    );
    if (totalError) throw new Error(`Failed to get total registrations: ${totalError.message}`);

    // 2️⃣ This month’s registrations (filtered by start of this month to now)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const { count: thisMonth, error: thisMonthError } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .gte('registration_date', startOfMonth.toISOString());
    if (thisMonthError) throw new Error(`Failed to get this month's registrations: ${thisMonthError.message}`);

    // 3️⃣ Monthly data - last 12 months (ignore filters here or apply startDate if you want)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const { data: monthlyData, error: monthlyError } = await applyDateFilters(
        supabase.from('registrations').select('registration_date')
    ).gte('registration_date', twelveMonthsAgo.toISOString());
    if (monthlyError) throw new Error(`Failed to get monthly registrations: ${monthlyError.message}`);

    const byMonth = Array(12).fill(0);
    monthlyData?.forEach((reg) => {
      const regDate = new Date(reg.registration_date);
      const monthDiff =
          new Date().getFullYear() * 12 + new Date().getMonth() -
          (regDate.getFullYear() * 12 + regDate.getMonth());
      if (monthDiff >= 0 && monthDiff < 12) {
        byMonth[11 - monthDiff]++;
      }
    });

    // 4️⃣ Registrations by course
    const { data: courseData, error: courseError } = await applyDateFilters(
        supabase.from('registrations').select('course_id')
    ).gte('registration_date', twelveMonthsAgo.toISOString());
    if (courseError) throw new Error(`Failed to get course registrations: ${courseError.message}`);

    const courseMap = new Map<string, number>();
    courseData?.forEach((reg) => {
      courseMap.set(reg.course_id, (courseMap.get(reg.course_id) || 0) + 1);
    });

    const courseIds = Array.from(courseMap.keys());
    const { data: courseInfo, error: coursesError } = await supabase
        .from('courses')
        .select('id, title')
        .in('id', courseIds);
    if (coursesError) throw new Error(`Failed to get courses: ${coursesError.message}`);

    const byCourse = Array.from(courseMap.entries()).map(([courseId, count]) => {
      const course = courseInfo?.find((c) => c.id === courseId);
      return {
        course: course?.title || courseId,
        count,
      };
    });

    return {
      total: total || 0,
      thisMonth: thisMonth || 0,
      byMonth,
      byCourse,
    };
  }



  // ------------------ Contact message operations ------------------
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

  // ------------------ Course operations ------------------
  async getCourses(filter?: { is_active?: boolean }): Promise<Course[]> {
    let query = supabase.from('courses').select('*').order('title');
    if (filter?.is_active !== undefined) {
      query = query.eq('is_active', filter.is_active);
    }
    const { data, error } = await query;
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
    const dbCourse = { ...course, image_url: course.imageUrl };
    delete (dbCourse as any).imageUrl;

    const { data, error } = await supabase
        .from('courses')
        .insert(dbCourse)
        .select()
        .single();
    if (error || !data) throw new Error(`Failed to create course: ${error?.message || 'Unknown error'}`);
    return data as Course;
  }

  async updateCourse(courseId: string, course: Partial<InsertCourse>): Promise<Course | undefined> {
    // Map camelCase keys to snake_case DB column names
    const dbCourse: any = {
      ...course,
      imageUrl: course.imageUrl,
      details_url: course.detailsUrl,
    };

    // Remove camelCase keys so they don’t conflict
    delete dbCourse.imageUrl;
    delete dbCourse.detailsUrl;

    const { data, error } = await supabase
        .from('courses')
        .update(dbCourse)
        .eq('id', courseId)
        .select()
        .single();

    if (error || !data) throw new Error(`Failed to update course: ${error?.message || 'Unknown error'}`);
    return data as Course;
  }

  async deleteCourse(courseId: string): Promise<boolean> {
    const { error } = await supabase
        .from('courses')
        .update({ is_active: false })
        .eq('id', courseId);

    return !error;
  }




  // ------------------ Banner operations ------------------
  async getBanners(): Promise<Banner[]> {
    const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('position');
    if (error) throw new Error(`Failed to fetch banners: ${error.message}`);
    return data as Banner[];
  }

  async getBannerById(id: string): Promise<Banner | undefined> {
    const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('id', id)
        .single();
    if (error || !data) return undefined;
    return data as Banner;
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const { data, error } = await supabase
        .from('banners')
        .insert(banner)
        .select()
        .single();
    if (error) throw new Error(`Failed to create banner: ${error.message}`);
    return data as Banner;
  }

  async updateBanner(id: string, banner: Partial<InsertBanner>): Promise<Banner | undefined> {
    const { data, error } = await supabase
        .from('banners')
        .update(banner)
        .eq('id', id)
        .select()
        .single();
    if (error || !data) return undefined;
    return data as Banner;
  }

  async deleteBanner(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);
    if (error) throw new Error(`Failed to delete banner: ${error.message}`);
    return true;
  }

  // ------------------ Website settings operations ------------------
  async getWebsiteSettings(): Promise<WebsiteSetting[]> {
    const { data, error } = await supabase
        .from('website_settings')
        .select('*');
    if (error) throw new Error(`Failed to fetch website settings: ${error.message}`);
    return data as WebsiteSetting[];
  }

  async getWebsiteSettingById(id: string): Promise<WebsiteSetting | undefined> {
    const { data, error } = await supabase
        .from('website_settings')
        .select('*')
        .eq('id', id)
        .single();
    if (error || !data) return undefined;
    return data as WebsiteSetting;
  }

  async updateWebsiteSetting(id: string, setting: Partial<InsertWebsiteSetting>): Promise<WebsiteSetting | undefined> {
    const { data, error } = await supabase
        .from('website_settings')
        .update(setting)
        .eq('id', id)
        .select()
        .single();
    if (error || !data) return undefined;
    return data as WebsiteSetting;
  }
}
