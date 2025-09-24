import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-20 bg-primary text-primary-foreground text-center">
      <h2 className="text-3xl font-bold">Ready to get started?</h2>
      <p className="mt-4 text-lg">Join now and scale your business faster.</p>
      <div className="mt-6">
        <Link to="/auth/register">
          <Button size="lg" variant="secondary">
            Create Account
          </Button>
        </Link>
      </div>
    </section>
  );
}
