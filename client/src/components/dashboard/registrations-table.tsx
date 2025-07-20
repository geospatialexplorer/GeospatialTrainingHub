import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Registration } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Download, Eye, Edit } from "lucide-react";

interface RegistrationsTableProps {
  registrations?: Registration[];
  loading: boolean;
}

export default function RegistrationsTable({ registrations, loading }: RegistrationsTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/registrations/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update status",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleExport = () => {
    // Simple CSV export
    if (!registrations || registrations.length === 0) return;

    const csvHeaders = ["Name", "Email", "Course", "Registration Date", "Status"];
    const csvData = registrations.map(reg => [
      `${reg.firstName} ${reg.lastName}`,
      reg.email,
      reg.courseId,
      new Date(reg.registrationDate).toLocaleDateString(),
      reg.status
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <Card className="shadow-lg border border-slate-200">
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border border-slate-200">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-slate-900">Recent Registrations</CardTitle>
          <Button
            onClick={handleExport}
            className="bg-primary text-white hover:bg-primary-700"
            disabled={!registrations || registrations.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!registrations || registrations.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No registrations found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                          <span className="text-primary-600 font-medium text-sm">
                            {getInitials(registration.firstName, registration.lastName)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">
                            {registration.firstName} {registration.lastName}
                          </div>
                          <div className="text-sm text-slate-500">
                            {registration.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-slate-900">{registration.courseId}</div>
                      <div className="text-sm text-slate-500 capitalize">{registration.experienceLevel}</div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(registration.registrationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(registration.status)} hover:${getStatusColor(registration.status)}`}>
                        {registration.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="text-primary hover:text-primary-700">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-amber-600 hover:text-amber-700"
                          onClick={() => {
                            const newStatus = registration.status === "pending" ? "confirmed" : "pending";
                            handleStatusChange(registration.id, newStatus);
                          }}
                          disabled={updateStatusMutation.isPending}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
