import { CheckCircle } from "lucide-react";

const features = [
  { title: "Team Management", desc: "Easily manage team roles and access." },
  { title: "Real-time Insights", desc: "Track funding rounds and growth metrics." },
  { title: "Secure Platform", desc: "Enterprise-grade security and reliability." },
];

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Subtle purple-orange gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-orange-50/30 to-white"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-50/20 to-transparent"></div>
      
      {/* Floating background elements */}
      <div className="absolute top-20 right-20 w-48 h-48 bg-gradient-to-r from-purple-500/8 to-orange-400/8 rounded-full blur-3xl animate-pulse delay-300"></div>
      <div className="absolute bottom-20 left-20 w-36 h-36 bg-gradient-to-r from-orange-500/8 to-purple-500/8 rounded-full blur-3xl animate-pulse delay-700"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Us?
          </h2>
        </div>
        
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-orange-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Icon */}
              <div className="relative inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-100 to-orange-100 border border-purple-200 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
              </div>
              
              {/* Content */}
              <div className="relative">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-purple-700 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
              
              {/* Hover indicator */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}