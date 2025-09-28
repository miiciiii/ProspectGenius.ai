import LandingLayout from "@/pages/landing/landing-layout";
import Hero from "@/components/landing/hero";
import CTA from "@/components/landing/cta";
import Features from "@/components/landing/features";
import Pricing from "@/components/landing/pricing";
import About from "@/components/landing/about";
import Testimonials from "@/components/landing/testimonials";

export default function LandingPage() {
  return (
    <LandingLayout>
      <Hero />
      <CTA />
      <Features />
      <Pricing />
      <About />
      <Testimonials />
    </LandingLayout>
  );
}
