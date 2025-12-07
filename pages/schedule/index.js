import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminLayout from "../../components/AdminLayout";
import Link from "next/link";
import Toast from "../../components/Toast";

export default function ScheduleList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // ⭐ Date Range Controls
    const today = new Date().toISOString().split("T")[0];
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        setLoading(true);

        const res = await fetch(`/api/schedule/list?from=${fromDate}&to=${toDate}`);
        const data = await res.json();

        setEvents(data.events || []);
        setLoading(false);
    }

    const resetDates = () => {
        const today = new Date().toISOString().split("T")[0];
        setFromDate(today);
        setToDate(today);
        fetchEvents();
    };

    const openDeleteModal = (id) => {
        setSelectedId(id);
        setShowDeleteModal(true);
    };

    async function handleConfirmDelete() {
        const res = await fetch("/api/schedule/delete", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ id: selectedId }),
        });

        const data = await res.json();

        if (data.ok || data.success) {
            showToast("Event deleted successfully!", "success");
            setEvents(events.filter((e) => e.id !== selectedId));
        } else {
            showToast("Failed to delete event!", "error");
        }

        setShowDeleteModal(false);
    }

    return (
        <ProtectedRoute>
            <AdminLayout>

                {toast && <Toast message={toast.message} type={toast.type} />}

                {/* Delete Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Delete Event?
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this event?
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Schedule Events</h1>

                    <Link
                        href="/schedule/add"
                        className="px-4 py-2 bg-saffron text-white rounded"
                    >
                        + Add Event
                    </Link>
                </div>

                {/* ⭐ Date Filter UI */}
                <div className="flex items-center gap-4 mb-6">
                    <div>
                        <label className="text-gray-700 text-sm">From</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="border px-3 py-2 rounded ml-2"
                        />
                    </div>

                    <div>
                        <label className="text-gray-700 text-sm">To</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="border px-3 py-2 rounded ml-2"
                        />
                    </div>

                    <button
                        onClick={fetchEvents}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Go
                    </button>

                    <button
                        onClick={resetDates}
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                        Reset
                    </button>

                    {loading && (
                        <span className="text-blue-600 font-medium ml-3">Loading...</span>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border rounded-lg bg-white shadow-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border">S.No</th>
                                <th className="p-3 border">Date</th>
                                <th className="p-3 border">Title</th>
                                <th className="p-3 border">Type</th>
                                <th className="p-3 border">Location</th>
                                <th className="p-3 border">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {events.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center p-4 text-gray-500">
                                        No events found.
                                    </td>
                                </tr>
                            )}

                            {events.map((event, index) => (
                                <tr key={event.id} className="hover:bg-gray-50">
                                    <td className="p-3 border">{index + 1}</td>
                                    <td className="p-3 border">
                                        {new Date(event.event_date).toLocaleDateString()}
                                    </td>
                                    <td className="p-3 border">{event.title}</td>
                                    <td className="p-3 border">{event.type}</td>
                                    <td className="p-3 border">{event.location}</td>
                                    <td className="p-3 border flex gap-3">
                                        <Link
                                            href={`/schedule/edit/${event.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            onClick={() => openDeleteModal(event.id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
