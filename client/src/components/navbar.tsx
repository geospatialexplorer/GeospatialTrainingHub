import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Menu, Shield } from "lucide-react";

interface NavbarProps {
  onShowRegistration: () => void;
  onShowAdminLogin: () => void;
}

export default function Navbar({ onShowRegistration, onShowAdminLogin }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Globe className="text-primary text-2xl mr-2" />
              <span className="font-bold text-xl text-slate-900">GeoSpatial Academy</span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection("home")}
              className="text-primary font-medium border-b-2 border-primary pb-1"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("about")}
              className="text-slate-600 hover:text-primary transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection("courses")}
              className="text-slate-600 hover:text-primary transition-colors"
            >
              Courses
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="text-slate-600 hover:text-primary transition-colors"
            >
              Contact
            </button>
            <Button onClick={onShowRegistration} className="bg-primary text-white hover:bg-primary-700">
              Register
            </Button>
            <Button 
              variant="ghost" 
              onClick={onShowAdminLogin}
              className="text-slate-600 hover:text-primary"
            >
              <Shield className="h-4 w-4 mr-1" />
              Admin
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button 
              onClick={() => scrollToSection("home")}
              className="block px-3 py-2 text-primary font-medium w-full text-left"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("about")}
              className="block px-3 py-2 text-slate-600 w-full text-left"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection("courses")}
              className="block px-3 py-2 text-slate-600 w-full text-left"
            >
              Courses
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="block px-3 py-2 text-slate-600 w-full text-left"
            >
              Contact
            </button>
            <button 
              onClick={() => {
                onShowRegistration();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-slate-600"
            >
              Register
            </button>
            <button 
              onClick={() => {
                onShowAdminLogin();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 text-slate-600"
            >
              Admin Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
