import Link from "next/link";

export default function AdminLayout({ children }) {

    const handleLogout = () => {
        // Clear stored admin data
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");

        // Redirect to login page
        window.location.href = "/login";
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Top Navbar */}
            <header className="bg-white shadow-md">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

                    {/* Branding */}
                    <div className="text-lg font-semibold text-gray-700">
                        Anil Admin Panel
                    </div>

                    {/* Navigation */}
                    <nav className="flex gap-6 text-sm items-center">

                        <Link href="/dashboard" className="hover:text-saffron">
                            Dashboard
                        </Link>

                        <Link href="/schedule" className="hover:text-saffron">
                            Schedule
                        </Link>

                        <Link href="/volunteers" className="hover:text-saffron">
                            Volunteers
                        </Link>

                        {/* 🔥 Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 ml-4"
                        >
                            Logout
                        </button>

                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {children}
                </div>
            </main>

        </div>
    );
}
