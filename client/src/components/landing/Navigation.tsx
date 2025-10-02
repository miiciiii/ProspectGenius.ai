import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import wordMark from "@assets/brand/wordmark.jpg";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      setMobileMenuOpen(false);
    }
  };

  const sections = ["features", "about", "contact", "pricing", "testimonials"];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/20 dark:bg-neutral-900/20 backdrop-blur-xl border-b border-white/20 dark:border-neutral-800/40 shadow-lg"
          : "bg-transparent backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src={wordMark}
            alt="ProspectGenius.ai"
            className="h-8 md:h-10 w-auto rounded-lg shadow-sm ring-1 ring-transparent group-hover:ring-primary/20 transition-all duration-200"
            loading="eager"
            decoding="async"
          />
          <div className="hidden sm:block">
            <span
              className={`text-lg font-bold ${
                scrolled
                  ? "text-gray-900 dark:text-white"
                  : "text-white drop-shadow-2xl font-extrabold"
              }`}
            >
              ProspectGenius
            </span>
            <span
              className={`text-xs ml-1 ${
                scrolled
                  ? "text-gray-600 dark:text-gray-300"
                  : "text-white drop-shadow-2xl font-semibold"
              }`}
            >
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
              className={`text-sm font-medium transition-colors duration-200 relative group ${
                scrolled
                  ? "text-gray-800 dark:text-gray-200 hover:text-purple-600"
                  : "text-white drop-shadow-2xl font-semibold hover:text-purple-300"
              }`}
              data-testid={`link-${section}`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 transition-all duration-200 group-hover:w-full"></span>
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/signin">
            <Button
              variant="ghost"
              size="sm"
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? "text-gray-700 dark:text-gray-200 hover:text-purple-600"
                  : "text-white hover:text-purple-300 drop-shadow-2xl font-semibold"
              }`}
              data-testid="button-signin"
            >
              Sign in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="btn-gradient text-sm font-medium shadow-sm">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-md transition-colors ${
            scrolled
              ? "hover:bg-gray-100/30 dark:hover:bg-neutral-800/30"
              : "hover:bg-white/10"
          }`}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? (
            <X
              className={`w-5 h-5 ${
                scrolled
                  ? "text-gray-700 dark:text-gray-200"
                  : "text-white drop-shadow-2xl"
              }`}
            />
          ) : (
            <Menu
              className={`w-5 h-5 ${
                scrolled
                  ? "text-gray-700 dark:text-gray-200"
                  : "text-white drop-shadow-2xl"
              }`}
            />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white/10 dark:bg-neutral-900/10 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-4">
            {sections.map((section) => (
              <button
                key={section}
                className="block text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-purple-600 transition-colors py-2 w-full text-left"
                onClick={() => scrollToSection(section)}
                data-testid={`link-mobile-${section}`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}

            <div className="pt-4 border-t space-y-3">
              <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 dark:text-gray-200 hover:text-purple-600"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full btn-gradient">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
