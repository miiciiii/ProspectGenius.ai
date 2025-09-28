import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.08 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
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
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-purple-500 to-orange-400" />
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-orange-200/30" />
      </div>

      {/* Floating shapes */}
      <motion.div
        aria-hidden
        className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-20 right-10 w-44 h-44 bg-white/5 rounded-full blur-3xl"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/2 left-1/3 w-28 h-28 bg-white/10 rounded-full blur-2xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 w-full flex flex-col items-center justify-center text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={containerVariants}
      >
        {/* Brand Heading */}
        <motion.div variants={itemVariants} className="w-full">
          <h1
            id="hero-title"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-center"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-orange-200">
              ProspectGenius.ai
            </span>
          </h1>
          {/* Trademark pushed right */}
          <p className="text-sm sm:text-base md:text-lg font-medium text-white/70 tracking-wide mt-1 w-full text-right pr-4">
            powered by AgentGenius.ai
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mt-6 font-semibold tracking-wide"
        >
          Discover Funded Startups. Before anyone else.
        </motion.p>
      </motion.div>
    </div>
  );
}
