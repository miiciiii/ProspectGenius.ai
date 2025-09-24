import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Beautiful purple-orange gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-500 to-orange-400"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-700/30 via-transparent to-orange-300/30"></div>
      
      {/* Enhanced floating elements with parallax */}
      <div 
        className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      ></div>
      <div 
        className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"
        style={{ transform: `translateY(${scrollY * -0.1}px)` }}
      ></div>
      <div 
        className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"
        style={{ transform: `translateY(${scrollY * 0.05}px)` }}
      ></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white mb-4 sm:mb-6">
          <span className="block">ProspectGenius.ai | AgentGenius.ai</span>
        </h1>
        
        <p className="text-xl sm:text-2xl md:text-3xl text-white max-w-2xl sm:max-w-3xl mx-auto mb-6 leading-relaxed px-4 sm:px-0 font-semibold tracking-wide drop-shadow-2xl">
          Discover Funded Startups. Before anyone else.
        </p>
        <p className="text-lg sm:text-xl text-white/95 max-w-2xl sm:max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0 font-light">
          Does this align with what you're looking for? Come and be part of our waiting list.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center px-4 sm:px-0">
          <Link to="/waiting-list" className="w-full sm:w-auto">
            <Button size="lg" className="bg-white text-purple-700 hover:bg-white/90 text-base px-6 sm:px-8 py-3 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
              Waiting List
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}