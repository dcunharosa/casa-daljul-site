import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addStayRule, deleteStayRule } from './actions';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

export default async function StayRulesPage() {
    const supabase = await createClient();

    const { data: rules } = await supabase
        .from('stay_rules')
        .select('*')
        .order('start_date', { ascending: true });

    const DeleteButton = ({ id }: { id: string }) => (
        <form action={async () => { 'use server'; await deleteStayRule(id); }}>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
        </form>
    );

    return (
        <div className="space-y-8 max-w-5xl">
            <div className="flex justify-between items-center">
                <h1 className="font-serif text-3xl text-stone-900">Stay Rules</h1>
                <Button className="bg-stone-900 text-white">Preset: Peak Season (Sat-Sat)</Button>
            </div>

            {/* Add Form */}
            <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-100">
                <h2 className="text-lg font-medium mb-4">Add Rule</h2>
                <form action={addStayRule} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input name="name" id="name" placeholder="Summer 2026" required />
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
                        <Label htmlFor="min">Min Nights</Label>
                        <Input type="number" name="min_nights" id="min" defaultValue={3} required min={1} />
                    </div>

                    <Button type="submit" className="bg-stone-900 text-white">Save</Button>
                </form>
                <p className="text-xs text-stone-400 mt-2">
                    * Advanced settings (exact nights, check-in days) can be edited in DB dashboard for now.
                </p>
            </div>

            {/* List */}
            <div className="bg-white rounded-sm shadow-sm border border-stone-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-stone-50 text-stone-500 font-medium uppercase tracking-wider text-xs">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Dates</th>
                            <th className="px-6 py-3">Min Stay</th>
                            <th className="px-6 py-3">Priority</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {rules?.map((rule) => (
                            <tr key={rule.id} className="hover:bg-stone-50/50">
                                <td className="px-6 py-4 font-medium text-stone-900">{rule.name}</td>
                                <td className="px-6 py-4">{format(new Date(rule.start_date), 'MMM dd')} - {format(new Date(rule.end_date), 'MMM dd, yyyy')}</td>
                                <td className="px-6 py-4">{rule.min_nights} nights</td>
                                <td className="px-6 py-4">{rule.priority}</td>
                                <td className="px-6 py-4 text-right">
                                    <DeleteButton id={rule.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
