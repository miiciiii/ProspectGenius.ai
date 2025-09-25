import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <div
      id="hero"
      role="region"
      aria-labelledby="hero-title"
      className="relative w-full overflow-hidden min-h-[calc(100vh-var(--landing-header-height))] flex items-center justify-center"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-orange-400" />
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-700/30 via-transparent to-orange-300/30" />
      </div>

      {/* Floating shapes */}
      <motion.div
        aria-hidden
        className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl z-0 pointer-events-none"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl z-0 pointer-events-none"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-2xl z-0 pointer-events-none"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center justify-center text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={containerVariants}
      >

        <motion.h1
          id="hero-title"
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 whitespace-nowrap"
        >
          ProspectGenius.ai | AgentGenius.ai
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl md:text-3xl text-white max-w-2xl mx-auto mb-6 font-semibold tracking-wide"
        >
          Discover Funded Startups. Before anyone else.
        </motion.p>
      </motion.div>
    </div>
  );
}
