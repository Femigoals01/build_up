"use client";

import { useEffect } from "react";
import Pusher from "pusher-js";

export function useRealtimeUnread(
  userId: string,
  onNewMessage: () => void
) {
  useEffect(() => {
    const pusher = new Pusher(
      process.env.NEXT_PUBLIC_PUSHER_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      }
    );

    const channel = pusher.subscribe("global-chat");

    channel.bind("new-message", (data: any) => {
      if (data.message.senderId !== userId) {
        onNewMessage();
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [userId, onNewMessage]);
}
