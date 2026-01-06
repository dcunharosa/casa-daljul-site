import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addBlockedDate, deleteBlockedDate } from './actions';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

export default async function BlockedDatesPage() {
    const supabase = await createClient();

    // Fetch blocks
    const { data: blocks } = await supabase
        .from('blocked_dates')
        .select('*')
        .order('start_date', { ascending: true });

    // Simple Delete Component
    const DeleteButton = ({ id }: { id: string }) => {
        return (
            <form action={async () => {
                'use server';
                await deleteBlockedDate(id);
            }}>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </form>
        );
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <h1 className="font-serif text-3xl text-stone-900">Blocked Dates</h1>

            {/* Add New Block Form */}
            <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-100">
                <h2 className="text-lg font-medium mb-4">Block New Range</h2>
                <form action={addBlockedDate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <Label htmlFor="start">Start Date (Inc)</Label>
                        <Input type="date" name="start_date" id="start" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="end">End Date (Exc)</Label>
                        <Input type="date" name="end_date" id="end" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason (Internal)</Label>
                        <Input type="text" name="reason" id="reason" placeholder="Maintenance" />
                    </div>
                    <Button type="submit" className="bg-stone-900 text-white">Block Dates</Button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-sm shadow-sm border border-stone-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50 text-stone-500 font-medium uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-3">Start</th>
                            <th className="px-6 py-3">End</th>
                            <th className="px-6 py-3">Reason</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {blocks?.map((block) => (
                            <tr key={block.id} className="hover:bg-stone-50/50">
                                <td className="px-6 py-4">{format(new Date(block.start_date), 'MMM dd, yyyy')}</td>
                                <td className="px-6 py-4">{format(new Date(block.end_date), 'MMM dd, yyyy')}</td>
                                <td className="px-6 py-4 text-stone-500">{block.reason || '-'}</td>
                                <td className="px-6 py-4 text-right">
                                    <DeleteButton id={block.id} />
                                </td>
                            </tr>
                        ))}
                        {(!blocks || blocks.length === 0) && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-stone-400 italic">No blocked dates found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
