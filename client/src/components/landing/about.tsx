import { motion } from "framer-motion";
import { Target, Eye } from "lucide-react";

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
          className="relative w-full min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black py-16 sm:py-20"
        >
      {/* Subtle background elements */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 w-full flex flex-col justify-center text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={container}
        >

              <motion.h2
                id="about-title"
                variants={item}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6"
              >
                About{" "}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ProspectGenius.ai
                </span>
              </motion.h2>

              <motion.p
                variants={item}
                className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12"
              >
                At ProspectGenius.ai, we help founders, investors, and business development teams discover high-potential startups before anyone else.
                Our platform turns chaotic market signals into clear, actionable leads — so you can spot newly funded companies, reach key decision-makers first, and move faster than competitors.
                With real-time funding alerts, intelligent prospecting filters, and clean, investor-grade data, we empower you to focus on what matters most: building relationships that drive deals and growth.
              </motion.p>

          <motion.div
            variants={item}
            className="grid gap-8 sm:grid-cols-2 mt-8"
          >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-left hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Our Mission
                    </h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    To give founders, investors, and growth leaders the clarity, speed, and confidence they need to make bold market moves — without wasting time on guesswork.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-left hover:bg-white/15 transition-all duration-300 group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Our Vision
                    </h3>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    A world where innovation and investment move at the speed of insight — where data transparency and smart tools replace blind searching and missed opportunities.
                  </p>
                </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}