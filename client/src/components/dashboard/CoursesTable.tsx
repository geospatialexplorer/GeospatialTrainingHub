import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Course {
    id: string;
    title: string;
    level: string;
    duration: string;
    price: string | number;
    enrolled: number;
    detailsUrl?: string;
}

interface Props {
    courses?: Course[];
    onEdit: (course: Course) => void;
    onDelete: (id: string) => void;
    pageSize?: number;
}

const CoursesTable: React.FC<Props> = ({
                                           courses = [],
                                           onEdit,
                                           onDelete,
                                           pageSize = 5,
                                       }) => {
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(courses.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const currentPageCourses = courses.slice(startIndex, startIndex + pageSize);

    return (
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
                            <TableHead>Details</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                                    No courses found. Add your first course to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentPageCourses.map((course) => (
                                <TableRow key={course.id}>
                                    <TableCell className="font-mono text-xs">{course.id}</TableCell>
                                    <TableCell className="font-medium">{course.title}</TableCell>
                                    <TableCell>{course.level}</TableCell>
                                    <TableCell>{course.duration}</TableCell>
                                    <TableCell>₹{course.price}</TableCell>
                                    <TableCell>{course.enrolled}</TableCell>
                                    <TableCell>
                                        {course.detailsUrl ? (
                                            <a
                                                href={course.detailsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                View Details
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground">No details</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(course)}
                                            aria-label={`Edit course ${course.title}`}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" aria-label={`Delete course ${course.title}`}>
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
                                                        className="bg-red-500 hover:bg-red-600"
                                                        onClick={() => onDelete(course.id)}
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

            {/* Pagination */}
            {courses.length > pageSize && (
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Previous
                    </Button>
                    <span>
            Page {page} of {totalPages}
          </span>
                    <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default CoursesTable;
