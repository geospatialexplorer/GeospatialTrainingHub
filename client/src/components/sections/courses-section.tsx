import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/course-card";
import { Course } from "@shared/schema";
import { motion } from "framer-motion";

interface CoursesSectionProps {
  onEnrollCourse: (courseId: string) => void;
}

export default function CoursesSection({ onEnrollCourse }: CoursesSectionProps) {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  // Animation variants for staggering cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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
      <section id="courses" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Animated heading & description */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
              Professional Geospatial Training Courses
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Choose from our comprehensive catalog of courses designed to advance your geospatial skills and career prospects.
            </p>
          </motion.div>

          {/* Courses grid with staggered animations */}
          <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
          >
            {courses?.map((course) => (
                <motion.div key={course.id} variants={cardVariants}>
                  <CourseCard
                      course={course}
                      onEnroll={() => onEnrollCourse(course.id)}
                  />
                </motion.div>
            ))}
          </motion.div>

          {/* Animated button */}
          <div className="text-center mt-8 sm:mt-12">
            <Button
                variant="secondary"
                className="bg-slate-100 text-slate-700 px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold hover:bg-slate-200 animate-pulse"
            >
              View All Courses <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </div>
        </div>
      </section>
  );
}
