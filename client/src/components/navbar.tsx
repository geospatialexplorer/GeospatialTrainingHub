import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Shield } from "lucide-react";

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
            {/* Logo */}
            <div className="flex items-center min-w-0 overflow-hidden max-w-[190px]">
              <img
                  src="https://i.postimg.cc/HLF55Cx4/Fusion-Xpatial-Logo-Final-1.jpg"
                  alt="GeoXpatia Logo"
                  className="h-[250px] w-[250px] mr-3 object-contain"
              />
            </div>



            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {[
                { id: "home", label: "Home", primary: true },
                { id: "about", label: "About" },
                { id: "courses", label: "Courses" },
                { id: "contact", label: "Contact" },
              ].map(({ id, label, primary }) => (
                  <button
                      key={id}
                      type="button"
                      onClick={() => scrollToSection(id)}
                      className={`whitespace-nowrap font-medium pb-1 border-b-2 ${
                          primary
                              ? "text-primary border-primary"
                              : "text-slate-600 hover:text-primary border-transparent hover:border-primary transition-colors"
                      }`}
                  >
                    {label}
                  </button>
              ))}
              <Button
                  type="button"
                  onClick={onShowRegistration}
                  className="bg-primary text-white hover:bg-primary-700 whitespace-nowrap"
                  size="sm"
              >
                Register
              </Button>
              <Button
                  type="button"
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
                  type="button"
                  onClick={onShowRegistration}
                  className="bg-primary text-white hover:bg-primary-700"
                  size="sm"
              >
                Register
              </Button>
              <Button
                  type="button"
                  variant="ghost"
                  onClick={onShowAdminLogin}
                  className="text-slate-600 hover:text-primary"
                  size="sm"
              >
                <Shield className="h-4 w-4" />
              </Button>
              <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                  className="text-slate-600 hover:text-slate-900"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
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
                {[
                  { id: "home", label: "Home", primary: true },
                  { id: "about", label: "About" },
                  { id: "courses", label: "Courses" },
                  { id: "contact", label: "Contact" },
                ].map(({ id, label, primary }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => scrollToSection(id)}
                        className={`block w-full text-left px-3 py-3 rounded-lg transition-colors ${
                            primary
                                ? "text-primary font-medium bg-primary-50 hover:bg-primary-100"
                                : "text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                      {label}
                    </button>
                ))}
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <button
                      type="button"
                      onClick={() => {
                        onShowRegistration();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    Register for Courses
                  </button>
                  <button
                      type="button"
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
