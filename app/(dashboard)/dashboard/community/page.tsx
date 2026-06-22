




"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

type UserRole = "VOLUNTEER" | "ORGANIZATION" | "MENTOR" | "ADMIN" | string;

type CommunityUser = {
  id: string;
  name: string;
  role: UserRole;
  profileImageUrl?: string | null;
};

type CommunityStory = {
  id: string;
  content?: string | null;
  mediaUrl?: string | null;
  mediaType?: "IMAGE" | "VIDEO" | string | null;
  createdAt: string;
  expiresAt: string;
  viewCount?: number;
  reactionCount?: number;
  viewedByMe?: boolean;
  reactedByMe?: boolean;
  views?: {
    id: string;
    user: {
      id: string;
      name: string;
      profileImageUrl?: string | null;
    };
  }[];
  reactions?: {
    id: string;
    type: string;
    user: {
      id: string;
      name: string;
      profileImageUrl?: string | null;
    };
  }[];
  user: CommunityUser;
};

type CommunityComment = {
  id: string;
  content: string;
  createdAt: string;
  user: CommunityUser;
};

type PollVote = {
  userId: string;
};

type PollOption = {
  id: string;
  text: string;
  votes: PollVote[];
};

type CommunityPoll = {
  id: string;
  question: string;
  totalVotes: number;
  hasVoted: boolean;
  options: PollOption[];
};

type CommunityPost = {
  id: string;
  category: string;
  content: string;
  imageUrl?: string | null;
  poll?: CommunityPoll | null;
  likes: number;
  isPinned?: boolean;
  createdAt: string;
  user: CommunityUser;
  comments: CommunityComment[];
  reactionCount?: number;
  commentCount?: number;
  reactedByMe?: boolean;
  canPin?: boolean;
  canDelete?: boolean;
  reactions: {
    id: string;
    type: string;
    userId: string;
    user: {
      id: string;
      name: string;
      role: string;
      profileImageUrl?: string | null;
    };
  }[];
};

type LeaderboardItem = {
  rank: number;
  points: number;
  badge: {
    title: string;
    icon: string;
  };
  user: CommunityUser;
};

const CATEGORIES = [
  { label: "General", value: "GENERAL", icon: "💬" },
  { label: "Questions", value: "QUESTIONS", icon: "❓" },
  { label: "Jobs", value: "JOBS", icon: "💼" },
  { label: "Opportunities", value: "OPPORTUNITIES", icon: "🚀" },
  { label: "Learning", value: "LEARNING", icon: "🎓" },
  { label: "Success Stories", value: "SUCCESS", icon: "🏆" },
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "U";
}

function roleBadge(role: string) {
  if (role === "ORGANIZATION") return "bg-blue-500/15 text-blue-200 border-blue-400/30";
  if (role === "MENTOR") return "bg-violet-500/15 text-violet-200 border-violet-400/30";
  if (role === "ADMIN") return "bg-slate-500/20 text-slate-200 border-slate-400/30";
  return "bg-emerald-500/15 text-emerald-200 border-emerald-400/30";
}

function getPostTheme(category: string) {
  if (category === "JOBS") return "from-blue-600 to-slate-950";
  if (category === "OPPORTUNITIES") return "from-cyan-600 to-blue-950";
  if (category === "LEARNING") return "from-violet-600 to-purple-950";
  if (category === "SUCCESS") return "from-amber-500 to-orange-800";
  if (category === "QUESTIONS") return "from-rose-500 to-orange-800";

  return "from-slate-800 to-slate-950";
}

function reactionIcon(type: string) {
  if (type === "LOVE") return "❤️";
  if (type === "FIRE") return "🔥";
  if (type === "CELEBRATE") return "🎉";
  if (type === "SUPPORT") return "👏";
  return "👍";
}

