import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutSection() {
  return (
      <section
          id="about"
          className="py-12 sm:py-16 lg:py-20 bg-slate-50 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Image with animation */}
            <motion.div
                className="order-2 lg:order-1"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
            >
              <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Modern GIS training classroom"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover aspect-[4/3]"
              />
            </motion.div>

            {/* Text with animation */}
            <motion.div
                className="order-1 lg:order-2"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6">
                Leading the Future of{" "}
                <span className="text-primary">Geospatial Education</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8">
                FusionXpatial Academy has been at the forefront of geospatial
                education for over a decade. We provide cutting-edge training in
                GIS, remote sensing, spatial analysis, and emerging technologies
                like AI and machine learning applications in geospatial science.
              </p>

              {/* Feature List */}
              <motion.div
                  className="space-y-3 sm:space-y-4"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.15 },
                    },
                  }}
              >
                {[
                  "Industry-certified instructors with real-world experience",
                  "Hands-on projects using the latest software and datasets",
                  "Flexible learning options: online, hybrid, and in-person",
                  "Career placement assistance and networking opportunities",
                ].map((text, i) => (
                    <motion.div
                        key={i}
                        className="flex items-start"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        viewport={{ once: true }}
                    >
                      <CheckCircle className="text-green-500 mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-slate-700">{text}</span>
                    </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
  );
}
