import { motion } from "framer-motion";
import { Quote, Users, TrendingUp, Target } from "lucide-react";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const testimonials = [
  {
    category: "For Investors & Venture Partners",
    icon: TrendingUp,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/40",
    quotes: [
      {
        text: "ProspectGenius.ai has completely transformed how we discover and track high-potential startups. We're now reaching founders weeks before competitors even know they exist.",
        author: "Alex M., Venture Partner"
      },
      {
        text: "Finally, a tool that doesn't just dump data — it gives me signal. I've closed two strategic investments this quarter because I acted on ProspectGenius alerts first.",
        author: "Priya S., Angel Investor"
      },
      {
        text: "I used to rely on scattered newsletters and Twitter threads for funding news. ProspectGenius gives me everything I need, in real time, without the noise.",
        author: "Linda W., Seed Fund Manager"
      }
    ]
  },
  {
    category: "For Startup Founders",
    icon: Users,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/40",
    quotes: [
      {
        text: "It's like having a dedicated market intelligence team — but on autopilot. We've accelerated deal flow and improved our pitch timing dramatically.",
        author: "Ethan R., Startup Founder"
      },
      {
        text: "ProspectGenius helped me spot and connect with the right investors at the right time. It's changed how we approach fundraising.",
        author: "Sara K., Tech Entrepreneur"
      }
    ]
  },
  {
    category: "For Sales & Business Development Teams",
    icon: Target,
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/40",
    quotes: [
      {
        text: "Our sales team cut prospect research time by 70%. Instead of digging through LinkedIn and Google Alerts, we get clean, actionable leads delivered instantly.",
        author: "James T., Head of Business Development"
      },
      {
        text: "The precision of ProspectGenius filtering is unmatched. I can target newly funded SaaS startups in seconds — something that used to take hours of manual work.",
        author: "Caroline D., Growth Marketer"
      },
      {
        text: "We used ProspectGenius to identify early-stage companies right after their funding announcements — our outreach response rate jumped 3×.",
        author: "Mark L., Enterprise Sales Director"
      }
    ]
  }
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      role="region"
      aria-labelledby="testimonials-title"
      className="relative w-full min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black py-16 sm:py-20"
    >
      {/* Overlay for extra depth */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center py-16">
        <div className="text-center mb-16">
          <h2
            id="testimonials-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-6"
          >
            What Others Say
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Hear from investors, founders, and sales teams who've transformed their workflow with ProspectGenius.ai
          </p>
        </div>

        <motion.div
          className="space-y-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={container}
        >
          {testimonials.map((section, sectionIndex) => (
            <motion.div key={sectionIndex} variants={item} className="space-y-8">
              {/* Section Header */}
              <div className="text-center">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color} border ${section.borderColor}`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{section.category}</h3>
                </div>
              </div>

              {/* Testimonials Grid */}
              <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {section.quotes.map((quote, quoteIndex) => (
                  <motion.div
                    key={quoteIndex}
                    variants={item}
                    className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1"
                  >
                    <div className="absolute top-4 left-4">
                      <Quote className="w-6 h-6 text-indigo-400/60" />
                    </div>
                    <blockquote className="text-base sm:text-lg text-gray-200 leading-relaxed mb-4 sm:mb-6 mt-8">
                      "{quote.text}"
                    </blockquote>
                    <footer className="font-medium text-gray-300 text-sm sm:text-base">
                      — {quote.author}
                    </footer>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
