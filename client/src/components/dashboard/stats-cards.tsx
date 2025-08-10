import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Book, DollarSign, TrendingUp, ArrowUp } from "lucide-react";

interface DashboardStats {
  totalRegistrations: number;
  thisMonthRegistrations: number;
  activeCourses: number;
  revenue: number;
  completionRate: number;
}

interface StatsCardsProps {
  stats?: DashboardStats;
  loading: boolean;
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 sm:p-6">
              <div className="h-12 sm:h-16 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Registrations",
      value: stats.totalRegistrations.toLocaleString(),
      change: `+${Math.round(((stats.thisMonthRegistrations / stats.totalRegistrations) * 100))}% from last month`,
      icon: GraduationCap,
      bgColor: "bg-primary-100",
      iconColor: "text-primary-600",
    },
    {
      title: "Active Courses",
      value: stats.activeCourses.toString(),
      change: "2 new this month",
      icon: Book,
      bgColor: "bg-secondary-100",
      iconColor: "text-secondary-600",
    },
    {
      title: "Monthly Revenue",
      value: `$${(stats.revenue ?? 0).toLocaleString()}`,
      change: "+8% from last month",
      icon: DollarSign,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      change: "+3% from last month",
      icon: TrendingUp,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="shadow-lg border border-slate-200 h-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">{card.title}</p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900">{card.value}</p>
                  <p className="text-xs sm:text-sm text-green-600 mt-1 truncate">
                    <ArrowUp className="inline h-3 w-3 mr-1" />
                    {card.change}
                  </p>
                </div>
                <div className={`${card.bgColor} rounded-lg p-2 sm:p-3 flex-shrink-0 ml-2`}>
                  <Icon className={`${card.iconColor} h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
