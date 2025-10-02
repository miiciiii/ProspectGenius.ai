import {
  Workflow,
  LineChart,
  Rocket,
  Clock,
  AlertCircle,
  Target,
} from 'lucide-react';

import { motion, useReducedMotion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description:
      'Design and deploy complex workflows with n8n integration. Connect multiple services and automate repetitive tasks effortlessly.',
  },
  {
    icon: LineChart,
    title: 'Advanced Analytics',
    description:
      'Gain deep insights into your data with powerful analytics tools. Visualize trends, track KPIs, and make data-driven decisions.',
  },
  {
    icon: Rocket,
    title: 'Gain a competitive edge',
    description:
      'Build stronger investor relationships and close deals while others are still trying to find the signal.',
  },
  {
    icon: Clock,
    title: 'Save hours every week',
    description:
      'Stop manually tracking announcements, scraping LinkedIn, or stitching together spreadsheets.',
  },
  {
    icon: AlertCircle,
    title: 'Be first to know',
    description:
      'Catch new funding rounds, leadership changes, and fast-growing startups before they hit the mainstream.',
  },
  {
    icon: Target,
    title: 'Target with precision',
    description:
      'Advanced filters let you zero in on the right industries, geographies, and decision-makers.',
  },
];


/** Motion variants (will be no-op when prefers-reduced-motion) */
const containerVariantsBase = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariantsBase = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

/** Decorative background component (palette configurable) */
function DecorativeBackground({ palette = 'indigo' }: { palette?: 'indigo' | 'purpleOrange' }) {
  const reduced = useReducedMotion();

  // two palette options — keep default in harmony with the existing features style
  const baseGradient =
    palette === 'purpleOrange'
      ? 'bg-gradient-to-br from-purple-700 via-purple-500 to-orange-400'
      : 'bg-gradient-to-br from-gray-900 via-indigo-900 to-black';

  const tintGradient =
    palette === 'purpleOrange'
      ? 'bg-gradient-to-tr from-purple-900/30 via-transparent to-orange-200/30'
      : 'bg-gradient-to-tr from-indigo-900/20 via-transparent to-purple-700/10';

  return (
    <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
      {/* Base ramp */}
      <div className={`absolute inset-0 ${baseGradient}`} />
      {/* Soft tint / overlay for depth */}
      <div className={`absolute inset-0 ${tintGradient}`} />

      {/* Subtle overlay to increase contrast for text */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Floating shapes — hidden on small screens for performance */}
      {/* Shapes animate only when user doesn't prefer reduced motion */}
      <motion.div
        className="hidden md:block absolute top-20 left-10 w-32 h-32 bg-white/6 rounded-full blur-3xl"
        animate={reduced ? undefined : { y: [0, -12, 0] }}
        transition={reduced ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="hidden md:block absolute bottom-20 right-10 w-44 h-44 bg-white/6 rounded-full blur-3xl"
        animate={reduced ? undefined : { y: [0, 12, 0] }}
        transition={reduced ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="hidden md:block absolute top-1/2 left-1/3 w-28 h-28 bg-white/6 rounded-full blur-2xl"
        animate={reduced ? undefined : { y: [0, -10, 0] }}
        transition={reduced ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

export default function Features() {
  const reduced = useReducedMotion();

  // choose the variants based on reduced-motion preference (no-op if reduced)
  const containerVariants = reduced ? { hidden: {}, visible: {} } : containerVariantsBase;
  const itemVariants = reduced
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : itemVariantsBase;

  return (
    <section
      id="features"
      role="region"
      aria-labelledby="features-title"
      className="relative w-full min-h-screen flex items-center overflow-hidden py-16 sm:py-20"
    >
      {/* Background (configurable palette) */}
      <DecorativeBackground palette="indigo" />

      {/* Content (above background) */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col justify-center">
        <div className="text-center mb-12">
          <h2 id="features-title" className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6">
            Why Choose Us?
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Everything you need to automate, analyze, and scale your business operations
          </p>
        </div>

        <motion.div
          className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={containerVariants}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group"
                aria-hidden={false}
              >
                <Card
                  key={index}
                  className="relative overflow-hidden p-6 sm:p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1"
                  data-testid={`card-feature-${index}`}
                >
                  {/* subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-transparent to-purple-500/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-indigo-600/15 to-purple-600/10 border border-indigo-500/20 mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-300">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-300" />
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
