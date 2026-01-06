import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addPricingSeason, deletePricingSeason } from './actions';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

export default async function PricingPage() {
    const supabase = await createClient();

    const { data: seasons } = await supabase
        .from('pricing_seasons')
        .select('*')
        .order('start_date', { ascending: true });

    const DeleteButton = ({ id }: { id: string }) => (
        <form action={async () => { 'use server'; await deletePricingSeason(id); }}>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
        </form>
    );

    return (
        <div className="space-y-8 max-w-5xl">
            <h1 className="font-serif text-3xl text-stone-900">Pricing Seasons</h1>

            {/* Add Form */}
            <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-100">
                <h2 className="text-lg font-medium mb-4">Add Season</h2>
                <form action={addPricingSeason} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input name="name" id="name" placeholder="Standard 2026" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="start">Start</Label>
                        <Input type="date" name="start_date" id="start" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="end">End</Label>
                        <Input type="date" name="end_date" id="end" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Nightly (Min)</Label>
                        <Input type="number" name="nightly_min" id="price" placeholder="500" required step="0.01" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="priceMax">Nightly (Max)</Label>
                        <Input type="number" name="nightly_max" id="priceMax" placeholder="700" required step="0.01" />
                    </div>

                    <Button type="submit" className="bg-stone-900 text-white md:col-span-6 w-full md:w-auto self-end mt-4">Save Season</Button>
                </form>
            </div>

            {/* List */}
            <div className="bg-white rounded-sm shadow-sm border border-stone-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50 text-stone-500 font-medium uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Dates</th>
                            <th className="px-6 py-3">Nightly Range</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {seasons?.map((season) => (
                            <tr key={season.id} className="hover:bg-stone-50/50">
                                <td className="px-6 py-4 font-medium text-stone-900">{season.name}</td>
                                <td className="px-6 py-4">{format(new Date(season.start_date), 'MMM dd')} - {format(new Date(season.end_date), 'MMM dd, yyyy')}</td>
                                <td className="px-6 py-4 font-mono">
                                    {season.currency} {season.nightly_min} - {season.nightly_max}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <DeleteButton id={season.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
