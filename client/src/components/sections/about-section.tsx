import { CheckCircle } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="lg:order-first">
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Modern GIS training classroom" 
              className="rounded-2xl shadow-2xl w-full h-auto" 
            />
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Leading the Future of <span className="text-primary">Geospatial Education</span>
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              GeoSpatial Academy has been at the forefront of geospatial education for over a decade. We provide cutting-edge training in GIS, remote sensing, spatial analysis, and emerging technologies like AI and machine learning applications in geospatial science.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-3 h-5 w-5" />
                <span className="text-slate-700">Industry-certified instructors with real-world experience</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-3 h-5 w-5" />
                <span className="text-slate-700">Hands-on projects using the latest software and datasets</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-3 h-5 w-5" />
                <span className="text-slate-700">Flexible learning options: online, hybrid, and in-person</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="text-green-500 mr-3 h-5 w-5" />
                <span className="text-slate-700">Career placement assistance and networking opportunities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