export default function CommunityPage() {
  const { data: session } = useSession();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [category, setCategory] = useState("GENERAL");
  const [content, setContent] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [commentingId, setCommentingId] = useState("");
  const [reactingId, setReactingId] = useState("");
  const [pinningId, setPinningId] = useState("");
  const [reportingId, setReportingId] = useState("");
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [reactionModalPost, setReactionModalPost] =
    useState<CommunityPost | null>(null);

  const [stories, setStories] = useState<CommunityStory[]>([]);
  const [storyContent, setStoryContent] = useState("");
  const [storyMediaUrl, setStoryMediaUrl] = useState("");
  const [storyMediaType, setStoryMediaType] = useState<"IMAGE" | "VIDEO" | "">(
    ""
  );
  const [storyPreview, setStoryPreview] = useState("");
  const [creatingStory, setCreatingStory] = useState(false);
  const [uploadingStory, setUploadingStory] = useState(false);
  const [showStoryViewers, setShowStoryViewers] = useState(false);
  const [activeStory, setActiveStory] = useState<CommunityStory | null>(null);
  const [votingId, setVotingId] = useState("");

  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showTrendingPosts, setShowTrendingPosts] = useState(false);

  const currentSessionUser: CommunityUser = {
    id: session?.user?.id || "current-user",
    name: session?.user?.name || "You",
    role: session?.user?.role || "MEMBER",
    profileImageUrl:
      (session?.user as { profileImageUrl?: string | null; image?: string | null })
        ?.profileImageUrl ||
      (session?.user as { image?: string | null })?.image ||
      null,
  };

  async function loadStories() {
    try {
      const res = await fetch("/api/community/stories", {
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok) {
        setStories(Array.isArray(data) ? data : []);
      }
    } catch {
      // Stories should not block community feed.
    }
  }

  async function uploadStoryMedia(file: File) {
    try {
      setUploadingStory(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/community/stories/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload story media.");
      }

      setStoryMediaUrl(data.mediaUrl);
      setStoryMediaType(data.mediaType);
      setStoryPreview(data.mediaUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setUploadingStory(false);
    }
  }

  async function createStory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!storyContent.trim() && !storyMediaUrl) return;

    try {
      setCreatingStory(true);
      setError("");

      const res = await fetch("/api/community/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: storyContent,
          mediaUrl: storyMediaUrl,
          mediaType: storyMediaType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create story.");
      }

      setStoryContent("");
      setStoryMediaUrl("");
      setStoryMediaType("");
      setStoryPreview("");

      await loadStories();
      await loadLeaderboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setCreatingStory(false);
    }
  }

  async function loadPosts() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/community/posts", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load community posts.");
      }

      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function loadLeaderboard() {
    try {
      const res = await fetch("/api/community/leaderboard", {
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok) {
        setLeaderboard(Array.isArray(data) ? data : []);
      }
    } catch {
      // Leaderboard should not block community feed.
    }
  }

  useEffect(() => {
    loadStories();
    loadPosts();
    loadLeaderboard();
  }, []);

  async function uploadCommunityImage(file: File) {
    try {
      setUploadingImage(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/community/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image.");
      }

      setImageUrl(data.imageUrl);
      setImagePreview(data.imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setImageUrl("");
      setImagePreview("");
    } finally {
      setUploadingImage(false);
    }
  }

  async function createPost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setPosting(true);
      setError("");

      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          content,
          imageUrl,
          pollQuestion: showPollCreator ? pollQuestion : undefined,
          pollOptions: showPollCreator ? pollOptions : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create post.");
      }

      setContent("");
      setCategory("GENERAL");
      setImageUrl("");
      setImagePreview("");
      setShowPollCreator(false);
      setPollQuestion("");
      setPollOptions(["", ""]);
      setShowCreatePostModal(false);

      await loadPosts();
      await loadLeaderboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPosting(false);
    }
  }

  async function createComment(postId: string) {
    const text = commentText[postId]?.trim();

    if (!text) return;

    try {
      setCommentingId(postId);
      setError("");

      const res = await fetch("/api/community/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content: text,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add comment.");
      }

      setCommentText((prev) => ({
        ...prev,
        [postId]: "",
      }));

      await loadPosts();
      await loadLeaderboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setCommentingId("");
    }
  }

  async function toggleReaction(postId: string, type = "LIKE") {
    try {
      setReactingId(postId);
      setError("");

      const res = await fetch("/api/community/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          type,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update reaction.");
      }

      await loadPosts();
      await loadLeaderboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setReactingId("");
    }
  }

  async function votePoll(pollId: string, optionId: string) {
    try {
      setVotingId(optionId);

      const res = await fetch("/api/community/polls/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pollId,
          optionId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to vote.");
      }

      await loadPosts();
      await loadLeaderboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setVotingId("");
    }
  }

  async function togglePinPost(postId: string, currentlyPinned: boolean) {
    try {
      setPinningId(postId);
      setError("");

      const res = await fetch("/api/community/posts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          action: currentlyPinned ? "UNPIN" : "PIN",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update pinned post.");
      }

      await loadPosts();
      await loadLeaderboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPinningId("");
    }
  }

  async function reportPost(postId: string) {
    const reason = prompt(
      "Why are you reporting this post?\n\nExamples:\nSpam\nHarassment\nOffensive Content\nMisleading Information"
    );

    if (!reason?.trim()) return;

    try {
      setReportingId(postId);
      setError("");

      const res = await fetch("/api/community/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to report post.");
      }

      alert("Post reported successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setReportingId("");
    }
  }

  async function openStory(story: CommunityStory) {
    setActiveStory(story);

    try {
      await fetch("/api/community/stories/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storyId: story.id,
        }),
      });

      await loadStories();
    } catch {
      // Story views should not block viewer.
    }
  }

  async function reactToStory(storyId: string, type: string) {
    try {
      const res = await fetch("/api/community/stories/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storyId,
          type,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to react to story.");
      }

      await loadStories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  function goToNextStory() {
    if (!activeStory || stories.length === 0) return;

    const currentIndex = stories.findIndex((story) => story.id === activeStory.id);
    const nextStory = stories[currentIndex + 1] || stories[0];

    openStory(nextStory);
  }

  function goToPreviousStory() {
    if (!activeStory || stories.length === 0) return;

    const currentIndex = stories.findIndex((story) => story.id === activeStory.id);
    const previousStory = stories[currentIndex - 1] || stories[stories.length - 1];

    openStory(previousStory);
  }

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (activeFilter !== "ALL") {
      result = result.filter((post) => post.category === activeFilter);
    }

    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter((post) => {
        const postContent = post.content?.toLowerCase() || "";
        const postCategory = post.category?.toLowerCase() || "";
        const userName = post.user?.name?.toLowerCase() || "";
        const userRole = post.user?.role?.toLowerCase() || "";

        return (
          postContent.includes(query) ||
          postCategory.includes(query) ||
          userName.includes(query) ||
          userRole.includes(query)
        );
      });
    }

    return result;
  }, [posts, activeFilter, searchQuery]);

  const trendingPosts = useMemo(() => {
    return [...posts]
      .map((post) => ({
        ...post,
        trendingScore:
          Number(post.reactionCount || 0) * 2 +
          Number(post.comments.length || 0) * 3 +
          (post.isPinned ? 10 : 0),
      }))
      .filter((post) => post.trendingScore > 0)
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 5);
  }, [posts]);

  const groupedStories = useMemo(() => {
    const storyMap = new Map<string, CommunityStory[]>();

    stories.forEach((story) => {
      const key = story.user.id;
      const existing = storyMap.get(key) || [];

      storyMap.set(key, [...existing, story]);
    });

    return Array.from(storyMap.values()).map((userStories) => {
      const sortedStories = [...userStories].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return {
        user: sortedStories[0].user,
        stories: sortedStories,
        latestStory: sortedStories[0],
        count: sortedStories.length,
        hasUnviewed: sortedStories.some((story) => !story.viewedByMe),
      };
    });
  }, [stories]);

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">


        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200">
            {error}
          </div>
        )}

        <section className="grid gap-4 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_1fr_260px]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#0d1728] shadow-xl shadow-black/20">
              <div className="border-b border-white/10 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-300">
                  Community Hub
                </p>

                <button
                  type="button"
                  onClick={() => setShowCreatePostModal(true)}
                  className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-white/5 p-3 text-left transition hover:bg-blue-500/10"
                >
                  <Avatar user={currentSessionUser} small />

                  <div>
                    <p className="text-sm font-black text-white">Create Post</p>
                    <p className="text-xs font-semibold text-slate-400">
                      Share update, image, poll
                    </p>
                  </div>
                </button>
              </div>

              <div className="p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Categories
                </p>

                <div className="mt-3 grid gap-0.5">
                  <button
                    type="button"
                    onClick={() => setActiveFilter("ALL")}
                    className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-left text-[13px] font-bold transition ${
                      activeFilter === "ALL"
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs">
                      🌍
                    </span>
                    <span className="truncate">All Discussions</span>
                  </button>

                  {CATEGORIES.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setActiveFilter(item.value)}
                      className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-left text-[13px] font-bold transition ${
                        activeFilter === item.value
                          ? "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs">
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-3">
        <section className="rounded-[24px] border border-white/10 bg-[#0b1628] p-3 shadow-xl shadow-black/20">
          <div className="flex gap-4 overflow-x-auto pb-2">
            <form
              onSubmit={createStory}
              className="w-28 shrink-0 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-2 text-center"
            >
              <label className="relative mx-auto flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-blue-600 text-lg text-white ring-2 ring-blue-500/40">
                {currentSessionUser.profileImageUrl ? (
                  <Image
                    src={currentSessionUser.profileImageUrl}
                    alt={currentSessionUser.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <span className="text-sm font-black">
                    {getInitial(currentSessionUser.name)}
                  </span>
                )}

                <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#0b1628] bg-blue-600 text-xs font-black text-white">
                  {uploadingStory ? "…" : "+"}
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                  className="hidden"
                  disabled={uploadingStory}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadStoryMedia(file);
                  }}
                />
              </label>

              <input
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                placeholder="Story text..."
                maxLength={280}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-[11px] font-bold text-white outline-none placeholder:text-slate-400"
              />

              {storyPreview && (
                <div className="mt-2 overflow-hidden rounded-xl bg-slate-950">
                  {storyMediaType === "IMAGE" ? (
                    <Image
                      src={storyPreview}
                      alt="Story preview"
                      width={140}
                      height={120}
                      className="h-20 w-full object-cover"
                    />
                  ) : (
                    <video src={storyPreview} className="h-20 w-full object-cover" />
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  creatingStory ||
                  uploadingStory ||
                  (!storyContent.trim() && !storyMediaUrl)
                }
                className="mt-2 w-full rounded-lg bg-blue-600 px-2.5 py-1.5 text-[11px] font-black text-white disabled:opacity-50"
              >
                {creatingStory ? "Posting..." : "Add Story"}
              </button>
            </form>

            {groupedStories.map((group) => (
              <button
                key={group.user.id}
                type="button"
                onClick={() => openStory(group.latestStory)}
                className="w-20 shrink-0 text-center"
              >
                <div
                  className={`relative mx-auto rounded-full p-1 ${
                    group.hasUnviewed
                      ? "bg-gradient-to-tr from-blue-600 via-purple-500 to-pink-500"
                      : "bg-slate-700"
                  }`}
                >
                  {group.count > 1 && (
                    <span className="absolute -right-1 -top-1 z-20 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#0b1628] bg-blue-600 px-1 text-[10px] font-black text-white">
                      {group.count}
                    </span>
                  )}

                  <div className="relative h-14 w-14 overflow-hidden rounded-full border-[3px] border-[#07111f] bg-slate-800">
                    {group.latestStory.mediaUrl &&
                    group.latestStory.mediaType === "IMAGE" ? (
                      <Image
                        src={group.latestStory.mediaUrl}
                        alt={group.user.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : group.user.profileImageUrl ? (
                      <Image
                        src={group.user.profileImageUrl}
                        alt={group.user.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-blue-600 text-sm font-black text-white">
                        {getInitial(group.user.name)}
                      </div>
                    )}
                  </div>

                  {group.count > 1 && (
                    <div className="absolute inset-0 rounded-full border border-white/30" />
                  )}
                </div>

                <p className="mt-1.5 truncate text-[11px] font-bold text-slate-300">
                  {group.user.name}
                </p>
              </button>
            ))}
          </div>
        </section>

            <div className="rounded-[22px] border border-white/10 bg-[#0d1728] p-3 shadow-lg shadow-black/20">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts, topics, users, roles..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-bold text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
              />
            </div>

            {loading ? (
              <div className="rounded-[22px] border border-white/10 bg-[#0d1728] p-5 text-xs font-bold text-slate-400 shadow-lg shadow-black/20">
                Loading community posts...
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-white/20 bg-[#0d1728] p-8 text-center shadow-lg shadow-black/20">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-500/10 text-3xl">
                  🌐
                </div>

                <h2 className="mt-5 text-xl font-black text-white">
                  No discussions yet
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                  Be the first to ask a question, share an opportunity, or start a
                  useful conversation in this category.
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0d1728] shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-blue-500/10"
                >
                  <div
                    className={`bg-gradient-to-r ${getPostTheme(
                      post.category
                    )} p-4 text-white`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar user={post.user} small />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-black text-white">
                            {post.user.name}
                          </h3>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-black ${roleBadge(
                              post.user.role
                            )}`}
                          >
                            {post.user.role}
                          </span>

                          <span className="text-[11px] font-bold text-blue-100">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>

                        {post.isPinned && (
                          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-black text-amber-200">
                            📌 Pinned Announcement
                          </div>
                        )}

                        <span className="mt-2 inline-flex rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-black text-white backdrop-blur">
                          {
                            CATEGORIES.find((item) => item.value === post.category)
                              ?.icon
                          }{" "}
                          {post.category.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    {post.content && (
                      <p className="whitespace-pre-line text-[13px] leading-6 text-slate-200">
                        {post.content}
                      </p>
                    )}

                    {post.poll ? (
                      <div className="mt-4 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
                        <h3 className="text-base font-black text-white">
                          📊 {post.poll.question}
                        </h3>

                        <div className="mt-3 space-y-2">
                          {post.poll.options.map((option) => {
                            const totalVotes = post.poll?.totalVotes || 0;

                            const percentage =
                              totalVotes > 0
                                ? Math.round(
                                    (option.votes.length / totalVotes) * 100
                                  )
                                : 0;

                            return (
                              <button
                                key={option.id}
                                type="button"
                                disabled={
                                  Boolean(post.poll?.hasVoted) ||
                                  votingId === option.id
                                }
                                onClick={() => {
                                  if (!post.poll) return;
                                  votePoll(post.poll.id, option.id);
                                }}
                                className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition hover:border-blue-300 disabled:cursor-not-allowed"
                              >
                                <div className="relative">
                                  <div
                                    className="absolute inset-y-0 left-0 bg-blue-500/20"
                                    style={{
                                      width: `${percentage}%`,
                                    }}
                                  />

                                  <div className="relative flex items-center justify-between px-4 py-3">
                                    <span className="font-bold text-slate-100">
                                      {option.text}
                                    </span>

                                    <span className="text-sm font-black text-blue-300">
                                      {percentage}%
                                    </span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <p className="mt-3 text-xs font-black text-slate-400">
                          {post.poll.totalVotes} votes
                        </p>
                      </div>
                    ) : null}

                    {post.imageUrl && (
                      <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
                        <div className="relative flex h-[260px] items-center justify-center overflow-hidden">
                          <Image
                            src={post.imageUrl}
                            alt=""
                            fill
                            className="scale-110 object-cover opacity-30 blur-2xl"
                            sizes="(min-width:1024px) 700px, 100vw"
                          />

                          <Image
                            src={post.imageUrl}
                            alt="Community post image"
                            fill
                            className="object-contain"
                            sizes="(min-width:1024px) 700px, 100vw"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-y border-white/10 bg-white/5 px-4 py-2 text-[11px] font-black text-slate-400">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setReactionModalPost(post)}
                        className="font-black text-blue-300 hover:text-blue-200"
                      >
                        👍 {post.reactionCount || 0}
                      </button>

                      <span>💬 {post.comments.length}</span>

                      <span>
                        🔥 {(post.reactionCount || 0) + post.comments.length}
                      </span>
                    </div>

                    <span>Community Activity</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 px-4 py-3">
                    {[
                      ["LIKE", "👍"],
                      ["LOVE", "❤️"],
                      ["FIRE", "🔥"],
                      ["CELEBRATE", "🎉"],
                      ["SUPPORT", "👏"],
                    ].map(([type, icon]) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleReaction(post.id, type)}
                        disabled={reactingId === post.id}
                        className="inline-flex h-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-2.5 text-sm transition hover:bg-blue-500/10 disabled:opacity-60"
                      >
                        {icon}
                      </button>
                    ))}

                    {post.canPin && (
                      <button
                        type="button"
                        onClick={() => togglePinPost(post.id, Boolean(post.isPinned))}
                        disabled={pinningId === post.id}
                        className="inline-flex h-8 items-center justify-center rounded-xl border border-amber-300/30 bg-amber-500/10 px-3 text-xs font-black text-amber-200 transition hover:bg-amber-500/20 disabled:opacity-60"
                      >
                        {post.isPinned ? "📌 Unpin" : "📌 Pin"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => reportPost(post.id)}
                      disabled={reportingId === post.id}
                      className="inline-flex h-8 items-center justify-center rounded-xl border border-red-300/30 bg-red-500/10 px-3 text-xs font-black text-red-200 transition hover:bg-red-500/20 disabled:opacity-60"
                    >
                      🚩 Report
                    </button>
                  </div>

                  <div className="px-4 pb-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Comments ({post.comments.length})
                    </p>

                    {post.comments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {post.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="rounded-xl bg-white/5 p-3"
                          >
                            <div className="flex items-start gap-3">
                              <Avatar user={comment.user} small />

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-black text-white">
                                    {comment.user.name}
                                  </p>

                                  <span
                                    className={`rounded-full border px-2 py-0.5 text-[9px] font-black ${roleBadge(
                                      comment.user.role
                                    )}`}
                                  >
                                    {comment.user.role}
                                  </span>

                                  <span className="text-[10px] font-bold text-slate-500">
                                    {formatDate(comment.createdAt)}
                                  </span>
                                </div>

                                <p className="mt-1.5 whitespace-pre-line text-[13px] leading-5 text-slate-300">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex gap-2">
                      <input
                        value={commentText[post.id] || ""}
                        onChange={(e) =>
                          setCommentText((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        placeholder="Write a comment..."
                        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
                      />

                      <button
                        type="button"
                        onClick={() => createComment(post.id)}
                        disabled={
                          commentingId === post.id ||
                          !commentText[post.id]?.trim()
                        }
                        className="rounded-xl bg-blue-600 px-4 text-xs font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {commentingId === post.id ? "..." : "Send"}
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>

          <aside className="hidden space-y-3 xl:block">
            <section className="rounded-[24px] border border-white/10 bg-[#0d1728] p-4 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-300">
                  Top Contributors
                </p>

                <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[10px] font-black text-blue-200">
                  Leaderboard
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {leaderboard.length === 0 ? (
                  <p className="rounded-2xl bg-white/5 p-3 text-xs font-bold text-slate-400">
                    No contributors yet.
                  </p>
                ) : (
                  leaderboard.slice(0, 3).map((item) => (
                    <div
                      key={item.user.id}
                      className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-[11px] font-black text-white">
                        {item.rank === 1
                          ? "🥇"
                          : item.rank === 2
                            ? "🥈"
                            : item.rank === 3
                              ? "🥉"
                              : `#${item.rank}`}
                      </div>

                      <Avatar user={item.user} small />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-black text-white">
                          {item.user.name}
                        </p>

                        <p className="truncate text-[11px] font-semibold text-blue-300">
                          {item.points} pts
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-[24px] border border-white/10 bg-[#0d1728] p-4 shadow-xl shadow-black/20">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Active Members
              </p>

              <div className="mt-3 space-y-2">
                {leaderboard.length === 0 ? (
                  <p className="rounded-2xl bg-white/5 p-3 text-xs font-bold text-slate-400">
                    No active members yet.
                  </p>
                ) : (
                  leaderboard.slice(0, 5).map((item) => (
                    <div
                      key={item.user.id}
                      className="flex items-center gap-2 rounded-2xl px-2 py-1.5 transition hover:bg-white/5"
                    >
                      <div className="relative">
                        <Avatar user={item.user} small />
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0d1728] bg-emerald-500" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-black text-white">
                          {item.user.name}
                        </p>

                        <p className="truncate text-[11px] font-bold text-slate-400">
                          {item.badge.icon} {item.badge.title}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="relative rounded-[24px] border border-white/10 bg-[#0d1728] p-4 shadow-xl shadow-black/20">
              <button
                type="button"
                onClick={() => setShowTrendingPosts((prev) => !prev)}
                className="flex w-full items-center justify-between rounded-2xl bg-white/5 px-3 py-2.5 text-left transition hover:bg-blue-500/10"
              >
                <span>
                  <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Trending
                  </span>

                  <span className="mt-0.5 block text-[13px] font-black text-white">
                    View trending posts
                  </span>
                </span>

                <span className="text-sm text-blue-300">
                  {showTrendingPosts ? "▲" : "▼"}
                </span>
              </button>

              {showTrendingPosts && (
                <div className="absolute right-0 top-[76px] z-40 w-full rounded-[22px] border border-white/10 bg-[#0b1628] p-3 shadow-2xl shadow-black/40">
                  <div className="space-y-2">
                    {trendingPosts.length === 0 ? (
                      <p className="rounded-2xl bg-white/5 p-3 text-xs font-bold text-slate-400">
                        No trending posts yet.
                      </p>
                    ) : (
                      trendingPosts.map((post) => (
                        <button
                          key={post.id}
                          type="button"
                          onClick={() => {
                            setActiveFilter(post.category);
                            setShowTrendingPosts(false);
                          }}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-left transition hover:border-blue-400/40 hover:bg-blue-500/10"
                        >
                          <p className="line-clamp-2 text-[13px] font-black text-white">
                            {post.content || "Image post"}
                          </p>

                          <p className="mt-1.5 text-[11px] font-bold text-slate-400">
                            👍 {post.reactionCount || 0} · 💬 {post.comments.length}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-[24px] border border-blue-400/20 bg-blue-500/10 p-4 shadow-xl shadow-black/20">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-200">
                Community
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-300">
                Ask questions, share opportunities, and support other BuildUp members.
              </p>

              <a
                href="/dashboard/community/chat"
                className="mt-3 inline-flex w-full justify-center rounded-2xl bg-blue-600 px-3 py-2.5 text-xs font-black text-white transition hover:bg-blue-700"
              >
                Open Live Chat →
              </a>
            </section>
          </aside>
        </section>
      </div>


      {showCreatePostModal && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg">
            <form
              id="create-post"
              onSubmit={createPost}
              className="max-h-[85vh] overflow-y-auto rounded-[30px] border border-white/10 bg-[#0d1728] p-5 shadow-2xl shadow-black/50"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
                  New Community Post
                </p>

                <button
                  type="button"
                  onClick={() => setShowCreatePostModal(false)}
                  className="rounded-xl bg-white/10 px-3 py-2 text-sm font-black text-white transition hover:bg-white/20"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-300">
                Create Post
              </p>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="What's on your mind?"
                className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold leading-6 text-white outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-[#111d31] px-4 py-3 text-sm font-bold text-white outline-none"
              >
                {CATEGORIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.icon} {item.label}
                  </option>
                ))}
              </select>

              <div className="mt-4 flex flex-wrap gap-3">
                <label className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-slate-200 transition hover:bg-white/10">
                  🖼️ Image
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={uploadingImage}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadCommunityImage(file);
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setShowPollCreator(!showPollCreator)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-slate-200 transition hover:bg-white/10"
                >
                  📊 Poll
                </button>
              </div>

              {imagePreview && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
                  <div className="relative flex h-44 items-center justify-center overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Community post preview"
                      fill
                      className="object-contain"
                      sizes="360px"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl("");
                      setImagePreview("");
                    }}
                    className="w-full border-t border-white/10 px-4 py-3 text-sm font-black text-red-300 transition hover:bg-red-500/10"
                  >
                    Remove Image
                  </button>
                </div>
              )}

              {showPollCreator && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <input
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="Poll Question"
                    className="w-full rounded-xl border border-white/10 bg-[#111d31] px-4 py-3 text-white outline-none placeholder:text-slate-400"
                  />

                  <div className="mt-3 space-y-2">
                    {pollOptions.map((option, index) => (
                      <input
                        key={index}
                        value={option}
                        onChange={(e) => {
                          const next = [...pollOptions];
                          next[index] = e.target.value;
                          setPollOptions(next);
                        }}
                        placeholder={`Option ${index + 1}`}
                        className="w-full rounded-xl border border-white/10 bg-[#111d31] px-4 py-3 text-white outline-none placeholder:text-slate-400"
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPollOptions([...pollOptions, ""])}
                    className="mt-3 text-sm font-black text-blue-300"
                  >
                    + Add Option
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={
                  posting ||
                  uploadingImage ||
                  (!content.trim() && !imageUrl && !pollQuestion.trim())
                }
                className="mt-4 h-11 w-full rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {posting ? "Posting..." : "Post to Community"}
              </button>
            </form>


          </div>
        </div>
      )}

      {reactionModalPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-[#0d1728] text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h3 className="text-lg font-black">Reactions</h3>

              <button
                onClick={() => setReactionModalPost(null)}
                className="rounded-xl bg-white/10 px-3 py-2 text-sm font-black"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[500px] overflow-y-auto p-5">
              {reactionModalPost.reactions.length === 0 ? (
                <p className="text-sm font-bold text-slate-400">
                  No reactions yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {reactionModalPost.reactions.map((reaction) => (
                    <div
                      key={reaction.id}
                      className="flex items-center gap-3 rounded-2xl bg-white/5 p-3"
                    >
                      <Avatar user={reaction.user} small />

                      <div className="flex-1">
                        <p className="text-sm font-black text-white">
                          {reaction.user.name}
                        </p>

                        <p className="text-xs font-bold text-slate-400">
                          {reaction.user.role}
                        </p>
                      </div>

                      <span className="text-xl">{reactionIcon(reaction.type)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeStory && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[30px] bg-slate-950 text-white shadow-2xl">
            <div className="absolute left-4 right-4 top-3 z-30 h-1 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-2/3 rounded-full bg-white" />
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveStory(null);
                setShowStoryViewers(false);
              }}
              className="absolute right-4 top-6 z-30 rounded-full bg-white/20 px-3 py-2 text-sm font-black backdrop-blur"
            >
              ✕
            </button>

            <button
              type="button"
              onClick={goToPreviousStory}
              className="absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-xl font-black backdrop-blur"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={goToNextStory}
              className="absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-xl font-black backdrop-blur"
            >
              ›
            </button>

            <div className="p-4 pt-8">
              <div className="flex items-center gap-3">
                <Avatar user={activeStory.user} small />

                <div>
                  <p className="font-black">{activeStory.user.name}</p>

                  <button
                    type="button"
                    onClick={() => setShowStoryViewers(true)}
                    className="text-left text-xs font-bold text-slate-300 hover:text-white"
                  >
                    👀 {activeStory.viewCount || 0} views · ❤️{" "}
                    {activeStory.reactionCount || 0} reactions
                  </button>
                </div>
              </div>
            </div>

            {activeStory.mediaUrl && activeStory.mediaType === "IMAGE" && (
              <div className="relative h-[420px] bg-black">
                <Image
                  src={activeStory.mediaUrl}
                  alt="Community story"
                  fill
                  className="object-contain"
                  sizes="420px"
                />
              </div>
            )}

            {activeStory.mediaUrl && activeStory.mediaType === "VIDEO" && (
              <video
                src={activeStory.mediaUrl}
                controls
                autoPlay
                className="max-h-[420px] w-full bg-black"
              />
            )}

            {activeStory.content && (
              <div className="p-5">
                <p className="whitespace-pre-line text-sm leading-7">
                  {activeStory.content}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 border-t border-white/10 p-4">
              {[
                ["LOVE", "❤️"],
                ["FIRE", "🔥"],
                ["CELEBRATE", "🎉"],
                ["SUPPORT", "👏"],
              ].map(([type, icon]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => reactToStory(activeStory.id, type)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl transition hover:bg-white/20"
                >
                  {icon}
                </button>
              ))}
            </div>

            {showStoryViewers && (
              <div className="absolute inset-0 z-40 overflow-y-auto bg-slate-950/95 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white">
                    Story activity
                  </h3>

                  <button
                    type="button"
                    onClick={() => setShowStoryViewers(false)}
                    className="rounded-full bg-white/10 px-3 py-2 text-sm font-black text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-5 space-y-5">
                  <section>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Viewers
                    </p>

                    <div className="mt-3 space-y-3">
                      {activeStory.views?.length ? (
                        activeStory.views.map((view) => (
                          <div
                            key={view.id}
                            className="flex items-center gap-3 rounded-2xl bg-white/10 p-3"
                          >
                            <ViewerAvatar user={view.user} />

                            <p className="font-bold text-white">
                              {view.user.name}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="rounded-2xl bg-white/10 p-4 text-sm font-bold text-slate-300">
                          No viewers yet.
                        </p>
                      )}
                    </div>
                  </section>

                  <section>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Reactions
                    </p>

                    <div className="mt-3 space-y-3">
                      {activeStory.reactions?.length ? (
                        activeStory.reactions.map((reaction) => (
                          <div
                            key={reaction.id}
                            className="flex items-center gap-3 rounded-2xl bg-white/10 p-3"
                          >
                            <ViewerAvatar user={reaction.user} />

                            <p className="flex-1 font-bold text-white">
                              {reaction.user.name}
                            </p>

                            <span className="text-xl">
                              {reactionIcon(reaction.type)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="rounded-2xl bg-white/10 p-4 text-sm font-bold text-slate-300">
                          No reactions yet.
                        </p>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function Avatar({
  user,
  small = false,
}: {
  user: CommunityUser;
  small?: boolean;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-2xl bg-blue-600 text-white ${
        small ? "h-9 w-9" : "h-12 w-12"
      }`}
    >
      {user.profileImageUrl ? (
        <Image
          src={user.profileImageUrl}
          alt={user.name}
          fill
          className="object-cover"
          sizes={small ? "36px" : "48px"}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-black">
          {getInitial(user.name)}
        </div>
      )}
    </div>
  );
}

function ViewerAvatar({
  user,
}: {
  user: {
    id: string;
    name: string;
    profileImageUrl?: string | null;
  };
}) {
  return (
    <div className="relative h-9 w-9 overflow-hidden rounded-full bg-blue-600">
      {user.profileImageUrl ? (
        <Image
          src={user.profileImageUrl}
          alt={user.name}
          fill
          className="object-cover"
          sizes="36px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-black text-white">
          {getInitial(user.name)}
        </div>
      )}
    </div>
  );
}