export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <h1 className="font-serif text-3xl text-stone-900">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-100">
                    <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">New Requests</h3>
                    <p className="text-3xl font-serif text-stone-900">0</p>
                    <p className="text-xs text-stone-400 mt-2">Awaiting reply</p>
                </div>

                <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-100">
                    <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">Upcoming Stays</h3>
                    <p className="text-3xl font-serif text-stone-900">0</p>
                    <p className="text-xs text-stone-400 mt-2">Next 30 days</p>
                </div>

                <div className="bg-white p-6 rounded-sm shadow-sm border border-stone-100">
                    <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">Blocked Dates</h3>
                    <p className="text-3xl font-serif text-stone-900">0</p>
                    <p className="text-xs text-stone-400 mt-2">Total blocked ranges</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-sm shadow-sm border border-stone-100 flex items-center justify-center min-h-[200px]">
                <p className="text-stone-400 italic">Chart placeholder (Bookings per month)</p>
            </div>
        </div>
    );
}
