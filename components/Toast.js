import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-3 rounded shadow-lg 
      text-white text-sm animate-slide-in 
      ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}
    >
      {message}
    </div>
  );
}
