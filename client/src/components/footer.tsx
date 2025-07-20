import { Globe } from "lucide-react";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-slate-900 text-white py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <Globe className="text-primary-400 text-xl sm:text-2xl mr-2 flex-shrink-0" />
              <span className="font-bold text-lg sm:text-xl">
                GeoSpatial Academy
              </span>
            </div>
            <p className="text-slate-400 mb-4 text-sm sm:text-base">
              Empowering professionals with cutting-edge geospatial education
              and training since 2010.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fab fa-linkedin text-lg sm:text-xl"></i>
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fab fa-twitter text-lg sm:text-xl"></i>
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <i className="fab fa-youtube text-lg sm:text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("home")}
                  className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("courses")}
                  className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base text-left"
                >
                  Courses
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
              Popular Courses
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  GIS Fundamentals
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Remote Sensing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Python for GIS
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors text-sm sm:text-base"
                >
                  Web GIS Development
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
              Contact Info
            </h4>
            <div className="space-y-2 text-slate-400 text-sm sm:text-base">
              <p className="flex items-start">
                <i className="fas fa-map-marker-alt mr-2 mt-1 flex-shrink-0"></i>
                <span>123 GeoSpatial Way, CA 94105</span>
              </p>
              <p className="flex items-center">
                <i className="fas fa-phone mr-2 flex-shrink-0"></i>
                <span>+1 (555) 123-4567</span>
              </p>
              <p className="flex items-start">
                <i className="fas fa-envelope mr-2 mt-1 flex-shrink-0"></i>
                <span className="break-all">info@geospatialacademy.com</span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-xs sm:text-sm text-center md:text-left">
              &copy; 2024 GeoSpatial Academy. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
