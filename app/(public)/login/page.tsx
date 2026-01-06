'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast({
                variant: 'destructive',
                title: 'Login failed',
                description: error.message,
            });
            setLoading(false);
        } else {
            router.refresh(); // Update server components to see cookies
            router.push('/admin');
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
            <div className="w-full max-w-sm space-y-6 bg-white p-8 shadow-sm rounded-sm">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-serif text-stone-900">Admin Login</h1>
                    <p className="text-stone-500 text-sm">Enter your credentials to continue</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button type="submit" className="w-full bg-stone-900 text-white" disabled={loading}>
                            {loading ? 'Processing...' : 'Sign In'}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-stone-500 hover:text-stone-900"
                            disabled={loading}
                            onClick={async () => {
                                if (!email || !password) {
                                    toast({ title: 'Validation Error', description: 'Please enter both email and password to create an account.', variant: 'destructive' });
                                    return;
                                }
                                setLoading(true);
                                const { error } = await supabase.auth.signUp({
                                    email,
                                    password,
                                });
                                if (error) {
                                    toast({ title: 'Signup Error', description: error.message, variant: 'destructive' });
                                } else {
                                    toast({ title: 'Success', description: 'Account created! Please sign in.' });
                                }
                                setLoading(false);
                            }}
                        >
                            First time? Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
