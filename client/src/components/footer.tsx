import { Globe } from "lucide-react";

export default function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Globe className="text-primary-400 text-2xl mr-2" />
              <span className="font-bold text-xl">GeoSpatial Academy</span>
            </div>
            <p className="text-slate-400 mb-4">
              Empowering professionals with cutting-edge geospatial education and training since 2010.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection("home")}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("about")}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("courses")}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Courses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Popular Courses</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">GIS Fundamentals</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Remote Sensing</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Python for GIS</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Web GIS Development</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
            <div className="space-y-2 text-slate-400">
              <p><i className="fas fa-map-marker-alt mr-2"></i>123 GeoSpatial Way, CA 94105</p>
              <p><i className="fas fa-phone mr-2"></i>+1 (555) 123-4567</p>
              <p><i className="fas fa-envelope mr-2"></i>info@geospatialacademy.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400">&copy; 2024 GeoSpatial Academy. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
