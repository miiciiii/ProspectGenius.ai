import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Beautiful purple-orange gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-orange-400"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-700/30 via-transparent to-orange-300/30"></div>
      
      {/* Enhanced floating elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-white/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main content */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6">
          Ready to get started?
        </h2>
        <p className="text-lg sm:text-xl text-white/90 max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0">
          Join now and scale your business faster.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center px-4 sm:px-0">
          <Link to="/auth/register" className="w-full sm:w-auto">
            <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 text-base px-6 sm:px-8 py-3 h-auto font-semibold shadow-lg w-full sm:w-auto">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}