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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-slate-200 rounded"></div>
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
      value: `$${stats.revenue.toLocaleString()}`,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="shadow-lg border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{card.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                  <p className="text-sm text-green-600 mt-1">
                    <ArrowUp className="inline h-3 w-3 mr-1" />
                    {card.change}
                  </p>
                </div>
                <div className={`${card.bgColor} rounded-lg p-3`}>
                  <Icon className={`${card.iconColor} h-6 w-6`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
