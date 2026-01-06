import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

const AMENITIES = [
    "Infinity Pool (Heated)",
    "Private Beach Access",
    "Chef's Kitchen",
    "Fiber Optic Wi-Fi",
    "Sonos Sound System",
    "Daily Housekeeping",
    "Concierge Service",
    "Gym & Yoga Studio",
    "Wine Cellar",
    "Home Cinema"
];

export default async function PropertyPage() {
    const supabase = await createClient();
    const { data: propData } = await supabase
        .from('site_content')
        .select('value')
        .eq('key', 'property_image_url')
        .single();

    const propUrl = propData?.value?.url || '/images/property.jpg';

    return (
        <div className="pt-24 min-h-screen bg-stone-50">

            {/* Header */}
            <section className="container mx-auto px-4 mb-16 text-center">
                <span className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-4 block">The Property</span>
                <h1 className="font-serif text-5xl md:text-6xl text-stone-900 mb-6">Designed for Living</h1>
                <p className="text-lg text-stone-600 max-w-2xl mx-auto font-light">
                    Every detail of Casa Daljul has been considered to provide a seamless blend of indoor and outdoor living.
                </p>
            </section>

            {/* Main Content Split */}
            <section className="container mx-auto px-4 grid md:grid-cols-2 gap-12 lg:gap-24 mb-24 items-center">
                <div className="aspect-[4/5] bg-stone-200 relative overflow-hidden rounded-sm">
                    {/* Manual Choice Property Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${propUrl}')` }}
                    />
                </div>
                <div className="space-y-8">
                    <h2 className="font-serif text-3xl md:text-4xl text-stone-900">Interiors</h2>
                    <p className="text-stone-600 leading-relaxed font-light">
                        The interiors capture the essence of coastal luxury. High ceilings and floor-to-ceiling windows flood the space with natural light, while curated furniture pieces add warmth and character using natural materials like oak, linen, and stone.
                    </p>
                    <p className="text-stone-600 leading-relaxed font-light">
                        With 5 en-suite bedrooms, Casa Daljul comfortably sleeps up to 10 guests. Each room offers a unique view of the surrounding landscape, ensuring that nature is the first thing you see when you wake up.
                    </p>
                    <div className="pt-4">
                        <Button variant="outline" className="rounded-full px-8 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors">
                            View Floorplan
                        </Button>
                    </div>
                </div>
            </section>

            {/* Amenities Section */}
            <section className="bg-white py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-12 text-center">Amenities</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            {AMENITIES.map((item) => (
                                <div key={item} className="flex items-center gap-4 text-stone-700 font-light border-b border-stone-100 pb-2">
                                    <div className="h-6 w-6 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                                        <Check className="h-3 w-3 text-stone-900" />
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-stone-900 text-white text-center">
                <div className="container mx-auto px-4 space-y-8">
                    <h2 className="font-serif text-4xl md:text-5xl">Ready to experience it?</h2>
                    <Button asChild size="lg" className="rounded-full px-10 py-6 text-lg bg-white text-stone-900 hover:bg-stone-200 border-none">
                        <Link href="/availability">Check Availability</Link>
                    </Button>
                </div>
            </section>

        </div>
    );
}
