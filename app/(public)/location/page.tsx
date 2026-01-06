import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LocationPage() {
    return (
        <div className="pt-24 min-h-screen bg-stone-50">

            {/* Header */}
            <section className="container mx-auto px-4 mb-16 text-center">
                <span className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-4 block">The Region</span>
                <h1 className="font-serif text-5xl md:text-6xl text-stone-900 mb-6">Between Land & Sea</h1>
            </section>

            {/* Map Placeholder */}
            <section className="w-full h-[50vh] bg-stone-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-stone-500 font-serif text-xl">
                    Interactive Map Integration Placeholder
                </div>
            </section>

            {/* Experiences */}
            <section className="py-24 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-16">
                    <div className="space-y-6">
                        <h2 className="font-serif text-3xl text-stone-900">Getting Here</h2>
                        <p className="text-stone-600 font-light leading-relaxed">
                            Casa Daljul is located 45 minutes from the International Airport. We can arrange private transfers or provide detailed driving instructions upon booking.
                        </p>
                        <p className="text-stone-600 font-light leading-relaxed">
                            The property is situated in a protected coastal reserve, ensuring tranquility and unspoiled nature immediately upon arrival.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h2 className="font-serif text-3xl text-stone-900">Nearby Experiences</h2>
                        <ul className="space-y-4">
                            <li className="flex flex-col border-b border-stone-200 pb-4">
                                <span className="font-medium text-stone-900">Michelin Star Dining</span>
                                <span className="text-sm text-stone-500 font-light">15 minutes drive</span>
                            </li>
                            <li className="flex flex-col border-b border-stone-200 pb-4">
                                <span className="font-medium text-stone-900">Private Golf Course</span>
                                <span className="text-sm text-stone-500 font-light">10 minutes drive</span>
                            </li>
                            <li className="flex flex-col border-b border-stone-200 pb-4">
                                <span className="font-medium text-stone-900">Historical Town Center</span>
                                <span className="text-sm text-stone-500 font-light">20 minutes drive</span>
                            </li>
                        </ul>
                        <div className="pt-4">
                            <Link href="/contact" className="text-stone-900 hover:opacity-70 underline underline-offset-4">
                                Ask our concierge for recommendations
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
