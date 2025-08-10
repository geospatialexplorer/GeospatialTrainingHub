import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  Users,
  Image,
  Settings,
  Menu,
  Globe,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { authService } from "@/lib/auth";
import { useLocation } from "wouter";

interface SidebarProps {
  username?: string;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

interface NavItem {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export function Sidebar({
                          username,
                          currentSection,
                          onSectionChange,
                        }: SidebarProps) {
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setLocation("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems: NavItem[] = [
    {
      title: "Overview",
      value: "overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Registrations",
      value: "registrations",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Courses",
      value: "courses",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      title: "Banners",
      value: "banners",
      icon: <Image className="h-5 w-5" />,
    },
    {
      title: "Settings",
      value: "settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
      <>
      {/* Mobile Sidebar */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                {/* Logo */}
                <div className="flex items-center min-w-0 overflow-hidden">
                  <img
                      src="https://i.postimg.cc/HLF55Cx4/Fusion-Xpatial-Logo-Final-1.jpg"
                      alt="GeoXpatia Logo"
                      className="h-16 w-auto object-contain"
                  />
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Welcome, {username || "Admin"}
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-1">
                  {navItems.map((item) => (
                      <Button
                          key={item.value}
                          variant={
                            currentSection === item.value ? "secondary" : "ghost"
                          }
                          className={cn(
                              "w-full justify-start gap-3 font-normal",
                              currentSection === item.value && "font-medium"
                          )}
                          onClick={() => {
                            onSectionChange(item.value);
                            setOpen(false);
                          }}
                      >
                        {item.icon}
                        {item.title}
                      </Button>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t space-y-2">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => setLocation("/")}
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to Website
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

      {/* Desktop Sidebar */}
        <div className="hidden md:flex h-screen w-64 flex-col border-r bg-white">
          <div className="p-4 border-b">
            {/* Logo */}
            <div>
              <img
                  src="https://i.postimg.cc/HLF55Cx4/Fusion-Xpatial-Logo-Final-1.jpg"
                  alt="GeoXpatia Logo"
                  className="h-16 w-auto object-contain"
              />
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Welcome, {username || "Admin"}
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-1">
              {navItems.map((item) => (
                  <Button
                      key={item.value}
                      variant={
                        currentSection === item.value ? "secondary" : "ghost"
                      }
                      className={cn(
                          "w-full justify-start gap-3 font-normal",
                          currentSection === item.value && "font-medium"
                      )}
                      onClick={() => onSectionChange(item.value)}
                  >
                    {item.icon}
                    {item.title}
                  </Button>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t space-y-2">
            {/*<Button*/}
            {/*    variant="outline"*/}
            {/*    className="w-full justify-start gap-3"*/}
            {/*    onClick={() => setLocation("/")}*/}
            {/*>*/}
            {/*  <ArrowLeft className="h-5 w-5" />*/}
            {/*  Back to Website*/}
            {/*</Button>*/}
            <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </>
  );
}
