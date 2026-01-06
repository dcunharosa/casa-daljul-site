'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addPricingSeason(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get('name') as string;
    const start_date = formData.get('start_date') as string;
    const end_date = formData.get('end_date') as string;
    const nightly_min = parseFloat(formData.get('nightly_min') as string);
    const nightly_max = parseFloat(formData.get('nightly_max') as string);

    if (!start_date || !end_date) throw new Error('Dates required');

    const { error } = await supabase.from('pricing_seasons').insert({
        name,
        start_date,
        end_date,
        nightly_min,
        nightly_max,
        currency: 'USD'
    });

    if (error) {
        console.error(error);
        throw new Error('Failed to add pricing');
    }

    revalidatePath('/admin/pricing-seasons');
    revalidatePath('/api/availability');
}

export async function deletePricingSeason(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('pricing_seasons').delete().eq('id', id);
    if (error) throw new Error('Failed to delete');
    revalidatePath('/admin/pricing-seasons');
    revalidatePath('/api/availability');
}
