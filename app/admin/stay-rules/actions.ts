'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addStayRule(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get('name') as string;
    const start_date = formData.get('start_date') as string;
    const end_date = formData.get('end_date') as string;
    const min_nights = parseInt(formData.get('min_nights') as string);
    const priority = parseInt(formData.get('priority') as string || '0');

    // Handle Checkboxes manually for now (simple comma separated or multi-value)
    // Limitation of formData for arrays: safer to assume JSON submit or parse distinct fields
    // For MVP: let's not implement complex DOW picker in this server action simple form yet, 
    // or just default to null (any day).

    if (!start_date || !end_date) throw new Error('Dates required');

    const { error } = await supabase.from('stay_rules').insert({
        name,
        start_date,
        end_date,
        min_nights,
        priority,
        // allowed_check_in_dow: [6] example
    });

    if (error) {
        console.error(error);
        throw new Error('Failed to add rule');
    }

    revalidatePath('/admin/stay-rules');
    revalidatePath('/api/availability');
}

export async function deleteStayRule(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('stay_rules').delete().eq('id', id);
    if (error) throw new Error('Failed to delete');
    revalidatePath('/admin/stay-rules');
    revalidatePath('/api/availability');
}
