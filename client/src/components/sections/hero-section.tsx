import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

interface HeroSectionProps {
  onShowRegistration: () => void;
}

const heroData = {
  title: "Master {highlight} with Expert Training",
  highlights: [
    "Web GIS",
    "Drone Photogrammetry",
    "GeoAI",
    "Python for GIS",
    "Open Source GIS",
  ],
  description:
      "FusionXpatial is your gateway to mastering the future of geospatial tech. Learn from industry experts through hands-on projects, cutting-edge tools, and flexible learning paths.",
  buttons: [
    {
      label: "Explore Courses",
      variant: "solid",
      color: "amber-500",
      action: "scrollToCourses",
    },
    {
      label: "Start Learning Today",
      variant: "outline",
      color: "white",
      action: "showRegistration",
    },
  ],
};

export default function HeroSection({ onShowRegistration }: HeroSectionProps) {
  const scrollToCourses = () => {
    document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAction = (action: string) => {
    if (action === "scrollToCourses") scrollToCourses();
    if (action === "showRegistration") onShowRegistration();
  };

  const longestWord = heroData.highlights.reduce(
      (a, b) => (a.length > b.length ? a : b),
      ""
  );

  return (
      <section id="home" className="relative">
        <div className="relative hero-gradient text-white min-h-[600px] flex items-center">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
            <div className="max-w-4xl mx-auto text-center lg:text-left">

              {/* Heading */}
              <motion.h1
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
              >
                Master{" "}
                <span
                    className="text-amber-400 inline-block align-baseline"
                    style={{
                      minWidth: `${longestWord.length * 0.65}em`,
                    }}
                >
                <TypeAnimation
                    sequence={heroData.highlights.flatMap((word) => [word, 2000])}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                />
              </span>{" "}
                with Expert Training
              </motion.h1>

              {/* Description */}
              <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-3xl mx-auto lg:mx-0"
              >
                {heroData.description}
              </motion.p>

              {/* Buttons */}
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start"
              >
                {heroData.buttons.map((btn, i) => (
                    <Button
                        key={i}
                        variant={btn.variant === "outline" ? "outline" : undefined}
                        onClick={() => handleAction(btn.action)}
                        className={`${
                            btn.variant === "outline"
                                ? "border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent"
                                : `bg-${btn.color} text-white hover:bg-amber-600`
                        } px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold h-auto w-full sm:w-auto`}
                    >
                      {btn.label}
                    </Button>
                ))}
              </motion.div>

            </div>
          </div>
        </div>
      </section>
  );
}
