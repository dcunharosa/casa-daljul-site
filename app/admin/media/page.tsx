'use client';

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, Upload, Star, Home as HomeIcon, Copy, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { toast } from '@/components/ui/use-toast';
import { updateSiteImage } from './actions';
import { cn } from '@/lib/utils';

export default function MediaManagerPage() {
    const supabase = createClient();
    const [images, setImages] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [assignments, setAssignments] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchImages();
        fetchAssignments();
    }, []);

    async function fetchImages() {
        const { data, error } = await supabase.storage.from('site-media').list();
        if (data) {
            setImages(data);
        }
    }

    async function fetchAssignments() {
        const { data, error } = await supabase
            .from('site_content')
            .select('*')
            .in('key', ['hero_image_url', 'property_image_url', 'parallax_image_url']);

        if (data) {
            const map: Record<string, string> = {};
            data.forEach(item => {
                map[item.key] = item.value?.url || '';
            });
            setAssignments(map);
        }
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) {
                return;
            }

            const files = Array.from(e.target.files);
            const uploadPromises = files.map(async (file) => {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('site-media')
                    .upload(filePath, file);

                if (uploadError) {
                    throw uploadError;
                }
            });

            await Promise.all(uploadPromises);

            toast({
                title: 'Success',
                description: `${files.length} image${files.length > 1 ? 's' : ''} uploaded`
            });
            fetchImages();
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setUploading(false);
            if (e.target) e.target.value = '';
        }
    }

    async function handleDelete(name: string) {
        if (!confirm('Are you sure?')) return;
        const { error } = await supabase.storage.from('site-media').remove([name]);
        if (error) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: 'Success', description: 'Image deleted' });
            fetchImages();
        }
    }

    async function setAs(key: string, url: string) {
        try {
            await updateSiteImage(key, url);
            const label = key === 'hero_image_url' ? 'Hero' : key === 'property_image_url' ? 'Property' : 'Parallax';
            toast({ title: 'Updated', description: `Assigned as ${label} image.` });
            fetchAssignments();
        } catch (err: any) {
            toast({ title: 'Error', description: err.message, variant: 'destructive' });
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="font-serif text-3xl text-stone-900">Media Manager</h1>
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleUpload}
                        accept="image/*"
                        multiple
                    />
                    <Button
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-stone-900 text-white hover:bg-stone-800 transition-all active:scale-95"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                Uploading Batch...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Images
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((file) => {
                    const { data: { publicUrl } } = supabase.storage.from('site-media').getPublicUrl(file.name);
                    const isHero = assignments['hero_image_url'] === publicUrl;
                    const isProperty = assignments['property_image_url'] === publicUrl;
                    const isParallax = assignments['parallax_image_url'] === publicUrl;

                    return (
                        <motion.div
                            key={file.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative group aspect-square bg-stone-100 rounded-lg overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <Image
                                src={publicUrl}
                                alt={file.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Status Badges - Top Layer */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-20">
                                {isHero && (
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm border border-white/20"
                                    >
                                        <Star className="h-3 w-3 fill-white" /> HERO
                                    </motion.div>
                                )}
                                {isProperty && (
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="bg-blue-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm border border-white/20"
                                    >
                                        <HomeIcon className="h-3 w-3 fill-white" /> PROP
                                    </motion.div>
                                )}
                                {isParallax && (
                                    <motion.div
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        className="bg-purple-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm border border-white/20"
                                    >
                                        <ImageIcon className="h-3 w-3" /> PARA
                                    </motion.div>
                                )}
                            </div>

                            {/* Hover Overlay - Premium Glassmorphism */}
                            <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-md z-10 flex flex-col justify-end p-4">
                                <div className="flex flex-col gap-4 translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out">
                                    {/* Action row - Copy/Delete */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="flex-1 h-9 bg-white text-stone-900 hover:bg-stone-100 border-none shadow-xl active:scale-95 transition-all font-medium text-xs"
                                            onClick={() => {
                                                navigator.clipboard.writeText(publicUrl);
                                                toast({ description: 'URL copied!' });
                                            }}
                                        >
                                            <Copy className="h-3.5 w-3.5 mr-2" /> Copy link
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-9 w-9 bg-red-500 hover:bg-red-600 border-none shadow-xl active:scale-95 transition-all"
                                            onClick={() => handleDelete(file.name)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Assignment Buttons - Sharper contrast */}
                                    <div className="flex flex-col gap-1.5 pt-3 border-t border-white/10">
                                        {[
                                            { key: 'hero_image_url', active: isHero, label: 'Hero', color: 'amber' },
                                            { key: 'property_image_url', active: isProperty, label: 'Property', color: 'blue' },
                                            { key: 'parallax_image_url', active: isParallax, label: 'Parallax', color: 'purple' }
                                        ].map((item) => (
                                            <button
                                                key={item.key}
                                                onClick={() => setAs(item.key, publicUrl)}
                                                className={cn(
                                                    "w-full text-left px-3 h-8 rounded-md text-[11px] font-semibold tracking-wide transition-all border flex items-center justify-between group/btn",
                                                    item.active
                                                        ? `bg-${item.color}-500 border-${item.color}-400 text-white shadow-lg`
                                                        : "bg-white/5 border-white/10 text-white/90 hover:bg-white/15 hover:border-white/20"
                                                )}
                                            >
                                                <span>{item.active ? `Assigned to ${item.label}` : `Set as ${item.label}`}</span>
                                                {item.active && <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Filename Footer */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900/80 to-transparent text-white text-[10px] p-2 pt-4 truncate px-2 font-mono flex items-center justify-between">
                                <span className="opacity-80">{file.name}</span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
