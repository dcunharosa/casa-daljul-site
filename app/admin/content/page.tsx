import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { revalidatePath } from 'next/cache';

// Keys we want to manage via the Content Manager (text only)
const MANAGED_KEYS = [
    { key: 'home_quote_text', label: 'Home Page Quote', section: 'Home', type: 'text' },
    { key: 'welcome_text', label: 'Welcome/Intro Story', section: 'Home', type: 'textarea' },
];

export default async function ContentManagerPage() {
    const supabase = await createClient();

    // Fetch existing content
    const { data: contents } = await supabase
        .from('site_content')
        .select('*')
        .in('key', MANAGED_KEYS.map(m => m.key));

    const contentMap: Record<string, any> = {};
    contents?.forEach(c => contentMap[c.key] = c.value);

    async function updateContent(formData: FormData) {
        'use server';
        const supabase = await createClient();
        const key = formData.get('key') as string;
        const text = formData.get('text') as string;

        const { error } = await supabase
            .from('site_content')
            .upsert({
                key,
                value: { text },
                updated_at: new Date().toISOString()
            });

        if (error) throw error;
        revalidatePath('/');
        revalidatePath('/admin/content');
    }

    // Group by section
    const sections: Record<string, any[]> = {};
    MANAGED_KEYS.forEach(m => {
        if (!sections[m.section]) sections[m.section] = [];
        sections[m.section].push(m);
    });

    return (
        <div className="space-y-12 max-w-4xl">
            <h1 className="font-serif text-3xl text-stone-900">Content Manager</h1>

            {Object.entries(sections).map(([sectionName, items]) => (
                <section key={sectionName} className="space-y-6">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-stone-400 border-b pb-2">{sectionName}</h2>

                    <div className="grid gap-8">
                        {items.map((item) => (
                            <form key={item.key} action={updateContent} className="bg-white p-6 rounded-sm shadow-sm border border-stone-100 flex flex-col gap-4">
                                <input type="hidden" name="key" value={item.key} />

                                <div className="flex justify-between items-baseline">
                                    <Label className="font-sans font-medium text-stone-700">{item.label}</Label>
                                    <span className="text-xs text-stone-400 font-mono">{item.key}</span>
                                </div>

                                <Textarea
                                    name="text"
                                    defaultValue={contentMap[item.key]?.text || ''}
                                    placeholder={`Enter ${item.label.toLowerCase()}...`}
                                    className="font-serif text-lg leading-relaxed min-h-[100px] bg-stone-50 border-stone-200"
                                />

                                <div className="self-end">
                                    <Button type="submit" className="bg-stone-900 hover:bg-stone-800 text-white">Update {item.label}</Button>
                                </div>
                            </form>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
