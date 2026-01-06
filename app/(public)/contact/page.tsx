import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="pt-24 min-h-screen bg-stone-50">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="font-serif text-5xl md:text-6xl text-stone-900 mb-12 text-center">Contact Us</h1>

                <div className="grid md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-sm shadow-sm">
                    {/* Direct Info */}
                    <div className="space-y-8">
                        <h2 className="font-serif text-2xl text-stone-900">Get in Touch</h2>
                        <p className="text-stone-600 font-light">
                            Whether you have a question about the property or need assistance planning your stay, we are here to help.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <Mail className="h-5 w-5 text-stone-400 mt-1" />
                                <div>
                                    <span className="block text-sm font-medium text-stone-900">Email</span>
                                    <a href="mailto:stay@casadaljul.com" className="text-stone-600 hover:text-stone-900 transition-colors">stay@casadaljul.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <Phone className="h-5 w-5 text-stone-400 mt-1" />
                                <div>
                                    <span className="block text-sm font-medium text-stone-900">Phone / WhatsApp</span>
                                    <a href="tel:+351123456789" className="text-stone-600 hover:text-stone-900 transition-colors">+351 123 456 789</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <MapPin className="h-5 w-5 text-stone-400 mt-1" />
                                <div>
                                    <span className="block text-sm font-medium text-stone-900">Address</span>
                                    <p className="text-stone-600">
                                        Casa Daljul, Cliffside Road<br />
                                        8600, Algarve, Portugal
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simple Form (Placeholder - could be hooked up later or just mailto) */}
                    <div className="space-y-6">
                        <h2 className="font-serif text-2xl text-stone-900">Send a Message</h2>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                                <input type="text" id="name" className="w-full border border-stone-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400" placeholder="Your Name" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                                <input type="email" id="email" className="w-full border border-stone-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                                <textarea id="message" rows={4} className="w-full border border-stone-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400" placeholder="How can we help?" />
                            </div>
                            <Button className="w-full bg-stone-900 hover:bg-stone-800 text-white">Send Message</Button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
