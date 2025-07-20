import { Button } from "@/components/ui/button";

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
    <section id="home" className="relative hero-gradient text-white">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Master <span className="text-amber-400">Geospatial Technology</span> with Expert Training
          </h1>
          <p className="text-xl lg:text-2xl mb-8 text-blue-100">
            Advance your career with comprehensive GIS, remote sensing, and spatial analysis courses taught by industry professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={scrollToCourses}
              className="bg-amber-500 text-white px-8 py-4 text-lg font-semibold hover:bg-amber-600 h-auto"
            >
              Explore Courses
            </Button>
            <Button 
              variant="outline"
              onClick={onShowRegistration}
              className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-primary bg-transparent h-auto"
            >
              Start Learning Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
