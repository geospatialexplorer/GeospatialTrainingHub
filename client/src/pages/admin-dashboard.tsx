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
import {CalendarIcon} from "lucide-react";

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

  // Date range state
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data: currentUser, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  const { data: dashboardStats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats", startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const res = await fetch(`/api/dashboard/stats?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return res.json();
    },
    enabled: !!currentUser
  });

  const { data: registrations, isLoading: registrationsLoading } = useQuery<Registration[]>({
    queryKey: ["/api/registrations"],
    enabled: !!currentUser,
  });

  // ✅ Set default date range to last 3 months
  useEffect(() => {
    const today = new Date();
    const end = today.toISOString().split("T")[0];
    const start = new Date(today);
    start.setMonth(start.getMonth() - 3); // subtract 3 months
    const startStr = start.toISOString().split("T")[0];

    setStartDate(startStr);
    setEndDate(end);
  }, []);

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
        <Sidebar
            username={currentUser?.username}
            currentSection={currentSection}
            onSectionChange={setCurrentSection}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm border-b border-slate-200 w-full h-16 flex items-center px-4">
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
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

                      {/* Date Range Picker */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white shadow-sm px-3 py-2 rounded-lg border border-slate-200 w-full sm:w-auto">

                        {/* Start Date */}
                        <div className="flex items-center gap-2 border border-slate-300 rounded-md px-2 py-1 w-full sm:w-auto focus-within:border-primary-500 focus-within:ring focus-within:ring-primary-200 transition">
                          <CalendarIcon className="w-4 h-4 text-slate-500" />
                          <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="outline-none bg-transparent text-sm flex-1 min-w-[100px]"
                          />
                        </div>

                        <span className="hidden sm:inline text-slate-500">to</span>

                        {/* End Date */}
                        <div className="flex items-center gap-2 border border-slate-300 rounded-md px-2 py-1 w-full sm:w-auto focus-within:border-primary-500 focus-within:ring focus-within:ring-primary-200 transition">
                          <CalendarIcon className="w-4 h-4 text-slate-500" />
                          <input
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="outline-none bg-transparent text-sm flex-1 min-w-[100px]"
                          />
                        </div>
                      </div>

                    </div>

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
