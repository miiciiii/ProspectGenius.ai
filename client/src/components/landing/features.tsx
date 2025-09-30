import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { 
    title: "Be first to know", 
    desc: "Catch new funding rounds, leadership changes, and fast-growing startups before they hit the mainstream." 
  },
  { 
    title: "Target with precision", 
    desc: "Advanced filters let you zero in on the right industries, geographies, and decision-makers." 
  },
  { 
    title: "Save hours every week", 
    desc: "Stop manually tracking announcements, scraping LinkedIn, or stitching together spreadsheets." 
  },
  { 
    title: "Gain a competitive edge", 
    desc: "Build stronger investor relationships and close deals while others are still trying to find the signal." 
  },
];

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Features() {
  return (
    <section
      id="features"
      role="region"
      aria-labelledby="features-title"
      className="relative w-full min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-900 to-black py-16 sm:py-20"
    >
      {/* Overlay for depth */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center">
        <div className="text-center mb-12">
          <h2
            id="features-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6"
          >
            Why Choose Us?
          </h2>
        </div>

        <motion.div
          className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={container}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="relative inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/40 mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" />
              </div>

              <h3 className="text-lg sm:text-xl font-medium text-white mb-2 sm:mb-3 group-hover:text-indigo-300 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
