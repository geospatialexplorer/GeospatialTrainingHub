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
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Globe className="text-primary text-2xl mr-2" />
              <span className="font-bold text-xl text-slate-900">GeoSpatial Academy</span>
              <span className="ml-4 px-3 py-1 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                Admin Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-600">Welcome, {currentUser.username}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-600 hover:text-slate-900"
              >
                <LogOut className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setLocation("/")}
                className="bg-primary-600 text-white hover:bg-primary-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Website
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards stats={dashboardStats} loading={statsLoading} />
        
        <div className="mt-8">
          <Charts stats={dashboardStats} loading={statsLoading} />
        </div>

        <div className="mt-8">
          <RegistrationsTable 
            registrations={registrations} 
            loading={registrationsLoading} 
          />
        </div>
      </main>
    </div>
  );
}
