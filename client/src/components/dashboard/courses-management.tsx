import { useState } from "react";
// Helper to generate a unique course ID from title
function generateCourseId(title: string) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const unique = Date.now().toString().slice(-6); // last 6 digits of timestamp
  return `${slug}-${unique}`;
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Course, insertCourseSchema } from "@shared/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type CourseFormValues = z.infer<typeof insertCourseSchema>;

export default function CoursesManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(insertCourseSchema),
    defaultValues: {
      id: "",
      title: "",
      description: "",
      level: "Beginner",
      duration: "",
      price: "",
      enrolled: 0,
      imageUrl: "",
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async (data: CourseFormValues) => {
      return apiRequest("POST", "/api/courses", data);
    },
    onSuccess: () => {
      toast({
        title: "Course created successfully",
        description: "The new course has been added to the catalog.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      form.reset();
      setIsAddDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Failed to create course",
        description: "There was an error creating the course. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CourseFormValues> }) => {
      // Transform imageUrl to image_url for the API
      const transformedData = {
        ...data,
        imageUrl: data.imageUrl // Keep imageUrl for the API which will map it correctly
      };
      return apiRequest("PATCH", `/api/courses/${id}`, transformedData);
    },
    onSuccess: () => {
      toast({
        title: "Course updated successfully",
        description: "The course information has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setEditingCourse(null);
    },
    onError: () => {
      toast({
        title: "Failed to update course",
        description: "There was an error updating the course. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/courses/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Course deleted successfully",
        description: "The course has been removed from the catalog.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: () => {
      toast({
        title: "Failed to delete course",
        description: "There was an error deleting the course. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CourseFormValues) => {
    // Ensure price is always a string
    const fixedData = { ...data, price: String(data.price) };
    if (editingCourse) {
      updateCourseMutation.mutate({ id: editingCourse.id, data: fixedData });
    } else {
      // Auto-generate unique ID if not provided
      const id = data.id?.trim() ? data.id : generateCourseId(data.title);
      createCourseMutation.mutate({ ...fixedData, id });
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    form.reset({
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level,
      duration: course.duration,
      price: course.price,
      enrolled: course.enrolled,
      imageUrl: course.imageUrl || "",
    });
  };

  const handleDelete = (id: string) => {
    deleteCourseMutation.mutate(id);
  };

  const handleAddNew = () => {
    setEditingCourse(null);
    form.reset({
      id: "",
      title: "",
      description: "",
      level: "Beginner",
      duration: "",
      price: "",
      enrolled: 0,
      imageUrl: "",
    });
    setIsAddDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading courses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Course Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" /> Add New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <CourseForm form={form} onSubmit={onSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-md shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Enrolled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No courses found. Add your first course to get started.
                  </TableCell>
                </TableRow>
              ) : (
                courses?.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-mono text-xs">{course.id}</TableCell>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.level}</TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>₹{course.price}</TableCell>
                    <TableCell>{course.enrolled}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(course)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Course</DialogTitle>
                          </DialogHeader>
                          <CourseForm form={form} onSubmit={onSubmit} isEditing />
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Course</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this course? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(course.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

interface CourseFormProps {
  form: any;
  onSubmit: (data: CourseFormValues) => void;
  isEditing?: boolean;
}

function CourseForm({ form, onSubmit, isEditing = false }: CourseFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course ID *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., gis-fundamentals" 
                    disabled={isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Course title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Course description"
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Specialized">Specialized</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 40 hours" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 299.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="enrolled"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enrolled Students</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="URL to course image" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">{isEditing ? "Update" : "Create"} Course</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}