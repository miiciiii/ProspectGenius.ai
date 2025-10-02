import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-purple-500 to-orange-400" />
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-orange-200/30" />
      </div>

      {/* Floating shapes */}
      <motion.div
        aria-hidden
        className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-20 right-10 w-44 h-44 bg-white/5 rounded-full blur-3xl"
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/2 left-1/3 w-28 h-28 bg-white/10 rounded-full blur-2xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center">
        {/* Gradient Title */}
        <h1
          id="hero-title"
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-orange-200">
            ProspectGenius.ai
          </span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg font-medium text-white/70 tracking-wide mt-1 text-right pr-4">
          powered by AgentGenius.ai
        </p>

        {/* Tagline */}
        <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mt-6 font-semibold tracking-wide">
          Discover Funded Startups. Before anyone else.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <Link href="/signin">
            <Button
              size="lg"
              variant="default"
              className="gap-2 text-base"
              data-testid="button-get-started"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 text-base bg-background/10 backdrop-blur-sm border-white/20 text-white hover:bg-background/20"
            onClick={() => {
              const element = document.getElementById('features');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            data-testid="button-learn-more"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
