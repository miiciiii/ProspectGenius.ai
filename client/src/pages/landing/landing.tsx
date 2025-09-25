import LandingLayout from "@/pages/landing/landing-layout";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import Testimonials from "@/components/landing/testimonials";
import CTA from "@/components/landing/cta";

export default function LandingPage() {
  return (
    <LandingLayout>
      <Hero />
      <CTA />
      <Features />
      <Testimonials />
    </LandingLayout>
  );
}
