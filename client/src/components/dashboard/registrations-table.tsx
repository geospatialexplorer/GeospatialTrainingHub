import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Registration } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Download, Eye, Edit } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

interface RegistrationsTableProps {
  registrations?: Registration[];
  loading: boolean;
}

export default function RegistrationsTable({ registrations, loading }: RegistrationsTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [viewData, setViewData] = useState<Registration | null>(null);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/registrations/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Status updated successfully" });
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

  // Export current registrations to Excel
  const handleExportExcel = () => {
    if (!registrations || registrations.length === 0) {
      toast({ title: "No registrations to export" });
      return;
    }

    const excelData = registrations.map(reg => ({
      Name: `${reg.first_name} ${reg.last_name}`,
      Email: reg.email,
      Phone: reg.phone,
      Country: reg.country,
      Course: reg.course_id,
      Experience: reg.experience_level,
      Goals: reg.goals,
      Newsletter: reg.newsletter ? "Yes" : "No",
      "Agreed to Terms": reg.agree_terms ? "Yes" : "No",
      Status: reg.status,
      "Registration Date": new Date(reg.registration_date).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, "registrations.xlsx");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-amber-100 text-amber-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  if (loading) {
    return (
        <Card className="shadow-lg border border-slate-200">
          <CardHeader><CardTitle>Recent Registrations</CardTitle></CardHeader>
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
      <>
        <Card className="shadow-lg border border-slate-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <CardTitle className="text-base sm:text-lg font-semibold text-slate-900">
                Recent Registrations
              </CardTitle>
              <Button
                  onClick={handleExportExcel}
                  className="bg-primary text-white hover:bg-primary-700 w-full sm:w-auto"
                  size="sm"
                  disabled={!registrations || registrations.length === 0}
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" /> Export Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!registrations || registrations.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No registrations found.</div>
            ) : (
                <div className="overflow-x-auto">
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
                            <TableCell>{registration.first_name} {registration.last_name}</TableCell>
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
                                <Button size="sm" variant="ghost" className="text-primary" onClick={() => setViewData(registration)}>
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
            )}
          </CardContent>
        </Card>

        {/* View Modal */}
        <Dialog open={!!viewData} onOpenChange={() => setViewData(null)}>
          <DialogContent className="max-w-md sm:max-w-lg p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-slate-900">
                Registration Details
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Full details for <span className="font-medium">{viewData?.first_name} {viewData?.last_name}</span>
              </DialogDescription>
            </DialogHeader>

            {viewData && (
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div>
                      <dt className="font-medium text-slate-600">Email</dt>
                      <dd className="text-slate-900 break-all">{viewData.email}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">Phone</dt>
                      <dd className="text-slate-900">{viewData.phone}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">Country</dt>
                      <dd className="text-slate-900">{viewData.country}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">Course ID</dt>
                      <dd className="text-slate-900">{viewData.course_id}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">Experience</dt>
                      <dd className="capitalize">{viewData.experience_level}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-medium text-slate-600">Goals</dt>
                      <dd className="text-slate-900">{viewData.goals}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">Newsletter</dt>
                      <dd>{viewData.newsletter ? "✅ Yes" : "❌ No"}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">Agreed to Terms</dt>
                      <dd>{viewData.agree_terms ? "✅ Yes" : "❌ No"}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-600">Status</dt>
                      <dd>
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                            viewData.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : viewData.status === "pending"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-red-100 text-red-800"
                        }`}
                    >
                      {viewData.status}
                    </span>
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="font-medium text-slate-600">Registration Date</dt>
                      <dd>{new Date(viewData.registration_date).toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
            )}
          </DialogContent>
        </Dialog>
      </>
  );
}
