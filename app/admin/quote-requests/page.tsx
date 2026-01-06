import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { Badge } from 'lucide-react'; // Placeholder badge
import { cn } from '@/lib/utils';
// Need a Badge component, manual create inline style for now

export default async function QuoteInboxPage() {
    const supabase = await createClient();

    const { data: quotes } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

    const StatusBadge = ({ status }: { status: string }) => {
        const styles = {
            new: 'bg-blue-100 text-blue-700',
            replied: 'bg-yellow-100 text-yellow-700',
            booked: 'bg-green-100 text-green-700',
            closed: 'bg-gray-100 text-gray-700',
        }[status] || 'bg-gray-100 text-gray-700';

        return (
            <span className={cn('px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider', styles)}>
                {status}
            </span>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="font-serif text-3xl text-stone-900">Quote Inbox</h1>
                <div className="text-sm text-stone-500">
                    Showing {quotes?.length || 0} requests
                </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-stone-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50 text-stone-500 font-medium uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Guest</th>
                            <th className="px-6 py-3">Dates</th>
                            <th className="px-6 py-3">Est. Total</th>
                            <th className="px-6 py-3">Received</th>
                            {/* <th className="px-6 py-3 text-right">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {quotes?.map((quote) => (
                            <tr key={quote.id} className="hover:bg-stone-50/50 cursor-pointer">
                                <td className="px-6 py-4"><StatusBadge status={quote.status} /></td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-stone-900">{quote.full_name}</div>
                                    <div className="text-xs text-stone-500">{quote.guests} guests</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-stone-900">{format(new Date(quote.check_in), 'MMM dd')} - {format(new Date(quote.check_out), 'MMM dd, yyyy')}</div>
                                    {/* Nights count could go here */}
                                </td>
                                <td className="px-6 py-4 font-mono text-stone-600">
                                    {quote.estimate_min
                                        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: quote.estimate_currency || 'USD' }).format(quote.estimate_min)
                                        : '-'
                                    }
                                </td>
                                <td className="px-6 py-4 text-stone-500">{format(new Date(quote.created_at), 'MMM dd HH:mm')}</td>
                                {/* <td className="px-6 py-4 text-right"> View Details </td> */}
                            </tr>
                        ))}
                        {(!quotes || quotes.length === 0) && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-stone-400">No requests yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
