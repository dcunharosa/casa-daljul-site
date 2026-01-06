'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
    { href: '/property', label: 'Property' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/location', label: 'Location' },
];

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    React.useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const isHome = pathname === '/';

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled
                    ? 'bg-background/80 backdrop-blur-md border-b py-4'
                    : 'bg-transparent py-6'
            )}
        >
            <div className="container mx-auto px-4 md:px-6">
                <nav className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className={cn(
                            'font-serif text-2xl tracking-widest uppercase transition-colors',
                            !scrolled && isHome ? 'text-white' : 'text-foreground'
                        )}
                    >
                        Casa Daljul
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-sm tracking-widest uppercase hover:opacity-70 transition-opacity',
                                    !scrolled && isHome ? 'text-white' : 'text-foreground'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Button
                            asChild
                            variant={!scrolled && isHome ? 'secondary' : 'default'}
                            className="ml-4 rounded-full px-6"
                        >
                            <Link href="/availability">Book Your Stay</Link>
                        </Button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden z-50"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu
                                className={cn(
                                    'h-6 w-6',
                                    !scrolled && isHome && !isOpen ? 'text-white' : 'text-foreground'
                                )}
                            />
                        )}
                    </button>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-background pt-24 px-4 pb-8 md:hidden flex flex-col items-center gap-8 text-center"
                    >
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-2xl font-serif text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Button asChild size="lg" className="mt-4 rounded-full w-full max-w-xs">
                            <Link href="/availability">Book Your Stay</Link>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
