import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Menu, Shield } from "lucide-react";

interface NavbarProps {
  onShowRegistration: () => void;
  onShowAdminLogin: () => void;
}

export default function Navbar({
  onShowRegistration,
  onShowAdminLogin,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center min-w-0">
            <div className="flex-shrink-0 flex items-center">
              <Globe className="text-primary text-xl sm:text-2xl mr-2 flex-shrink-0" />
              <span className="font-bold text-lg sm:text-xl text-slate-900 truncate">
                GeoXpatia
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="text-primary font-medium border-b-2 border-primary pb-1 whitespace-nowrap"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-slate-600 hover:text-primary transition-colors whitespace-nowrap"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("courses")}
              className="text-slate-600 hover:text-primary transition-colors whitespace-nowrap"
            >
              Courses
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-slate-600 hover:text-primary transition-colors whitespace-nowrap"
            >
              Contact
            </button>
            <Button
              onClick={onShowRegistration}
              className="bg-primary text-white hover:bg-primary-700 whitespace-nowrap"
              size="sm"
            >
              Register
            </Button>
            <Button
              variant="ghost"
              onClick={onShowAdminLogin}
              className="text-slate-600 hover:text-primary whitespace-nowrap"
              size="sm"
            >
              <Shield className="h-4 w-4 mr-1" />
              Admin
            </Button>
          </div>

          {/* Tablet Navigation */}
          <div className="hidden md:flex lg:hidden items-center space-x-3">
            <Button
              onClick={onShowRegistration}
              className="bg-primary text-white hover:bg-primary-700"
              size="sm"
            >
              Register
            </Button>
            <Button
              variant="ghost"
              onClick={onShowAdminLogin}
              className="text-slate-600 hover:text-primary"
              size="sm"
            >
              <Shield className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900"
            >
              <Menu className="h-5 w-5" />
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
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            <button
              onClick={() => scrollToSection("home")}
              className="block w-full text-left px-3 py-3 text-primary font-medium rounded-lg hover:bg-primary-50 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left px-3 py-3 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("courses")}
              className="block w-full text-left px-3 py-3 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Courses
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left px-3 py-3 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Contact
            </button>
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <button
                onClick={() => {
                  onShowRegistration();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Register for Courses
              </button>
              <button
                onClick={() => {
                  onShowAdminLogin();
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-3 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Shield className="h-4 w-4 mr-2 inline" />
                Admin Login
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
