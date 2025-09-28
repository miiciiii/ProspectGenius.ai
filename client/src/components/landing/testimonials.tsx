import { motion } from "framer-motion";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      role="region"
      aria-labelledby="testimonials-title"
      className="relative w-full min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black"
    >
      {/* Overlay for extra depth (optional) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center">
        <div className="text-center mb-12">
          <h2
            id="testimonials-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6"
          >
            What Our Users Say
          </h2>
        </div>

        <motion.div
          className="grid gap-6 sm:gap-8 sm:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={container}
        >
          <motion.div
            variants={item}
            className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1"
          >
            <blockquote className="text-base sm:text-lg text-gray-200 leading-relaxed mb-4 sm:mb-6">
              "This platform changed how we manage our funding pipeline. It's
              like having a full operations team."
            </blockquote>
            <footer className="font-medium text-gray-300 text-sm sm:text-base">
              — Sarah L., Founder
            </footer>
          </motion.div>

          <motion.div
            variants={item}
            className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1"
          >
            <blockquote className="text-base sm:text-lg text-gray-200 leading-relaxed mb-4 sm:mb-6">
              "Clean, modern, and intuitive. The dark mode is gorgeous."
            </blockquote>
            <footer className="font-medium text-gray-300 text-sm sm:text-base">
              — David R., Investor
            </footer>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
