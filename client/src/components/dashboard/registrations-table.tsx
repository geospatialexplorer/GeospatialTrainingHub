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

  console.log(registrations,'registrations')

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
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase();
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <CardTitle className="text-base sm:text-lg font-semibold text-slate-900">Recent Registrations</CardTitle>
          <Button
            onClick={handleExport}
            className="bg-primary text-white hover:bg-primary-700 w-full sm:w-auto"
            size="sm"
            disabled={!registrations || registrations.length === 0}
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
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
            <>
              {/* Mobile View */}
              <div className="block lg:hidden space-y-4">
                {registrations.map((registration) => (
                    <div key={registration.id} className="p-4 border rounded-lg bg-white shadow-sm space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">
                            {registration.first_name} {registration.last_name}
                          </div>
                          <div className="text-xs text-slate-500 truncate">{registration.email}</div>
                        </div>
                        <Badge className={`${getStatusColor(registration.status)} text-xs`}>
                          {registration.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-500">Course:</span>
                          <div className="text-slate-900 font-medium">{registration.course_id}</div>
                        </div>
                        <div>
                          <span className="text-slate-500">Date:</span>
                          <div className="text-slate-900 font-medium">
                            {new Date(registration.registration_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="text-primary flex-1">
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-amber-600 flex-1"
                            onClick={() => {
                              const newStatus = registration.status === "pending" ? "confirmed" : "pending";
                              handleStatusChange(registration.id, newStatus);
                            }}
                            disabled={updateStatusMutation.isPending}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      </div>
                    </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell>
                            {registration.first_name} {registration.last_name}
                          </TableCell>
                          <TableCell>{registration.email}</TableCell>
                          <TableCell>{registration.course_id}</TableCell>
                          <TableCell className="capitalize">{registration.experience_level}</TableCell>
                          <TableCell>{new Date(registration.registration_date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(registration.status)} text-xs`}>
                              {registration.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="ghost" className="text-primary">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-amber-600"
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
            </>
        )}
      </CardContent>

    </Card>
  );
}
