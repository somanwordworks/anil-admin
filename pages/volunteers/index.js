import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminLayout from "../../components/AdminLayout";
import Toast from "../../components/Toast";

export default function VolunteersPage() {
    const today = new Date().toISOString().split("T")[0];

    const [volunteers, setVolunteers] = useState([]);
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);

    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    };

    useEffect(() => {
        loadVolunteers();
    }, [page]);

    async function loadVolunteers() {
        setLoading(true);

        try {
            const res = await fetch(
                `/api/volunteers/list?from=${fromDate}&to=${toDate}&page=${page}&limit=${limit}`
            );
            const data = await res.json();

            setVolunteers(data.volunteers || []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            showToast("Failed to load volunteers", "error");
        }

        setLoading(false);
    }

    const resetDates = () => {
        setFromDate(today);
        setToDate(today);
        setPage(1);
        loadVolunteers();
    };

    const handleGo = () => {
        setPage(1);
        loadVolunteers();
    };

    return (
        <ProtectedRoute>
            <AdminLayout>

                {/* Toast */}
                {toast && <Toast message={toast.message} type={toast.type} />}

                <h1 className="text-2xl font-bold text-gray-800 mb-6">Volunteers</h1>

                {/* DATE FILTER */}
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
                        onClick={handleGo}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Go
                    </button>

                    <button
                        onClick={resetDates}
                        className="px-4 py-2 bg-gray-600 text-white rounded"
                    >
                        Reset
                    </button>

                    {loading && (
                        <span className="text-blue-600 font-medium">Loading...</span>
                    )}
                </div>

                {/* EXPORT BUTTONS */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() =>
                            window.open(`/api/volunteers/export-csv?from=${fromDate}&to=${toDate}`)
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                        Export CSV
                    </button>
                </div>

                {/* VOLUNTEERS TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full border bg-white rounded-lg shadow-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 border">S.No</th>
                                <th className="p-3 border">Member ID</th>
                                <th className="p-3 border">Name</th>
                                <th className="p-3 border">Mobile</th>
                                <th className="p-3 border">Area</th>
                                <th className="p-3 border">Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {volunteers.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center p-4 text-gray-500">
                                        No volunteers found.
                                    </td>
                                </tr>
                            )}

                            {volunteers.map((v, index) => (
                                <tr key={v.member_id} className="hover:bg-gray-50">
                                    <td className="p-3 border">
                                        {(page - 1) * limit + index + 1}
                                    </td>
                                    <td className="p-3 border">{v.member_id}</td>
                                    <td className="p-3 border">{v.name}</td>
                                    <td className="p-3 border">{v.mobile}</td>
                                    <td className="p-3 border">{v.area}</td>
                                    <td className="p-3 border">
                                        {new Date(v.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="flex justify-center mt-6 gap-4">

                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className={`px-3 py-2 rounded ${page === 1 ? "bg-gray-300" : "bg-blue-600 text-white"
                            }`}
                    >
                        Prev
                    </button>

                    <span className="text-gray-700 font-medium">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className={`px-3 py-2 rounded ${page === totalPages ? "bg-gray-300" : "bg-blue-600 text-white"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </AdminLayout>
        </ProtectedRoute>
    );
}
