import { Button } from "@/components/ui/button";
import BannerCarousel from "@/components/banner-carousel";

interface HeroSectionProps {
  onShowRegistration: () => void;
}

export default function HeroSection({ onShowRegistration }: HeroSectionProps) {
  const scrollToCourses = () => {
    const element = document.getElementById("courses");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative">
      {/* Banner Carousel */}
      <div className="w-full">
        <BannerCarousel />
      </div>
      
      {/* Static Hero Section (Fallback if no banners) */}
      <div className="relative hero-gradient text-white min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight" role="heading">
              Master <span className="text-amber-400">Geospatial Technology</span> with Expert Training
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-3xl mx-auto lg:mx-0">
              Advance your career with comprehensive GIS, remote sensing, and spatial analysis courses taught by industry professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
              <Button 
                onClick={scrollToCourses}
                className="bg-amber-500 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:bg-amber-600 h-auto w-full sm:w-auto"
              >
                Explore Courses
              </Button>
              <Button 
                variant="outline"
                onClick={onShowRegistration}
                className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:bg-white hover:text-primary bg-transparent h-auto w-full sm:w-auto"
              >
                Start Learning Today
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
