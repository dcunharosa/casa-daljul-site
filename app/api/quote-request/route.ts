import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
// import { Resend } from 'resend'; // Uncomment when ready to send real emails
import { createClient } from '@supabase/supabase-js'; // Use admin client for write access
import { calculateEstimate } from '@/lib/pricing';
import { validateStay } from '@/lib/rules';

// Env variables should be checked (omitted here for brevity, assume they exist)

// Admin Client to write to protected tables
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// const resend = new Resend(process.env.RESEND_API_KEY!);

const requestSchema = z.object({
    fullName: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    guests: z.number().min(1),
    check_in: z.string(), // YYYY-MM-DD
    check_out: z.string(),
    specialRequests: z.string().optional(),
    prefersWhatsapp: z.boolean(),
    // estimate from client is ignored for security, we recalc
    turnstile_token: z.string().optional(), // Verify this if needed
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const data = requestSchema.parse(body);

        const checkIn = new Date(data.check_in);
        const checkOut = new Date(data.check_out);

        // 1. Verify Turnstile (TODO)
        // const turnstileRes = await fetch(...)

        // 2. Fetch Data needed for Validation (Blocked Dates, Rules, Seasons)
        const [blockedData, rulesData, seasonsData] = await Promise.all([
            supabaseAdmin.from('blocked_dates').select('*'),
            supabaseAdmin.from('stay_rules').select('*'),
            supabaseAdmin.from('pricing_seasons').select('*')
        ]);

        const blockedDates = blockedData.data || [];
        const rules = rulesData.data || [];
        const seasons = seasonsData.data || [];

        // 3. Server-side Validation
        const validation = validateStay(checkIn, checkOut, rules, blockedDates);
        if (!validation.valid) {
            return NextResponse.json({ message: validation.errors[0] }, { status: 400 });
        }

        // 4. Calculate Estimate
        const estimate = calculateEstimate(checkIn, checkOut, seasons);
        if (!estimate) {
            // Allow quote even if no estimate? Prompt says "estimate appears... and is stored".
            // If no pricing, we store nulls.
        }

        // 5. Insert into DB
        const { data: quote, error } = await supabaseAdmin
            .from('quote_requests')
            .insert({
                check_in: data.check_in,
                check_out: data.check_out,
                guests: data.guests,
                full_name: data.fullName,
                email: data.email,
                phone: data.phone,
                prefers_whatsapp: data.prefersWhatsapp,
                special_requests: data.specialRequests,
                estimate_min: estimate?.min ?? null,
                estimate_max: estimate?.max ?? null,
                estimate_currency: estimate?.currency ?? null,
                estimate_breakdown: estimate?.breakdown ?? null, // Cast to JSON
                status: 'new',
                source_page: 'availability'
            })
            .select()
            .single();

        if (error) {
            console.error('DB Insert Error:', error);
            return NextResponse.json({ message: 'Failed to save request' }, { status: 500 });
        }

        // 6. Send Emails (Resend)
        // TODO: Implement actual email sending
        // await resend.emails.send({ ... })

        console.log('Quote Request Saved:', quote.id);

        return NextResponse.json({ ok: true, id: quote.id });

    } catch (error: any) {
        console.error('Request Error:', error);
        return NextResponse.json({ message: error.message || 'Invalid request' }, { status: 400 });
    }
}
