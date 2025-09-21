export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Subtle purple-orange gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 via-purple-50/30 to-white"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/30 via-transparent to-orange-50/30"></div>
      
      {/* Floating background elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-orange-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-purple-500/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            What Our Users Say
          </h2>
        </div>
        
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2">
          <div className="group relative bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
            <blockquote className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6 relative">
              "This platform changed how we manage our funding pipeline. 
              It's like having a full operations team."
            </blockquote>
            <footer className="font-semibold text-gray-900 text-sm sm:text-base">— Sarah L., Founder</footer>
          </div>
          
          <div className="group relative bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1">
            <blockquote className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6 relative">
              "Clean, modern, and intuitive. The dark mode is gorgeous."
            </blockquote>
            <footer className="font-semibold text-gray-900 text-sm sm:text-base">— David R., Investor</footer>
          </div>
        </div>
      </div>
    </section>
  );
}