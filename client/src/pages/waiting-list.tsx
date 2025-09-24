import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import { ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function WaitingList() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('waiting_list')
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            company_name: companyName,
            email: email,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Error submitting to waiting list:', error);
        alert('There was an error submitting your information. Please try again.');
      } else {
        setIsSubmitted(true);
        // Reset form
        setFirstName("");
        setLastName("");
        setCompanyName("");
        setEmail("");
      }
    } catch (error) {
      console.error('Error submitting to waiting list:', error);
      alert('There was an error submitting your information. Please try again.');
    }

    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-500 to-orange-400 px-4 py-8">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative w-full max-w-md">
          <Card className="backdrop-blur-sm bg-white/95 border-white/20 shadow-2xl">
            <CardHeader className="space-y-2 text-center pb-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-green-600 bg-clip-text text-transparent">
                Thank You!
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
                You've been added to our waiting list. We'll notify you when we launch!
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <Link to="/">
                  <Button className="w-full h-12 text-base font-semibold btn-gradient shadow-lg hover:shadow-xl transition-all duration-200">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-500 to-orange-400 px-4 py-8">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to home</span>
          </Link>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 border-white/20 shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 bg-clip-text text-transparent">
              Join Our Waiting List
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Be the first to know when we launch
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-12 text-base border-2 border-gray-200 bg-white/80 focus:border-purple-500 transition-colors"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="h-12 text-base border-2 border-gray-200 bg-white/80 focus:border-purple-500 transition-colors"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">Company Name</Label>
                <Input
                  id="companyName"
                  type="text"
                  placeholder="Enter your company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-12 text-base border-2 border-gray-200 bg-white/80 focus:border-purple-500 transition-colors"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base border-2 border-gray-200 bg-white/80 focus:border-purple-500 transition-colors"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold btn-gradient shadow-lg hover:shadow-xl transition-all duration-200" 
                disabled={isLoading}
              >
                {isLoading ? "Joining..." : "Join Waiting List"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
