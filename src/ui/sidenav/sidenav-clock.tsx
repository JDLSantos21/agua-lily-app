import { useState, useEffect } from "react";

export default function SidenavClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      const formattedDate = now.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      });
      setTime(formattedTime);
      setDate(formattedDate);
    };

    updateClock(); // Initialize immediately
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-600">{time}</span>
      <span className="text-xs text-gray-600">{date}</span>
    </div>
  );
}
