import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import StatsCards from "@/components/dashboard/stats-cards";
import Charts from "@/components/dashboard/charts";
import RegistrationsTable from "@/components/dashboard/registrations-table";
import BannersManagement from "@/components/dashboard/banners-management";
import WebsiteSettings from "@/components/dashboard/website-settings";
import CoursesManagement from "@/components/dashboard/courses-management";
import { Registration } from "@shared/schema";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface DashboardStats {
  totalRegistrations: number;
  thisMonthRegistrations: number;
  activeCourses: number;
  revenue: number;
  completionRate: number;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [currentSection, setCurrentSection] = useState("overview");
  
  const { data: currentUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  const { data: dashboardStats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!currentUser,
  });

  const { data: registrations, isLoading: registrationsLoading } = useQuery<Registration[]>({
    queryKey: ["/api/registrations"],
    enabled: !!currentUser,
  });

  useEffect(() => {
    if (!userLoading && !currentUser) {
      setLocation("/");
    }
  }, [currentUser, userLoading, setLocation]);

  if (userLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50 w-full overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        username={currentUser?.username} 
        currentSection={currentSection} 
        onSectionChange={setCurrentSection} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-slate-200 w-full h-16 flex items-center px-4">
          <div className="md:hidden">
            {/* Mobile header content is handled by the Sidebar component */}
          </div>
          <div className="hidden md:block">
            <span className="px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
              Admin Dashboard
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            {currentSection === "overview" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                <StatsCards stats={dashboardStats} loading={statsLoading} />
                <div className="mt-6">
                  <Charts stats={dashboardStats} loading={statsLoading} />
                </div>
              </div>
            )}
            
            {currentSection === "registrations" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Course Registrations</h1>
                <RegistrationsTable 
                  registrations={registrations} 
                  loading={registrationsLoading} 
                />
              </div>
            )}
            
            {currentSection === "courses" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Course Management</h1>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <CoursesManagement />
                </div>
              </div>
            )}
            
            {currentSection === "banners" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Banner Management</h1>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <BannersManagement />
                </div>
              </div>
            )}
            
            {currentSection === "settings" && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">Website Settings</h1>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                  <WebsiteSettings />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
