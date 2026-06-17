




"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import BuildUpLogo from "@/components/brand/BuildUpLogo";
import NotificationBell from "@/components/notifications/NotificationBell";
import { calculateProfileStrength } from "@/lib/profileStrength";
import { getProfileLevel } from "@/lib/profileLevel";

type FreshUser = {
  id: string;
  name: string | null;
  username: string | null;
  profileImageUrl: string | null;
  bio?: string | null;
  skills?: string | null;
  experience?: string | null;
  country?: string | null;
  countryCode?: string | null;
  mobileNumber?: string | null;
  portfolioCount?: number | null;
} | null;

type NavbarNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string | Date;
};

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "U";
}

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [freshUser, setFreshUser] = useState<FreshUser>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [notifications, setNotifications] = useState<NavbarNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: session, status } = useSession();
  const pathname = usePathname();
  const startDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };

    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  useEffect(() => {
    setOpen(false);
    setStartOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        startDropdownRef.current &&
        !startDropdownRef.current.contains(event.target as Node)
      ) {
        setStartOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadFreshUser() {
      if (!session?.user?.id) {
        setFreshUser(null);
        return;
      }

      try {
        const res = await fetch("/api/user/me", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (!cancelled) {
          setFreshUser(data.user ?? null);
        }
      } catch (error) {
        console.error("Failed to fetch fresh navbar user:", error);
      }
    }

    loadFreshUser();

    const handleUserUpdated = () => {
      loadFreshUser();
    };

    window.addEventListener("buildup:user-updated", handleUserUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener("buildup:user-updated", handleUserUpdated);
    };
  }, [session?.user?.id]);

  useEffect(() => {
    let cancelled = false;

    async function loadNotifications() {
      if (!session?.user?.id) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      try {
        const res = await fetch("/api/notifications/me", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (!cancelled) {
          setNotifications(data.notifications ?? []);
          setUnreadCount(data.unreadCount ?? 0);
        }
      } catch (error) {
        console.error("Failed to fetch navbar notifications:", error);
      }
    }

    loadNotifications();

    const interval = window.setInterval(loadNotifications, 15000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [session?.user?.id]);

  const displayName = useMemo(
    () => freshUser?.name || session?.user?.name || "User",
    [freshUser?.name, session?.user?.name]
  );

  const profileImageUrl = useMemo(
    () => freshUser?.profileImageUrl || session?.user?.profileImageUrl || null,
    [freshUser?.profileImageUrl, session?.user?.profileImageUrl]
  );

  const profileStrength = useMemo(() => {
    if (!freshUser) return null;

    return calculateProfileStrength({
      username: freshUser.username,
      bio: freshUser.bio ?? null,
      skills: freshUser.skills ?? null,
      experience: freshUser.experience ?? null,
      country: freshUser.country ?? null,
      countryCode: freshUser.countryCode ?? null,
      mobileNumber: freshUser.mobileNumber ?? null,
      profileImageUrl: freshUser.profileImageUrl ?? null,
      portfolioCount: Number(freshUser.portfolioCount ?? 0),
    });
  }, [freshUser]);

  const profileLevel = useMemo(() => {
    if (!profileStrength) return null;
    return getProfileLevel(profileStrength.score);
  }, [profileStrength]);

  const isSignedIn = status === "authenticated" && !!session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        <BuildUpLogo href="/" showTagline textSize="md" />

        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-7 text-sm font-medium text-slate-600">
            <NavLink href="/" currentPath={pathname}>
              Home
            </NavLink>

            <NavLink href="/#about" currentPath={pathname}>
              About
            </NavLink>

            <NavLink href="/#how-it-works" currentPath={pathname}>
              How it Works
            </NavLink>

            <NavLink href="/leaderboard" currentPath={pathname}>
  Leaderboard
</NavLink>


{/* <NavLink href="/mentors" currentPath={pathname}>
  Mentors
</NavLink> */}



  <NavLink href="/marketplace" currentPath={pathname}>
  Marketplace
</NavLink>



          </div>

          {!isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Login
              </Link>

              <div className="relative" ref={startDropdownRef}>
                <button
                  type="button"
                  onClick={() => setStartOpen((prev) => !prev)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(37,99,235,0.18)] transition hover:bg-blue-700"
                  aria-expanded={startOpen}
                  aria-haspopup="menu"
                >
                  Get Started
                  <span
                    className={`text-xs transition-transform duration-200 ${
                      startOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                <div
                  className={`absolute right-0 top-[calc(100%+12px)] w-72 overflow-hidden rounded-[22px] border border-slate-200/80 bg-white/95 p-1 shadow-[0_25px_70px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-all duration-200 ${
                    startOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-2 opacity-0"
                  }`}
                >
                  <div className="px-4 pb-2 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                      Choose account type
                    </p>
                  </div>

                  <div className="space-y-2 p-2.5">
                    <DropdownLink
                      href="/register/volunteer"
                      title="Register as Volunteer"
                      tone="blue"
                      onClick={() => setStartOpen(false)}
                    />

                    <DropdownLink
                      href="/register/organization"
                      title="Register as Organization"
                      tone="emerald"
                      onClick={() => setStartOpen(false)}
                    />

                    <DropdownLink
                      href="/register/mentor"
                      title="Register as Mentor"
                      tone="violet"
                      onClick={() => setStartOpen(false)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NotificationBell
                userId={session.user.id}
                notifications={notifications}
                unreadCount={unreadCount}
              />

              {profileStrength && profileLevel && (
                <div
                  className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 md:flex ${profileLevel.borderClass} ${profileLevel.bgClass}`}
                >
                  <span className="text-xs">{profileLevel.icon}</span>

                  <span
                    className={`text-xs font-semibold ${profileLevel.colorClass}`}
                  >
                    {profileLevel.name}
                  </span>

                  <span className="text-xs font-bold text-slate-700">
                    {profileStrength.score}%
                  </span>
                </div>
              )}

              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 transition hover:border-blue-200 hover:bg-blue-50"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/70 bg-white shadow-sm">
                  {profileImageUrl ? (
                    <Image
                      src={profileImageUrl}
                      alt={displayName || "User avatar"}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                      {getInitial(displayName)}
                    </div>
                  )}
                </div>

                <div className="hidden min-w-0 lg:block">
                  <p className="max-w-[140px] truncate text-sm font-semibold text-slate-900">
                    {displayName}
                  </p>
                  <p className="text-xs text-slate-500">View dashboard</p>
                </div>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="relative block h-5 w-5">
            <span
              className={`absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                open ? "top-2.5 rotate-45" : ""
              }`}
            />

            <span
              className={`absolute left-0 top-2.5 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />

            <span
              className={`absolute left-0 top-4 block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                open ? "top-2.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      <div
        className={`overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur transition-all duration-300 md:hidden ${
          open ? "max-h-[680px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-2 px-4 py-5">
          {isSignedIn && (
            <div className="mb-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white bg-white shadow-sm">
                    {profileImageUrl ? (
                      <Image
                        src={profileImageUrl}
                        alt={displayName || "User avatar"}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                        {getInitial(displayName)}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {displayName}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      Signed in to BuildUp
                    </p>

                    {profileStrength && profileLevel && (
                      <p className="mt-1 text-xs font-semibold text-blue-700">
                        {profileLevel.icon} {profileLevel.name} ·{" "}
                        {profileStrength.score}%
                      </p>
                    )}
                  </div>
                </div>

                <NotificationBell
                  userId={session.user.id}
                  notifications={notifications}
                  unreadCount={unreadCount}
                />
              </div>
            </div>
          )}

          <MobileNavLink href="/" onClick={() => setOpen(false)}>
            Home
          </MobileNavLink>

          <MobileNavLink href="/#about" onClick={() => setOpen(false)}>
            About
          </MobileNavLink>

          <MobileNavLink href="/#how-it-works" onClick={() => setOpen(false)}>
            How it Works
          </MobileNavLink>

          <MobileNavLink href="/leaderboard" onClick={() => setOpen(false)}>
  Leaderboard
</MobileNavLink>

<MobileNavLink href="/marketplace" onClick={() => setOpen(false)}>
  Marketplace
</MobileNavLink>


{/* <MobileNavLink href="/mentors" onClick={() => setOpen(false)}>
  Mentors
</MobileNavLink> */}


          {!isSignedIn ? (
            <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
              <Link
                href="/login"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>

              <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <p className="mb-3 px-1 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Choose account type
                </p>

                <div className="space-y-2">
                  <MobileDropdownLink
                    href="/register/volunteer"
                    label="Register as Volunteer"
                    tone="blue"
                    onClick={() => setOpen(false)}
                  />

                  <MobileDropdownLink
                    href="/register/organization"
                    label="Register as Organization"
                    tone="emerald"
                    onClick={() => setOpen(false)}
                  />

                  <MobileDropdownLink
                    href="/register/mentor"
                    label="Register as Mentor"
                    tone="violet"
                    onClick={() => setOpen(false)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
              <Link
                href="/dashboard"
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                Go to Dashboard
              </Link>

              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-red-200 bg-red-50 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
  currentPath,
}: {
  href: string;
  children: React.ReactNode;
  currentPath: string;
}) {
  const isActive =
    href === "/" ? currentPath === "/" : currentPath.startsWith(href);

  return (
    <Link
      href={href}
      className={`relative text-sm font-medium transition after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:rounded-full after:bg-blue-600 after:transition-all ${
        isActive
          ? "text-blue-600 after:w-full"
          : "text-slate-600 hover:text-blue-600 after:w-0 hover:after:w-full"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50 hover:text-blue-600"
    >
      {children}
    </Link>
  );
}

function DropdownLink({
  href,
  title,
  tone,
  onClick,
}: {
  href: string;
  title: string;
  tone: "blue" | "emerald" | "violet";
  onClick?: () => void;
}) {
  const toneMap = {
    blue: {
      box: "border-blue-100 bg-blue-50/80 hover:bg-blue-50",
      text: "group-hover:text-blue-700",
      dot: "bg-blue-600",
    },
    emerald: {
      box: "border-emerald-100 bg-emerald-50/80 hover:bg-emerald-50",
      text: "group-hover:text-emerald-700",
      dot: "bg-emerald-600",
    },
    violet: {
      box: "border-violet-100 bg-violet-50/80 hover:bg-violet-50",
      text: "group-hover:text-violet-700",
      dot: "bg-violet-600",
    },
  };

  const styles = toneMap[tone];

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center justify-between rounded-2xl border px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${styles.box}`}
    >
      <span
        className={`text-sm font-bold text-slate-800 transition ${styles.text}`}
      >
        {title}
      </span>

      <span className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
        <span className="text-sm font-semibold text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700">
          →
        </span>
      </span>
    </Link>
  );
}

function MobileDropdownLink({
  href,
  label,
  tone = "blue",
  onClick,
}: {
  href: string;
  label: string;
  tone?: "blue" | "emerald" | "violet";
  onClick?: () => void;
}) {
  const toneMap = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    violet: "border-violet-100 bg-violet-50 text-violet-700",
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-bold transition hover:shadow-sm ${toneMap[tone]}`}
    >
      {label}
      <span>→</span>
    </Link>
  );
}