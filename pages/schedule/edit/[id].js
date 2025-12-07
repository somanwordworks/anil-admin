import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProtectedRoute from "../../../components/ProtectedRoute";
import AdminLayout from "../../../components/AdminLayout";
import Toast from "../../../components/Toast";   // ⭐ ADD THIS

/* ------------------------------
   FIXED DATE FORMATTER (no shift)
------------------------------- */
function formatDateForInput(dateString) {
    if (!dateString) return "";

    // YYYY-MM-DD → return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }

    // DD-MM-YYYY → convert to YYYY-MM-DD
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
        const [dd, mm, yyyy] = dateString.split("-");
        return `${yyyy}-${mm}-${dd}`;
    }

    return "";
}

export default function EditEvent() {
    const router = useRouter();
    const { id } = router.query;

    const [event, setEvent] = useState({
        event_date: "",
        title: "",
        description: "",
        location: "",
        type: "",
    });

    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "" });

    /* Show Toast */
    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    };

    /* ------------------------------
       LOAD EVENT DETAILS
    ------------------------------- */
    useEffect(() => {
        if (!id) return;

        async function loadEvent() {
            const res = await fetch(`/api/schedule/get?id=${id}`);
            const data = await res.json();

            if (data.ok) {
                const cleanedDate = formatDateForInput(data.event.event_date);

                setEvent({
                    ...data.event,
                    event_date: cleanedDate,
                });
            }
        }

        loadEvent();
    }, [id]);

    /* ------------------------------
       UPDATE EVENT
    ------------------------------- */
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/schedule/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: Number(id), ...event }),
        });

        const data = await res.json();
        setLoading(false);

        if (data.ok) {
            showToast("Event updated successfully!", "success");

            setTimeout(() => {
                router.push("/schedule");
            }, 1200);
        } else {
            showToast("Update failed: " + data.error, "error");
        }
    }

    return (
        <ProtectedRoute>
            <AdminLayout>
                {toast.show && (
                    <Toast message={toast.message} type={toast.type} />
                )}

                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    Edit Event
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-lg shadow-md"
                >
                    {/* DATE */}
                    <div className="mb-4">
                        <label className="block mb-1">Event Date</label>
                        <input
                            type="date"
                            value={event.event_date}
                            onChange={(e) =>
                                setEvent({ ...event, event_date: e.target.value })
                            }
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>

                    {/* TITLE */}
                    <div className="mb-4">
                        <label className="block mb-1">Title</label>
                        <input
                            type="text"
                            value={event.title}
                            onChange={(e) =>
                                setEvent({ ...event, title: e.target.value })
                            }
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="mb-4">
                        <label className="block mb-1">Description</label>
                        <textarea
                            value={event.description}
                            onChange={(e) =>
                                setEvent({
                                    ...event,
                                    description: e.target.value,
                                })
                            }
                            className="border p-2 rounded w-full"
                            rows={4}
                            required
                        />
                    </div>

                    {/* LOCATION */}
                    <div className="mb-4">
                        <label className="block mb-1">Location</label>
                        <input
                            type="text"
                            value={event.location}
                            onChange={(e) =>
                                setEvent({ ...event, location: e.target.value })
                            }
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>

                    {/* TYPE */}
                    <div className="mb-4">
                        <label className="block mb-1">Type</label>
                        <input
                            type="text"
                            value={event.type}
                            onChange={(e) =>
                                setEvent({ ...event, type: e.target.value })
                            }
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 rounded text-white w-full ${loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-saffron"
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                                Updating event…
                            </span>
                        ) : (
                            "Update Event"
                        )}
                    </button>
                </form>
            </AdminLayout>
        </ProtectedRoute>
    );
}
