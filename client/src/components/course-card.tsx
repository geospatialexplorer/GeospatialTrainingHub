import { Course } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";

interface CourseCardProps {
  course: Course;
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
  console.log(course,'course')

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
            <span>{course.enrolled} enrolled</span>
          </div>
        </div>
        <Button 
          onClick={onEnroll}
          className="w-full bg-primary text-white hover:bg-primary-700 mt-auto"
          size="sm"
        >
          Enroll Now
        </Button>
      </div>
    </div>
  );
}
