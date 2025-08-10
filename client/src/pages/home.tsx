import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import CoursesSection from "@/components/sections/courses-section";
import ContactSection from "@/components/sections/contact-section";
import RegistrationModal from "@/components/modals/registration-modal";
import AdminLoginModal from "@/components/modals/admin-login-modal";
import StatsSection from "@/components/sections/StatsSection.tsx";

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
        <StatsSection/>
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
