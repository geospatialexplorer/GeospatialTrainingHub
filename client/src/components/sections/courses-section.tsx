import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/course-card";
import { Course } from "@shared/schema";

interface CoursesSectionProps {
  onEnrollCourse: (courseId: string) => void;
}

export default function CoursesSection({ onEnrollCourse }: CoursesSectionProps) {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  if (isLoading) {
    return (
      <section id="courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Professional Geospatial Training Courses
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose from our comprehensive catalog of courses designed to advance your geospatial skills and career prospects.
            </p>
          </div>
          <div className="text-center">Loading courses...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Professional Geospatial Training Courses
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose from our comprehensive catalog of courses designed to advance your geospatial skills and career prospects.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEnroll={() => onEnrollCourse(course.id)} 
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="secondary" 
            className="bg-slate-100 text-slate-700 px-8 py-3 font-semibold hover:bg-slate-200"
          >
            View All Courses <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      </div>
    </section>
  );
}
