'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateContentBlock(formData: FormData) {
    const supabase = await createClient();

    const key = formData.get('key') as string;
    const content = formData.get('content') as string;

    if (!key) throw new Error('Key required');

    const { error } = await supabase
        .from('content_blocks')
        .update({ content })
        .eq('key', key);

    if (error) {
        console.error(error);
        throw new Error('Failed to update content');
    }

    revalidatePath('/admin/content');
}
