import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
        ProspectGenius.ai | AgentGenius.ai
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
        Discover Funded Startups. Before anyone else.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link to="/auth/register">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link to="/auth/login">
          <Button size="lg" variant="outline">
            Sign In
          </Button>
        </Link>
      </div>
    </section>
  );
}
