import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Calendar, DollarSign, Image as ImageIcon, MessageSquare, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';

// Sidebar Items
const ADMIN_NAV = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/quote-requests', label: 'Quote Inbox', icon: MessageSquare },
    { href: '/admin/blocked-dates', label: 'Blocked Dates', icon: Calendar },
    { href: '/admin/stay-rules', label: 'Stay Rules', icon: Settings },
    { href: '/admin/pricing-seasons', label: 'Pricing', icon: DollarSign },
    { href: '/admin/media', label: 'Media Manager', icon: ImageIcon },
];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-stone-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-stone-900 text-stone-300 flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-stone-800">
                    <span className="font-serif text-xl text-white tracking-widest">Casa Daljul</span>
                    <span className="block text-xs uppercase tracking-wider text-stone-500 mt-1">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {ADMIN_NAV.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-stone-800 hover:text-white transition-colors text-sm font-medium"
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-stone-800">
                    <form action="/auth/signout" method="post">
                        <Button variant="ghost" className="w-full justify-start text-stone-400 hover:text-white hover:bg-stone-800 gap-3">
                            <LogOut className="h-4 w-4" /> Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="p-8">
                    {children}
                </div>
            </main>
            <Toaster />
        </div>
    );
}
