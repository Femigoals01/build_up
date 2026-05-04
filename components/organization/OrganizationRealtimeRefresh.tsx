"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPusherClient } from "@/lib/pusher-client";

export default function OrganizationRealtimeRefresh({
  userId,
}: {
  userId: string;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const pusher = getPusherClient();
    const channelName = `private-user-notifications-${userId}`;
    const channel = pusher.subscribe(channelName);

    const refreshDashboard = () => {
      router.refresh();
    };

    channel.bind("submission:new", refreshDashboard);

    return () => {
      channel.unbind("submission:new", refreshDashboard);
      pusher.unsubscribe(channelName);
    };
  }, [router, userId]);

  return null;
}