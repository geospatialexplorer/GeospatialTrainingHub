import { Course } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {Clock, Users, ExternalLink, FileText} from "lucide-react";

interface CourseCardProps {
  course: Course & { detailsUrl?: string }; // assuming detailsUrl may exist
  onEnroll: () => void;
}

export default function CourseCard({ course, onEnroll }: CourseCardProps) {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-primary-100 text-primary-600";
      case "intermediate":
        return "bg-amber-100 text-amber-600";
      case "advanced":
        return "bg-red-100 text-red-600";
      case "specialized":
        return "bg-green-100 text-green-600";
      case "professional":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300 card-hover flex flex-col h-full">
        {course.image_url && (
            <img
                src={course.image_url}
                alt={course.title}
                className="w-full h-48 object-cover rounded-t-xl flex-shrink-0"
            />
        )}
        <div className="p-4 sm:p-6 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-3">
          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
            <span className="text-amber-500 font-semibold text-sm sm:text-base">₹{course.price}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 line-clamp-2">{course.title}</h3>
          <p className="text-sm sm:text-base text-slate-600 mb-4 flex-grow line-clamp-3">{course.description}</p>



          <div className="flex items-center text-xs sm:text-sm text-slate-500 mb-4 flex-wrap gap-2">
            <div className="flex items-center">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span>{course.enrolled} seats available</span>
            </div>
          </div>

          <div className="mt-auto flex gap-4">
            {/* Enroll Button */}
            <Button
                onClick={onEnroll}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold shadow-md transition"
                size="sm"
                aria-label="Enroll Now"
            >
              Enroll Now
            </Button>

            {/* View Details Link */}
            {course.details_url && (
                <a
                    href={course.details_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-md shadow-sm transition"
                    aria-label="View Course Details"
                >
                  <FileText className="h-5 w-5" />
                  <span>View Details</span>
                </a>
            )}
          </div>
        </div>
      </div>
  );
}
