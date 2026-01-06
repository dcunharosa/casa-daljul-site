import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { addMonths, startOfDay, endOfDay } from 'date-fns';

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;

    // Default range: now to 18 months from now
    const now = new Date();
    const defaultTo = addMonths(now, 18);

    const from = searchParams.get('from') || now.toISOString();
    const to = searchParams.get('to') || defaultTo.toISOString();

    // Use service role key logic if we needed to bypass RLS, but here we can rely on 
    // public policy OR admin policy. Wait, the prompt said:
    // "blocked_dates should NOT be publicly readable from DB... Use API route... to return sanitized ranges"
    // So we must use Service Role to fetch, because anon user cannot read blocked_dates directly (per my SQL RLS).

    // Actually, my SQL `admin_read_blocked_dates` is for authenticated only. 
    // So yes, I need to fetch with SERVICE_ROLE key to bypass RLS for public availability check.
    // HOWEVER, `createClient` uses standard auth. I need a service role client here.
    // I'll create a local instance using the secret key just for this route.

    const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
    const serviceClient = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: blocked, error } = await serviceClient
        .from('blocked_dates')
        .select('start_date, end_date')
        .gte('end_date', from) // overlap logic optimization
        .lte('start_date', to);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also fetch public stay rules and pricing seasons for the frontend to use in calculations?
    // The requirement says "Validation validating stay rules live + helpful messages".
    // The frontend needs `stay_rules` and `pricing_seasons`. 
    // Those are public readable in SQL, so frontend can fetch them directly via client-side Supabase,
    // OR we can bundle them here. Bundling is efficient. Let's bundle.

    const { data: rules } = await supabase
        .from('stay_rules')
        .select('*')
        .lte('start_date', to)
        .gte('end_date', from);

    const { data: seasons } = await supabase
        .from('pricing_seasons')
        .select('*')
        .lte('start_date', to)
        .gte('end_date', from);

    return NextResponse.json({
        blocked: blocked || [],
        rules: rules || [],
        seasons: seasons || []
    });
}
