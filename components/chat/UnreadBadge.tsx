

"use client";

import { useEffect, useState } from "react";
import { useRealtimeUnread } from "@/hooks/useRealtimeUnread";

export default function UnreadBadge() {
  const [count, setCount] = useState(0);

  async function fetchUnread() {
    const res = await fetch("/api/chat/unread-count");
    const data = await res.json();
    setCount(data.count);
  }

  useRealtimeUnread("me", fetchUnread);

  useEffect(() => {
    fetchUnread();
  }, []);

  if (count === 0) return null;

  return (
    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
      {count}
    </span>
  );
}
