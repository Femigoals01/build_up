

"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

export default function SettingsSaveButton() {
  const { pending } = useFormStatus();
  const router = useRouter();
  const wasPendingRef = useRef(false);

  useEffect(() => {
    if (pending) {
      wasPendingRef.current = true;
      return;
    }

    if (wasPendingRef.current && !pending) {
      wasPendingRef.current = false;

      router.refresh();

      window.dispatchEvent(new CustomEvent("buildup:user-updated"));
    }
  }, [pending, router]);

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Saving..." : "Save All Settings"}
    </button>
  );
}