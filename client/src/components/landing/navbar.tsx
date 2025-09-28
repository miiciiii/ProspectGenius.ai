import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const LandingNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navbarHeight = document.querySelector("header")?.clientHeight || 0;
      const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const sections = ["features", "pricing", "about"];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
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
            <span className="text-xs text-gray-700 dark:text-gray-300 ml-1">
              .ai
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 transition-colors duration-200 relative group"
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 transition-all duration-200 group-hover:w-full"></span>
            </button>
          ))}
          <Link
            to="/waiting-list"
            className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 transition-colors duration-200 relative group"
          >
            Waiting List
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 transition-all duration-200 group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/auth/login">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600"
            >
              Sign in
            </Button>
          </Link>
          <Link to="/auth/register">
            <Button
              size="sm"
              className="btn-gradient text-sm font-medium shadow-sm"
            >
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          ) : (
            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md">
          <div className="px-4 py-4 space-y-4">
            {sections.map((section) => (
              <button
                key={section}
                className="block text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 transition-colors py-2 w-full text-left"
                onClick={() => {
                  scrollToSection(section);
                  setIsMobileMenuOpen(false);
                }}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
            <Link
              to="/waiting-list"
              className="block text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Waiting List
            </Link>

            <div className="pt-4 border-t space-y-3">
              <Link to="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:text-purple-600"
                >
                  Sign in
                </Button>
              </Link>
              <Link
                to="/auth/register"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button className="w-full btn-gradient">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
