import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { title: "Team Management", desc: "Easily manage team roles and access." },
  { title: "Real-time Insights", desc: "Track funding rounds and growth metrics." },
  { title: "Secure Platform", desc: "Enterprise-grade security and reliability." },
];

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

export default function Features() {
  return (
    <div
      id="features"
      role="region"
      aria-labelledby="features-title"
      className="relative w-full overflow-hidden py-24"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-orange-50/30 to-white" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-50/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center">
        <div className="text-center mb-12">
          <h2 id="features-title" className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6">
            Why Choose Us?
          </h2>
        </div>

        <motion.div
          className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={container}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-orange-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-100 to-orange-100 border border-purple-200 mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
              </div>

              <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2 sm:mb-3 group-hover:text-purple-600 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
