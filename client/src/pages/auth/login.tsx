import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const GoogleIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login({ email, password });

    if (!result.success) {
      alert(result.error || "Login failed");
    }

    setIsLoading(false);
  };

  const handleGoogleSignIn = () => {
    alert("Google Sign-In not yet implemented");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-500 to-orange-400 px-4 py-8">
      {/* Background elements (lower z so card stays readable) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <div className="relative w-full max-w-md z-20">
        {/* Back button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to home</span>
          </Link>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 border-white/20 shadow-2xl relative z-20">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent">
              Welcome back
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-12 text-base font-medium border-2 hover:bg-primary/5 transition-all duration-200 flex items-center justify-center gap-3"
              type="button"
            >
              <GoogleIcon />
              <span>Sign in with Google</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-gray-500 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-800">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  aria-label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  spellCheck={false}
                  // explicitly set visible text color + placeholder + caret
                  className="h-12 text-base text-gray-900 placeholder-gray-400 border-2 border-gray-200 bg-white/80 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors"
                  style={{ caretColor: "#7c3aed" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-800">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    aria-label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    spellCheck={false}
                    className="h-12 text-base text-gray-900 placeholder-gray-400 border-2 border-gray-200 bg-white/80 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-colors pr-12"
                    style={{ caretColor: "#7c3aed" }}
                  />
                  <button
                    type="button"
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors bg-transparent p-1 rounded"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold btn-gradient shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="text-center text-sm pt-4">
              <span className="text-gray-500">Don't have an account? </span>
              <Link
                to="/auth/register"
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
