'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addBlockedDate(formData: FormData) {
    const supabase = await createClient();

    const start_date = formData.get('start_date') as string;
    const end_date = formData.get('end_date') as string;
    const reason = formData.get('reason') as string;

    if (!start_date || !end_date) {
        throw new Error('Dates are required');
    }

    const { error } = await supabase.from('blocked_dates').insert({
        start_date,
        end_date,
        reason,
    });

    if (error) {
        console.error(error);
        throw new Error('Failed to block dates');
    }

    revalidatePath('/admin/blocked-dates');
    revalidatePath('/api/availability');
}

export async function deleteBlockedDate(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from('blocked_dates').delete().eq('id', id);

    if (error) {
        throw new Error('Failed to delete');
    }

    revalidatePath('/admin/blocked-dates');
    revalidatePath('/api/availability');
}
