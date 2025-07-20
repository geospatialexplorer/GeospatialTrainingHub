import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStats {
  registrationTrends: number[];
  coursePopularity: { course: string; count: number }[];
}

interface ChartsProps {
  stats?: DashboardStats;
  loading: boolean;
}

export default function Charts({ stats, loading }: ChartsProps) {
  const registrationChartRef = useRef<HTMLCanvasElement>(null);
  const courseChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!stats || loading) return;

    // Load Chart.js dynamically
    import('chart.js/auto').then((Chart) => {
      // Registration trends chart
      if (registrationChartRef.current) {
        const ctx = registrationChartRef.current.getContext('2d');
        if (ctx) {
          new Chart.default(ctx, {
            type: 'bar',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [{
                label: 'Registrations',
                data: stats.registrationTrends,
                backgroundColor: 'hsl(207, 90%, 54%)',
                borderRadius: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        }
      }

      // Course popularity chart
      if (courseChartRef.current && stats.coursePopularity.length > 0) {
        const ctx = courseChartRef.current.getContext('2d');
        if (ctx) {
          new Chart.default(ctx, {
            type: 'doughnut',
            data: {
              labels: stats.coursePopularity.map(item => item.course),
              datasets: [{
                data: stats.coursePopularity.map(item => item.count),
                backgroundColor: [
                  'hsl(207, 90%, 54%)',
                  'hsl(174, 83%, 39%)',
                  'hsl(38, 92%, 50%)',
                  'hsl(0, 84%, 60%)',
                  'hsl(142, 76%, 36%)',
                  'hsl(262, 83%, 58%)'
                ]
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }
          });
        }
      }
    });
  }, [stats, loading]);

  if (loading || !stats) {
    return (
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <Card className="animate-pulse">
          <CardHeader>
            <CardTitle>Registration Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-slate-200 rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <CardTitle>Course Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-slate-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 mb-8">
      <Card className="shadow-lg border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Registration Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <canvas ref={registrationChartRef}></canvas>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Course Popularity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <canvas ref={courseChartRef}></canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
