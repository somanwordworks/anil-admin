import { useEffect, useState } from "react";
import Router from "next/router";

export default function ProtectedRoute({ children }) {
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("admin_token");

        // If no token → redirect
        if (!token) {
            Router.push("/login");
            return;
        }

        // If token exists → allow access
        setVerified(true);
    }, []);

    if (!verified) return null;

    return children;
}
