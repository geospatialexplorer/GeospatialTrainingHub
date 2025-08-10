import React, { useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import CoursesTable from "@/components/dashboard/CoursesTable.tsx";

function generateCourseId(title: string) {
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const unique = Date.now().toString().slice(-6);
    return `${slug}-${unique}`;
}

type CourseFormValues = z.infer<typeof insertCourseSchema> & {
    detailsUrl?: string;
};

export default function CoursesManagement() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    const { data: courses = [], isLoading } = useQuery<Course[]>({
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
            detailsUrl: "",
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
            queryClient.invalidateQueries(["/api/courses"]);
            queryClient.invalidateQueries(["/api/dashboard/stats"]);
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
        mutationFn: async ({
                               id,
                               data,
                           }: {
            id: string;
            data: Partial<CourseFormValues>;
        }) => {
            return apiRequest("PATCH", `/api/courses/${id}`, data);
        },
        onSuccess: () => {
            toast({
                title: "Course updated successfully",
                description: "The course information has been updated.",
            });
            queryClient.invalidateQueries(["/api/courses"]);
            queryClient.invalidateQueries(["/api/dashboard/stats"]);
            setEditingCourse(null);
            setIsAddDialogOpen(false);
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
            queryClient.invalidateQueries(["/api/courses"]);
            queryClient.invalidateQueries(["/api/dashboard/stats"]);
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
        if (editingCourse) {
            updateCourseMutation.mutate({ id: editingCourse.id, data });
        } else {
            const id = data.id?.trim() ? data.id : generateCourseId(data.title);
            createCourseMutation.mutate({ ...data, id });
        }
    };

    const handleEdit = (course: Course) => {
        setEditingCourse(course);
        setIsAddDialogOpen(true);
        form.reset({
            id: course.id,
            title: course.title,
            description: course.description,
            level: course.level,
            duration: course.duration,
            price: course.price,
            enrolled: course.enrolled,
            imageUrl: course.imageUrl || "",
            detailsUrl: (course as any).detailsUrl || "",
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
            detailsUrl: "",
        });
        setIsAddDialogOpen(true);
    };

    if (isLoading) {
        return <div className="text-center py-10">Loading courses...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="p-2">
                    <div className="mb-2 font-semibold text-gray-700">
                        Total Courses: {courses.length}
                    </div>
                </div>
                {/* Button outside DialogTrigger to prevent double toggling */}
                <Button onClick={handleAddNew}>
                    <Plus className="h-4 w-4 mr-2" /> Add New Course
                </Button>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
                        </DialogHeader>
                        <CourseForm form={form} onSubmit={onSubmit} isEditing={!!editingCourse} />
                    </DialogContent>
                </Dialog>
            </div>

            <CoursesTable
                courses={courses}
                onEdit={handleEdit}
                onDelete={handleDelete}
                pageSize={5}
            />
        </div>
    );
}

interface CourseFormProps {
    form: ReturnType<typeof useForm<CourseFormValues>>;
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
                                    <Input {...field} placeholder="e.g., gis-fundamentals" disabled={isEditing} />
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
                                <Textarea {...field} placeholder="Course description" className="min-h-[100px]" />
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
                                <Select value={field.value} onValueChange={field.onChange}>
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
                                    <Input {...field} placeholder="e.g., 299.00" type="number" step="0.01" min="0" />
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
                                <FormLabel>Seat Availability *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        {...field}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            field.onChange(val === "" ? "" : Math.max(0, Number(val)));
                                        }}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="detailsUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Course Details URL</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Link to course details (e.g., Google Doc, Drive)" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                                <div className="space-y-2">
                                    <Input {...field} placeholder="URL to course image" />
                                    {field.value && (
                                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200">
                                            <img
                                                src={field.value}
                                                alt="Course preview"
                                                className="object-cover w-full h-full"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/placeholder-image.jpg";
                                                    e.currentTarget.alt = "Failed to load image";
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
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
