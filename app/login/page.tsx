'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/providers/AuthProvider';
import { MOCK_AGENT_ID } from '@/lib/constants';
import { Mountain, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate loading for 1.5 seconds
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (email.toLowerCase().includes('john.doe')) {
      login(MOCK_AGENT_ID);
      router.push('/dashboard');
      return;
    }

    setError(
      "Invalid credentials for mock login. Hint, try 'john.doe@properview.com'."
    );
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <Mountain className="mx-auto h-10 w-10 mb-2 text-primary" />
            <CardTitle className="text-2xl">Agent Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your ProperView dashboard.
            </CardDescription>
            <div className="mt-4 p-3 bg-blue-50 border rounded-lg">
              <h3 className="text-sm font-medium text-primary mb-1">
                Demo Credentials
              </h3>
              <p className="text-xs text-primary">
                <strong>Email:</strong> john.doe@properview.com
                <br />
                <strong>Password:</strong> Any password will work
              </p>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Use john.doe@properview.com for demo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="For demo, any password will work"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
