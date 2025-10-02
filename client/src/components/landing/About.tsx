import { CheckCircle2, Target, Eye } from "lucide-react";

const benefits = [
  "Seamless n8n workflow integration",
  "Real-time data synchronization",
  "Comprehensive reporting suite",
  "Advanced analytics dashboard",
  "Enterprise-grade security",
  "Scalable architecture",
];

export default function About() {
  return (
    <section
      id="about"
      role="region"
      aria-labelledby="about-title"
      className="relative w-full min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black py-24"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - About Content */}
          <div>
            <h2
              id="about-title"
              className="text-3xl lg:text-5xl font-bold tracking-tight mb-6 text-white"
            >
              About{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                ProspectGenius.ai
              </span>
            </h2>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              At ProspectGenius.ai, we help founders, investors, and business
              development teams discover high-potential startups before anyone
              else. Our platform turns chaotic market signals into clear,
              actionable leads — so you can spot newly funded companies, reach
              key decision-makers first, and move faster than competitors.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3"
                  data-testid={`benefit-${index}`}
                >
                  <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-200">{benefit}</span>
                </div>
              ))}
            </div>

            <p className="text-gray-300 leading-relaxed">
              With real-time funding alerts, intelligent prospecting filters,
              and clean, investor-grade data, we empower you to focus on what
              matters most: building relationships that drive deals and growth.
            </p>
          </div>

          {/* Right Column - Mission & Vision */}
          <div className="space-y-8">
            {/* Mission */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                To give founders, investors, and growth leaders the clarity,
                speed, and confidence they need to make bold market moves —
                without wasting time on guesswork.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Our Vision</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                A world where innovation and investment move at the speed of
                insight — where data transparency and smart tools replace blind
                searching and missed opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
