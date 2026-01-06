import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, MapPin, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function Home() {
  const supabase = await createClient();
  const { data: contentData } = await supabase
    .from('site_content')
    .select('key, value')
    .in('key', ['hero_image_url', 'parallax_image_url', 'home_quote_text']);

  const contentMap: Record<string, any> = {};
  contentData?.forEach((item: any) => {
    contentMap[item.key] = item.value;
  });

  const heroUrl = contentMap['hero_image_url']?.url || '/images/hero.jpg';
  const parallaxUrl = contentMap['parallax_image_url']?.url || 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop';
  const homeQuote = contentMap['home_quote_text']?.text || 'A masterpiece of light and space.';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Hero Image */}
        <div className="absolute inset-0 bg-stone-900 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url('${heroUrl}')` }}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center text-white space-y-8 px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight leading-tight animate-fade-in-up">
            Casa Daljul
          </h1>
          <p className="text-lg md:text-2xl font-light tracking-wide max-w-2xl mx-auto opacity-90 animate-fade-in-up delay-200">
            A sanctuary of silence and luxury on the coast.
          </p>
          <div className="pt-8 animate-fade-in-up delay-300">
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg bg-white text-stone-900 hover:bg-stone-100 border-none transition-transform hover:scale-105">
              <Link href="/availability">Request a Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Intro / Story Section */}
      <section className="py-24 px-4 bg-stone-50">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <span className="text-sm font-serif uppercase tracking-[0.2em] text-stone-500">The Experience</span>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 leading-tight">
            Where time slows down, and nature takes center stage.
          </h2>
          <p className="text-lg text-stone-600 leading-relaxed font-light">
            Perched on the cliffs overlooking the Atlantic, Casa Daljul is more than a rental—it's a private retreat designed for those who seek solitude without compromising on luxury. Crafted with local stone and wood, every corner frames a view of the endless horizon.
          </p>
          <div className="pt-8">
            <Link href="/property" className="inline-flex items-center gap-2 text-stone-900 border-b border-stone-900 pb-1 hover:opacity-70 transition-opacity">
              Discover the Property <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights / Features Grid */}
      <section className="py-24 border-t border-stone-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

            <div className="space-y-4 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-900">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl">Privacy First</h3>
              <p className="text-stone-600 font-light">
                Secluded grounds ensuring complete privacy for you and your guests.
              </p>
            </div>

            <div className="space-y-4 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-900">
                <Wind className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl">Ocean Breeze</h3>
              <p className="text-stone-600 font-light">
                Open-plan living that invites the fresh Atlantic air into every room.
              </p>
            </div>

            <div className="space-y-4 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-900">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-2xl">Prime Location</h3>
              <p className="text-stone-600 font-light">
                Minutes from the beach, yet worlds away from the crowds.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Parallax Section */}
      <section className="h-[60vh] bg-stone-900 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-fixed bg-center opacity-80"
          style={{ backgroundImage: `url('${parallaxUrl}')` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white font-serif text-3xl md:text-5xl italic tracking-wider text-center px-4">
            "{homeQuote}"
          </p>
        </div>
      </section>

    </div>
  );
}
