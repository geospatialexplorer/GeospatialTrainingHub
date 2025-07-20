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

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow duration-300 card-hover">
      {course.imageUrl && (
        <img 
          src={course.imageUrl} 
          alt={course.title} 
          className="w-full h-48 object-cover rounded-t-xl" 
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
          <span className="text-amber-500 font-semibold">${course.price}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{course.title}</h3>
        <p className="text-slate-600 mb-4">{course.description}</p>
        <div className="flex items-center text-sm text-slate-500 mb-4">
          <Clock className="h-4 w-4 mr-2" />
          <span>{course.duration}</span>
          <Users className="h-4 w-4 ml-4 mr-2" />
          <span>{course.enrolled} enrolled</span>
        </div>
        <Button 
          onClick={onEnroll}
          className="w-full bg-primary text-white hover:bg-primary-700"
        >
          Enroll Now
        </Button>
      </div>
    </div>
  );
}
