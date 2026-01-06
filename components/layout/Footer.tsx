import Link from 'next/link';
import { Facebook, Instagram, Mail } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-secondary/30 pt-16 pb-8 border-t">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="font-serif text-2xl tracking-widest uppercase mb-4 block">
                            Casa Daljul
                        </Link>
                        <p className="text-muted-foreground max-w-sm">
                            An exclusive sanctuary offering unparalleled luxury and privacy.
                            Escape to the extraordinary.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-serif text-sm uppercase tracking-widest mb-4">Explore</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/property" className="hover:text-foreground transition-colors">The Property</Link></li>
                            <li><Link href="/gallery" className="hover:text-foreground transition-colors">Gallery</Link></li>
                            <li><Link href="/location" className="hover:text-foreground transition-colors">Location</Link></li>
                            <li><Link href="/availability" className="hover:text-foreground transition-colors">Book Now</Link></li>
                        </ul>
                    </div>

                    {/* Legal / Contact */}
                    <div>
                        <h4 className="font-serif text-sm uppercase tracking-widest mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                            <li className="flex gap-4 mt-4">
                                <a href="#" className="hover:text-foreground transition-colors"><Instagram size={20} /></a>
                                <a href="#" className="hover:text-foreground transition-colors"><Facebook size={20} /></a>
                                <a href="/contact" className="hover:text-foreground transition-colors"><Mail size={20} /></a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>&copy; {currentYear} Casa Daljul. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
