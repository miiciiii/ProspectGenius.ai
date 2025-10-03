import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { FcGoogle } from "react-icons/fc"; // Google icon
import { Github, Twitter } from "lucide-react"; // extra placeholders

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("[SignIn] submitting login:", email);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    } else {
      toast({
        title: "Success",
        description: "Signed in successfully",
      });
      console.log("[SignIn] redirecting to dashboard");
      setLocation("/dashboard/reports/company");
    }
  };

  const handleComingSoon = (provider: string) => {
    toast({
      title: `${provider} sign-in`,
      description: "Coming soon...",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-8 backdrop-blur-xl bg-white/10 shadow-lg border border-white/20">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2 text-center">
            Sign in to access your ProspectGenius dashboard
          </p>
        </div>

        {/* Social login placeholders */}
        <div className="space-y-3 mb-6">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => handleComingSoon("Google")}
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => handleComingSoon("GitHub")}
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => handleComingSoon("Twitter")}
          >
            <Twitter className="w-5 h-5" />
            Continue with Twitter
          </Button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or sign in with email
            </span>
          </div>
        </div>

        {/* Email/Password form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="input-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              data-testid="input-password"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            data-testid="button-signin-submit"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <a
            href="/"
            className="block text-sm text-muted-foreground hover:text-primary transition-colors"
            data-testid="link-back-home"
          >
            Back to home
          </a>

          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-primary hover:underline"
              data-testid="link-signup"
            >
              Sign up
            </a>
          </p>
        </div>

      </Card>
    </div>
  );
}
