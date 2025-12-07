import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../components/AdminLayout";

export default function Dashboard() {

    const [stats, setStats] = useState({
        totalVolunteers: 0,
        upcomingEvents: 0,
        pastEvents: 0,
    });

    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        try {
            const res = await fetch("/api/dashboard/stats");
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error("Failed to load dashboard stats:", err);
        }
    }

    return (
        <ProtectedRoute>
            <AdminLayout>

                <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div className="bg-gray-50 p-5 rounded-lg border shadow-sm">
                        <div className="text-sm text-gray-600">Total Volunteers</div>
                        <div className="text-3xl font-bold mt-2">
                            {stats.totalVolunteers}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-lg border shadow-sm">
                        <div className="text-sm text-gray-600">Upcoming Events</div>
                        <div className="text-3xl font-bold mt-2">
                            {stats.upcomingEvents}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-lg border shadow-sm">
                        <div className="text-sm text-gray-600">Past Events</div>
                        <div className="text-3xl font-bold mt-2">
                            {stats.pastEvents}
                        </div>
                    </div>

                </div>

            </AdminLayout>
        </ProtectedRoute>
    );
}
