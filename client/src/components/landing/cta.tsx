import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, BarChart2, Share2 } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ModernCTA() {
  const features = [
    { icon: Eye, title: "Discover Startups", desc: "Explore funded companies in one place." },
    { icon: BarChart2, title: "Track Metrics", desc: "View key growth and funding data." },
    { icon: Share2, title: "Connect Directly", desc: "Get ways to reach founders and investors." },
  ];

  return (
    <div
      id="cta"
      role="region"
      aria-labelledby="cta-title"
      className="relative w-full overflow-hidden min-h-[calc(100vh-var(--landing-header-height))] flex items-center justify-center py-16 sm:py-20"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-orange-400" />
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-700/30 via-transparent to-orange-300/30" />
        <div className="absolute top-10 left-10 w-40 h-40 bg-white/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center text-center h-full space-y-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={containerVariants}
      >
        <motion.h2
          id="cta-title"
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4"
        >
          All-in-One Platform for Funded Companies
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-6"
        >
          Discover startups, explore key metrics, and connect with founders. All from a single platform.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8"
          variants={containerVariants}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center hover:shadow-lg hover:shadow-purple-500/20 transition-transform duration-300 hover:-translate-y-1"
            >
              <f.icon className="w-10 h-10 text-white mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm sm:text-base text-white/80">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center mt-8">
          <Link to="/waiting-list">
            <Button className="bg-white text-purple-700 hover:bg-white/90 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Join the Waiting List
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
