import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import StatsCards from "@/components/dashboard/stats-cards";
import Charts from "@/components/dashboard/charts";
import RegistrationsTable from "@/components/dashboard/registrations-table";
import { ArrowLeft, Globe, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  
  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: !!currentUser,
  });

  const { data: registrations, isLoading: registrationsLoading } = useQuery({
    queryKey: ["/api/registrations"],
    enabled: !!currentUser,
  });

  useEffect(() => {
    if (!userLoading && !currentUser) {
      setLocation("/");
    }
  }, [currentUser, userLoading, setLocation]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setLocation("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center min-w-0 flex-1">
              <Globe className="text-primary text-xl sm:text-2xl mr-2 flex-shrink-0" />
              <span className="font-bold text-lg sm:text-xl text-slate-900 truncate">GeoSpatial Academy</span>
              <span className="hidden sm:inline-block ml-2 lg:ml-4 px-2 sm:px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                Admin Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden md:inline text-sm sm:text-base text-slate-600 truncate max-w-32 lg:max-w-none">
                Welcome, {currentUser.username}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-600 hover:text-slate-900 flex-shrink-0"
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setLocation("/")}
                className="bg-primary-600 text-white hover:bg-primary-700 flex-shrink-0"
                size="sm"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back to Website</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <StatsCards stats={dashboardStats} loading={statsLoading} />
        
        <div className="mt-6 sm:mt-8">
          <Charts stats={dashboardStats} loading={statsLoading} />
        </div>

        <div className="mt-6 sm:mt-8">
          <RegistrationsTable 
            registrations={registrations} 
            loading={registrationsLoading} 
          />
        </div>
      </main>
    </div>
  );
}
