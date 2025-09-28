import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function About() {
  return (
    <section
      id="about"
      role="region"
      aria-labelledby="about-title"
      className="relative w-full min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black"
    >
      {/* Overlay for depth */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 w-full flex flex-col justify-center text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={container}
        >
          <motion.h2
            id="about-title"
            variants={item}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
          >
            About Us
          </motion.h2>

          <motion.p
            variants={item}
            className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
          >
            We built this platform to make fundraising, investor relations, and
            startup growth effortless. Our mission is to empower teams with the
            tools they need to track, analyze, and accelerate their success.
          </motion.p>

          <motion.div
            variants={item}
            className="grid gap-6 sm:grid-cols-2 mt-8"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-left">
              <h3 className="text-xl font-semibold text-white mb-3">
                Our Mission
              </h3>
              <p className="text-gray-300 text-base leading-relaxed">
                To give founders and investors the clarity, confidence, and
                control they need to make bold decisions.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-left">
              <h3 className="text-xl font-semibold text-white mb-3">
                Our Vision
              </h3>
              <p className="text-gray-300 text-base leading-relaxed">
                A world where startup innovation is driven by transparency,
                data, and collaboration—not guesswork.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
