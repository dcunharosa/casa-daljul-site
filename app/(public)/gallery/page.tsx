'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';

import { createClient } from '@/lib/supabase/client';

// Fallback images if storage is empty
// Fallback images if storage is empty (or for local review)
const PLACEHOLDER_IMAGES = [
    { id: '1', src: '/images/gallery/1.jpg', alt: 'Ocean View' },
    { id: '2', src: '/images/gallery/2.jpg', alt: 'Interior Living' },
    { id: '3', src: '/images/gallery/3.jpg', alt: 'Bedroom' },
    { id: '4', src: '/images/gallery/4.jpg', alt: 'Bathroom' },
    { id: '5', src: '/images/gallery/5.jpg', alt: 'Pool Area' },
    { id: '6', src: '/images/gallery/6.jpg', alt: 'Kitchen' },
];

type GalleryImage = {
    id: string;
    src: string;
    alt: string;
};

export default function GalleryPage() {
    const [images, setImages] = React.useState<GalleryImage[]>(PLACEHOLDER_IMAGES);
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const supabase = createClient();

    React.useEffect(() => {
        async function fetchImages() {
            const { data, error } = await supabase.storage.from('site-media').list();

            if (data && data.length > 0) {
                const dynamicImages = data.map((file) => {
                    const { data: { publicUrl } } = supabase.storage.from('site-media').getPublicUrl(file.name);
                    return {
                        id: file.id, // Use Supabase file ID
                        src: publicUrl,
                        alt: file.name, // Use filename as alt for now
                    };
                });
                setImages(dynamicImages);
            }
        }
        fetchImages();
    }, []);

    const selectedImage = images.find((img) => img.id === selectedId);
    const selectedIndex = images.findIndex((img) => img.id === selectedId);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        const nextIndex = (selectedIndex + 1) % images.length;
        setSelectedId(images[nextIndex].id);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        const prevIndex = (selectedIndex - 1 + images.length) % images.length;
        setSelectedId(images[prevIndex].id);
    };

    return (
        <div className="pt-24 min-h-screen bg-white pb-24">
            <div className="container mx-auto px-4">
                <h1 className="font-serif text-5xl md:text-6xl text-stone-900 mb-12 text-center">What you can look forward to</h1>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                    {images.map((image) => (
                        <motion.div
                            key={image.id}
                            layoutId={`image-${image.id}`}
                            className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-sm"
                            onClick={() => setSelectedId(image.id)}
                        >
                            <OptimizedImage
                                src={image.src}
                                alt={image.alt}
                                width={800}
                                height={600}
                                className="transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-serif tracking-widest text-sm uppercase">View</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedId && selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setSelectedId(null)}
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 text-white hover:bg-white/10"
                            onClick={() => setSelectedId(null)}
                        >
                            <X className="h-6 w-6" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hidden md:flex"
                            onClick={handlePrev}
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hidden md:flex"
                            onClick={handleNext}
                        >
                            <ChevronRight className="h-8 w-8" />
                        </Button>

                        <motion.div
                            layoutId={`image-${selectedImage.id}`}
                            className="relative w-full max-w-5xl aspect-[3/2] md:aspect-[16/9]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <OptimizedImage
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                fill
                                className="object-contain"
                                priority
                            />
                            <div className="absolute bottom-[-3rem] left-0 right-0 text-center text-white/70 font-serif text-sm">
                                {selectedImage.alt}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
