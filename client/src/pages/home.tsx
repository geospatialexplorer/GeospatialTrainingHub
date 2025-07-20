import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import CoursesSection from "@/components/sections/courses-section";
import ContactSection from "@/components/sections/contact-section";
import RegistrationModal from "@/components/modals/registration-modal";
import AdminLoginModal from "@/components/modals/admin-login-modal";

export default function HomePage() {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  const handleEnrollCourse = (courseId: string) => {
    setSelectedCourse(courseId);
    setShowRegistrationModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden">
      <Navbar 
        onShowRegistration={() => setShowRegistrationModal(true)}
        onShowAdminLogin={() => setShowAdminLoginModal(true)}
      />
      
      <main className="w-full">
        <HeroSection onShowRegistration={() => setShowRegistrationModal(true)} />
        
        {/* Stats Section */}
        <section className="bg-white py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center p-4">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">2,500+</div>
                <div className="text-sm sm:text-base text-slate-600">Students Trained</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm sm:text-base text-slate-600">Expert Courses</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">25+</div>
                <div className="text-sm sm:text-base text-slate-600">Expert Instructors</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-sm sm:text-base text-slate-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </section>

        <AboutSection />
        <CoursesSection onEnrollCourse={handleEnrollCourse} />
        <ContactSection />
      </main>

      <Footer />

      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        selectedCourse={selectedCourse}
      />

      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
      />
    </div>
  );
}
