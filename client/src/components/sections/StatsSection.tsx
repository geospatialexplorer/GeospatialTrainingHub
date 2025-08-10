import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function StatsSection() {
    const { ref, inView } = useInView({
        triggerOnce: true, // Only run once
        threshold: 0.2,    // Trigger when 20% visible
    });

    const stats = [
        { value: 2500, suffix: "+", label: "Students Trained" },
        { value: 50, suffix: "+", label: "Expert Courses" },
        { value: 25, suffix: "+", label: "Expert Instructors" },
        { value: 98, suffix: "%", label: "Satisfaction Rate" },
    ];

    return (
        <section className="bg-white py-12 sm:py-16 lg:py-20" ref={ref}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center p-4">
                            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
                                {inView ? (
                                    <CountUp end={stat.value} duration={2} suffix={stat.suffix} />
                                ) : (
                                    `0${stat.suffix}`
                                )}
                            </div>
                            <div className="text-sm sm:text-base text-slate-600">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
