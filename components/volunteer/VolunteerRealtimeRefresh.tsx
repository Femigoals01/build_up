

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPusherClient } from "@/lib/pusher-client";

export default function VolunteerRealtimeRefresh({
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

    // const refreshDashboard = () => {
    //   router.refresh();
    // };

    const refreshDashboard = (data: any) => {
  if (data?.status === "APPROVED") {
    alert("🎉 Your work has been approved!");
  } else if (data?.status === "REJECTED") {
    alert("🔁 Revision requested. Please update your work.");
  }

  router.refresh();
};

    channel.bind("submission:reviewed", refreshDashboard);

    return () => {
      channel.unbind("submission:reviewed", refreshDashboard);
      pusher.unsubscribe(channelName);
    };
  }, [router, userId]);

  return null;
}