import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import { Github, Twitter, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { signUp } = useAuth();

  // password strength helper
  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ["Too weak", "Weak", "Medium", "Strong", "Very strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-emerald-600",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    console.log("[SignUp] submitting registration:", { name, email });

    const { data, error } = await signUp(email, password, name);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (data.session) {
      toast({
        title: "Success",
        description: "Account created successfully",
      });
      console.log("[SignUp] redirecting to dashboard");
      setLocation("/dashboard/reports/company");
    } else {
      toast({
        title: "Check your email",
        description: "We sent you a confirmation link to verify your account.",
      });
      setLoading(false);
    }
  };

  const handleComingSoon = (provider: string) => {
    toast({
      title: `${provider} sign-up`,
      description: "Coming soon...",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md p-8 backdrop-blur-xl bg-white/10 shadow-lg border border-white/20">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground mt-2 text-center">
            Sign up to get started with ProspectGenius
          </p>
        </div>

        {/* Social signup placeholders */}
        <div className="space-y-3 mb-6">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => handleComingSoon("Google")}
          >
            <FcGoogle className="w-5 h-5" />
            Sign up with Google
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => handleComingSoon("GitHub")}
          >
            <Github className="w-5 h-5" />
            Sign up with GitHub
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => handleComingSoon("Twitter")}
          >
            <Twitter className="w-5 h-5" />
            Sign up with Twitter
          </Button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or sign up with email
            </span>
          </div>
        </div>

        {/* Email signup form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              data-testid="input-name"
            />
          </div>

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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="input-password"
                className="pr-10"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="button-toggle-password"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200/20 rounded h-2">
                  <div
                    className={`h-2 rounded ${strengthColors[strength]}`}
                    style={{ width: `${(strength / 4) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1 text-muted-foreground">
                  {strengthLabels[strength]}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                data-testid="input-confirm-password"
                className="pr-10"
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="button-toggle-confirm-password"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            data-testid="button-signup-submit"
          >
            {loading ? "Creating account..." : "Sign Up"}
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
            Already have an account?{" "}
            <a
              href="/signin"
              className="font-medium text-primary hover:underline"
              data-testid="link-signin"
            >
              Sign in
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
