import Navigation from '@/components/landing/Navigation';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import About from '@/components/landing/About';
import Contact from '@/components/landing/Contact';
import Pricing from '@/components/landing/Pricing';
import Testimonials from '@/components/landing/Testimonials';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Hero />
      <Features />
      <About />
      <Contact />
      <Pricing />
      <Testimonials />

      <footer className="w-full z-40 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-lg border-t border-white/20 dark:border-neutral-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-14 items-center justify-between text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <a
            href="#"
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Privacy Policy
          </a>

          <p className="text-center text-xs sm:text-sm font-medium">
            &copy; 2025{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              ProspectGenius
            </span>
            <span className="text-purple-500">.ai</span> | AgentGenius.ai
          </p>

          <a
            href="#"
            className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
}
