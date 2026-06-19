




"use client";

import { useEffect, useState } from "react";

type Stats = {
    totalPosts: number;
    totalComments: number;
    totalReactions: number;
    totalMessages: number;
    pendingReports: number;
};

export default function AdminCommunityPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats | null>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [error, setError] = useState("");

    async function loadData() {
        try {
            setLoading(true);

            const res = await fetch("/api/admin/community", {
                cache: "no-store",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to load admin data.");
            }

            setStats(data.stats);
            setReports(data.reports || []);
            setPosts(data.recentPosts || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        } finally {
            setLoading(false);
        }
    }


    async function updateReport(reportId: string, action: "RESOLVE" | "DISMISS") {
        try {
            const res = await fetch("/api/admin/community/reports", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reportId, action }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to update report.");

            await loadData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        }
    }

    async function deleteCommunityPost(postId: string) {
        const confirmed = confirm("Are you sure you want to delete this community post?");

        if (!confirmed) return;

        try {
            const res = await fetch("/api/admin/community/posts", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to delete post.");

            await loadData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
        }
    }



    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <main className="p-6">
                <div className="rounded-3xl border bg-white p-8">
                    Loading community admin dashboard...
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 p-4 md:p-6">
            <div className="mx-auto max-w-7xl space-y-6">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
                        Administration
                    </p>

                    <h1 className="mt-2 text-4xl font-black text-slate-900">
                        Community Management
                    </h1>
                </div>

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {stats && (
                    <div className="grid gap-4 md:grid-cols-5">
                        <StatCard title="Posts" value={stats.totalPosts} />
                        <StatCard title="Comments" value={stats.totalComments} />
                        <StatCard title="Reactions" value={stats.totalReactions} />
                        <StatCard title="Messages" value={stats.totalMessages} />
                        <StatCard
                            title="Reports"
                            value={stats.pendingReports}
                            danger
                        />
                    </div>
                )}

                <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-black text-slate-900">
                        Pending Reports
                    </h2>

                    <div className="mt-4 space-y-3">
                        {reports.length === 0 ? (
                            <div className="rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-500">
                                No reports found.
                            </div>
                        ) : (
                            reports.map((report) => (
                                <div
                                    key={report.id}
                                    className="rounded-2xl border border-slate-200 p-4"
                                >
                                    <p className="font-black text-slate-900">
                                        {report.user?.name}
                                    </p>

                                    <p className="mt-2 text-sm text-slate-600">
                                        {report.reason}
                                    </p>

                                    <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
                                        {report.post?.content}
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => updateReport(report.id, "RESOLVE")}
                                            className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-black text-white transition hover:bg-emerald-700"
                                        >
                                            Resolve
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => updateReport(report.id, "DISMISS")}
                                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Dismiss
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => deleteCommunityPost(report.post?.id)}
                                            className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-black text-white transition hover:bg-red-700"
                                        >
                                            Delete Post
                                        </button>
                                    </div>
                                </div>


                            ))
                        )}





                    </div>
                </section>

                <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-black text-slate-900">
                        Recent Community Posts
                    </h2>

                    <div className="mt-4 space-y-3">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="rounded-2xl border border-slate-200 p-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-black text-slate-900">
                                            {post.user?.name}
                                        </p>

                                        <p className="text-xs font-bold text-slate-500">
                                            {post.user?.role}
                                        </p>
                                    </div>

                                    {post.isPinned && (
                                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">
                                            📌 Pinned
                                        </span>
                                    )}
                                </div>

                                <p className="mt-3 text-sm leading-6 text-slate-700">
                                    {post.content}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                                    <span>
                                        💬 {post._count?.comments || 0}
                                    </span>

                                    <span>
                                        👍 {post._count?.reactions || 0}
                                    </span>

                                    <span>
                                        🚩 {post._count?.reports || 0}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => deleteCommunityPost(post.id)}
                                    className="mt-4 rounded-2xl bg-red-600 px-4 py-2 text-sm font-black text-white transition hover:bg-red-700"
                                >
                                    Delete Post
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}

function StatCard({
    title,
    value,
    danger,
}: {
    title: string;
    value: number;
    danger?: boolean;
}) {
    return (
        <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                {title}
            </p>

            <p
                className={`mt-2 text-3xl font-black ${danger ? "text-red-600" : "text-slate-900"
                    }`}
            >
                {value}
            </p>
        </div>
    );
}