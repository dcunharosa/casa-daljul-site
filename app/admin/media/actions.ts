'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSiteImage(key: string, url: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('site_content')
        .upsert({
            key,
            value: { url },
            updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

    if (error) {
        console.error('Error updating site image:', error);
        throw new Error('Failed to update site image');
    }

    revalidatePath('/');
    revalidatePath('/property');
    revalidatePath('/admin/media');
}
