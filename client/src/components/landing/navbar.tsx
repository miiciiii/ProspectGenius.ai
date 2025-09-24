import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const LandingNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/brand/wordmark.jpg"
            alt="ProspectGenius.ai"
            className="h-8 md:h-10 w-auto rounded-lg shadow-sm ring-1 ring-transparent group-hover:ring-primary/20 transition-all duration-200"
            loading="eager"
            decoding="async"
          />
          <div className="hidden sm:block">
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              ProspectGenius
            </span>
            <span className="text-xs text-gray-700 ml-1">.ai</span>
          </div>
        </Link>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link 
            to="/#features" 
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 relative group"
          >
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/#pricing" 
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 relative group"
          >
            Pricing
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/#about" 
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 relative group"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link 
            to="/waiting-list" 
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 relative group"
          >
            Waiting List
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Desktop Call to action */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/auth/login">
            <Button variant="ghost" size="sm" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Sign in
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button size="sm" className="btn-gradient text-sm font-medium shadow-sm">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-4">
            <Link 
              to="/#features" 
              className="block text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/#pricing" 
              className="block text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/#about" 
              className="block text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/waiting-list" 
              className="block text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Waiting List
            </Link>
            <div className="pt-4 border-t space-y-3">
              <Link to="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-gray-700">
                  Sign in
                </Button>
              </Link>
              <Link to="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full btn-gradient">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;