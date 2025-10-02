import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('waiting_list').insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          company_name: formData.company,
          email: formData.email,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'You have successfully joined the waiting list.',
      });
      setFormData({ firstName: '', lastName: '', company: '', email: '' });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen flex items-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black py-24 sm:py-28"
    >
      {/* Overlay + background effects (unchanged) */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-20 gap-x-24 items-start">
          {/* LEFT: Text + Benefits (left-aligned, padded) */}
          <div className="text-left pr-4 lg:pr-8 min-w-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-primary">
              Join Our Exclusive Waiting List
            </h2>

            <p className="text-lg lg:text-xl text-gray-300 mb-6 max-w-xl break-words">
              Get <strong>limited access to all paid tiers</strong> and enjoy{' '}
              <strong>free upgrades from the free tier</strong> once you join.
              Be the first to experience premium features before anyone else!
            </p>

            <ul className="space-y-4 text-indigo-200 font-medium">
              {[
                'Early access to premium features',
                'Limited-time upgrades from free tier',
                'Priority support and updates',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-1 text-indigo-400 flex-shrink-0" />
                  <span className="text-gray-200">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-gray-400 mt-6 max-w-md">
              We respect your privacy — no spam, only important launch updates.
            </p>
          </div>

          {/* RIGHT: Form (constrained width, aligned right) */}
          <div className="flex justify-end min-w-0">
            <Card className="w-full max-w-md p-10 shadow-xl border border-white/20 bg-white/10 backdrop-blur-md rounded-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <Label htmlFor="firstName" className="font-semibold text-white">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                      placeholder="John"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lastName" className="font-semibold text-white">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                      placeholder="Doe"
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="company" className="font-semibold text-white">
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    required
                    placeholder="Your company or 'Personal use'"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                  <p className="text-sm text-gray-400 italic mt-1">
                    If you're signing up for personal use, please write "Personal use"
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="font-semibold text-white">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="you@example.com"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
                  disabled={loading}
                >
                  {loading ? 'Joining...' : 'Join the Waiting List'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
