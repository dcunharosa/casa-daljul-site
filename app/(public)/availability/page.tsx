'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DayPicker, DateRange as DayPickerDateRange } from 'react-day-picker';
import { addMonths, format, isBefore, startOfToday } from 'date-fns';
import { Loader2, Calendar as CalendarIcon, Info } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
// Note: We need to install toaster or create use-toast manually if shadcn didn't fully scaffold it. 
// I'll assume standard shadcn toast structure or mock it for now.
import { Toaster } from '@/components/ui/toaster';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { calculateEstimate } from '@/lib/pricing';
import { validateStay } from '@/lib/rules';
import { BlockedDate, PricingSeason, StayRule, QuoteEstimate } from '@/lib/types';

import 'react-day-picker/dist/style.css';


// --- Zod Schema ---
const quoteSchema = z.object({
    fullName: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    guests: z.number().min(1, 'At least 1 guest').max(10, 'Max 10 guests'),
    specialRequests: z.string().optional(),
    prefersWhatsapp: z.boolean(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;


export default function AvailabilityPage() {
    const [dateRange, setDateRange] = React.useState<DayPickerDateRange | undefined>();
    const [blockedDates, setBlockedDates] = React.useState<BlockedDate[]>([]);
    const [stayRules, setStayRules] = React.useState<StayRule[]>([]);
    const [seasons, setSeasons] = React.useState<PricingSeason[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [estimate, setEstimate] = React.useState<QuoteEstimate | null>(null);
    const [validationError, setValidationError] = React.useState<string | null>(null);
    const [submitting, setSubmitting] = React.useState(false);

    const form = useForm<QuoteFormData>({
        resolver: zodResolver(quoteSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            guests: 2,
            specialRequests: '',
            prefersWhatsapp: false,
        },
    });

    // Fetch blocked dates & rules
    React.useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/availability');
                if (!res.ok) throw new Error('Failed to fetch availability');
                const data = await res.json();
                setBlockedDates(data.blocked);
                setStayRules(data.rules);
                setSeasons(data.seasons);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Update Estimate & Validate when dates change
    React.useEffect(() => {
        setEstimate(null);
        setValidationError(null);

        if (dateRange?.from && dateRange?.to) {
            // 1. Validate
            const validation = validateStay(dateRange.from, dateRange.to, stayRules, blockedDates);
            if (!validation.valid) {
                setValidationError(validation.errors[0]); // Show first error
                return;
            }

            // 2. Estimate
            const est = calculateEstimate(dateRange.from, dateRange.to, seasons);
            setEstimate(est);
        }
    }, [dateRange, stayRules, blockedDates, seasons]);

    // Handle Form Submission
    async function onSubmit(data: QuoteFormData) {
        if (!dateRange?.from || !dateRange?.to) {
            setValidationError('Please select check-in and check-out dates');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/quote-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    check_in: format(dateRange.from, 'yyyy-MM-dd'),
                    check_out: format(dateRange.to, 'yyyy-MM-dd'),
                    estimate,
                    turnstile_token: 'mock-token', // TODO: Implement Turnstile
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Something went wrong');
            }

            // Success
            alert('Quote request sent! Check your email.'); // Replace with Toast
            form.reset();
            setDateRange(undefined);

        } catch (error: any) {
            alert(error.message);
        } finally {
            setSubmitting(false);
        }
    }

    // Disable blocked days in calendar
    const disabledDays = [
        { before: startOfToday() },
        ...blockedDates.map(b => ({
            from: new Date(b.start_date),
            to: new Date(b.end_date)
        }))
    ];

    return (
        <div className="pt-24 min-h-screen bg-stone-50 pb-24">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-8 text-center">Plan Your Stay</h1>

                <div className="grid lg:grid-cols-12 gap-12">

                    {/* LEFT: Calendar Section */}
                    <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-sm shadow-sm">
                        <h2 className="font-serif text-2xl mb-6">Select Dates</h2>
                        <div className="flex justify-center border rounded-md p-4">
                            {loading ? (
                                <div className="py-12"><Loader2 className="animate-spin text-stone-400" /></div>
                            ) : (
                                <DayPicker
                                    mode="range"
                                    selected={dateRange}
                                    onSelect={setDateRange}
                                    disabled={disabledDays}
                                    numberOfMonths={2}
                                    pagedNavigation
                                    showOutsideDays={false}
                                    classNames={{
                                        day_selected: "bg-stone-900 text-white hover:bg-stone-800",
                                        day_range_middle: "bg-stone-100 text-stone-900",
                                    }}
                                />
                            )}
                        </div>

                        {/* Dynamic Feedback */}
                        <div className="mt-6 min-h-[3rem]">
                            {validationError ? (
                                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md text-sm flex items-center gap-2">
                                    <Info className="h-4 w-4" /> {validationError}
                                </div>
                            ) : dateRange?.from && dateRange?.to && estimate ? (
                                <div className="bg-stone-50 px-4 py-3 rounded-md border border-stone-200">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-sm text-stone-500 font-medium">Estimated Total ({estimate.currency})</span>
                                        <span className="text-xl font-serif text-stone-900">
                                            {estimate.min === estimate.max
                                                ? new Intl.NumberFormat('en-US', { style: 'currency', currency: estimate.currency }).format(estimate.min)
                                                : `${new Intl.NumberFormat('en-US', { style: 'currency', currency: estimate.currency }).format(estimate.min)} - ${new Intl.NumberFormat('en-US', { style: 'currency', currency: estimate.currency }).format(estimate.max)}`
                                            }
                                        </span>
                                    </div>
                                    <p className="text-xs text-stone-400 mt-1">*Final price confirmed upon review.</p>
                                </div>
                            ) : (
                                <p className="text-stone-400 text-sm text-center italic">Select start and end dates to see availability.</p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Quote Form */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-6 md:p-8 rounded-sm shadow-sm sticky top-24">
                            <h2 className="font-serif text-2xl mb-6">Request a Quote</h2>

                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="checkIn">Check-in</Label>
                                        <Input id="checkIn" disabled value={dateRange?.from ? format(dateRange.from, 'MMM dd, yyyy') : ''} placeholder="Select date" className="bg-stone-50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="checkOut">Check-out</Label>
                                        <Input id="checkOut" disabled value={dateRange?.to ? format(dateRange.to, 'MMM dd, yyyy') : ''} placeholder="Select date" className="bg-stone-50" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="fullName" {...form.register('fullName')} placeholder="John Doe" />
                                    {form.formState.errors.fullName && <p className="text-xs text-red-500">{form.formState.errors.fullName.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...form.register('email')} placeholder="john@example.com" />
                                    {form.formState.errors.email && <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guests">Guests</Label>
                                    <Input id="guests" type="number" {...form.register('guests', { valueAsNumber: true })} min={1} max={10} />
                                    {form.formState.errors.guests && <p className="text-xs text-red-500">{form.formState.errors.guests.message}</p>}
                                </div>

                                <div className="flex items-center space-x-2 py-2">
                                    <Checkbox
                                        id="whatsapp"
                                        checked={form.watch('prefersWhatsapp')}
                                        onCheckedChange={(c) => form.setValue('prefersWhatsapp', c as boolean)}
                                    />
                                    <Label htmlFor="whatsapp" className="text-sm font-normal text-stone-600">I prefer to be contacted via WhatsApp</Label>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="specialRequests">Message / Special Requests</Label>
                                    <Textarea id="specialRequests" {...form.register('specialRequests')} placeholder="Tell us about your trip..." />
                                </div>

                                <Button type="submit" className="w-full bg-stone-900 text-white" disabled={submitting || !!validationError || !dateRange?.to}>
                                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Request'}
                                </Button>

                                <p className="text-xs text-stone-400 text-center px-4">
                                    This is not a direct booking. We will review your dates and send a formal offer shortly.
                                </p>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
            <Toaster />
        </div>
    );
}
