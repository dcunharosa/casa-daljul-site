'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
    heroUrl: string;
}

export function HeroSection({ heroUrl }: HeroSectionProps) {
    const [isLoaded, setIsLoaded] = React.useState(false);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Stone Fallback */}
            <div className="absolute inset-0 bg-stone-900 z-0" />

            {/* Dynamic Hero Image with Fade-in */}
            <div className={cn(
                "absolute inset-0 z-0 transition-opacity duration-1000 ease-out",
                isLoaded ? "opacity-60" : "opacity-0"
            )}>
                <Image
                    src={heroUrl}
                    alt="Casa Daljul Hero"
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                    onLoad={() => setIsLoaded(true)}
                />
            </div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/30 z-5" />

            <div className="relative z-10 text-center text-white space-y-8 px-4 max-w-4xl mx-auto">
                <h1 className={cn(
                    "font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-tight transition-all duration-1000 transform",
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                )}>
                    Casa Daljul
                </h1>
                <p className={cn(
                    "text-lg md:text-2xl font-light tracking-wide max-w-2xl mx-auto transition-all duration-1000 delay-300 transform",
                    isLoaded ? "translate-y-0 opacity-90" : "translate-y-8 opacity-0"
                )}>
                    A sanctuary of silence and luxury on the coast.
                </p>
                <div className={cn(
                    "pt-8 transition-all duration-1000 delay-500 transform",
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                )}>
                    <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg bg-white text-stone-900 hover:bg-stone-100 border-none transition-transform hover:scale-105">
                        <Link href="/availability">Request a Quote</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
