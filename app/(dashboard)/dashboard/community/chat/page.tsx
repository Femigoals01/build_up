



// "use client";

// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import { useEffect, useRef, useState } from "react";

// type ChatUser = {
//   id: string;
//   name: string;
//   role: string;
//   profileImageUrl?: string | null;
// };

// type CommunityChatMessage = {
//   id: string;
//   content: string;
//   createdAt: string;
//   user: ChatUser;
// };

// function getInitial(name?: string | null) {
//   return name?.trim()?.charAt(0)?.toUpperCase() || "U";
// }

// function formatTime(date: string) {
//   return new Intl.DateTimeFormat("en", {
//     hour: "numeric",
//     minute: "2-digit",
//   }).format(new Date(date));
// }

// function roleBadge(role: string) {
//   if (role === "ORGANIZATION") return "bg-blue-50 text-blue-700";
//   if (role === "MENTOR") return "bg-violet-50 text-violet-700";
//   if (role === "ADMIN") return "bg-slate-100 text-slate-700";
//   return "bg-emerald-50 text-emerald-700";
// }

// export default function CommunityChatPage() {
//   const { data: session } = useSession();

//   const [messages, setMessages] = useState<CommunityChatMessage[]>([]);
//   const [content, setContent] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);
//   const [error, setError] = useState("");

//   const bottomRef = useRef<HTMLDivElement | null>(null);

//   async function loadMessages() {
//     try {
//       const res = await fetch("/api/community/chat", {
//         cache: "no-store",
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to load messages.");
//       }

//       setMessages(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadMessages();

//     const interval = window.setInterval(loadMessages, 5000);

//     return () => window.clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages.length]);

//   async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     const text = content.trim();

//     if (!text) return;

//     try {
//       setSending(true);
//       setError("");

//       const res = await fetch("/api/community/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           content: text,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Failed to send message.");
//       }

//       setContent("");
//       await loadMessages();
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Something went wrong.");
//     } finally {
//       setSending(false);
//     }
//   }

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 px-3 py-5 sm:px-6 lg:px-8">
//       <div className="mx-auto flex h-[calc(100vh-130px)] max-w-5xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
//         <section className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-5 py-4 text-white sm:px-6">
//           <div>
//             <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-100">
//               Live Community Chat
//             </p>

//             <h1 className="mt-1 text-xl font-black sm:text-2xl">
//               BuildUp Community Room
//             </h1>

//             <p className="mt-1 text-xs font-semibold text-blue-100">
//               🟢 Community members online
//             </p>
//           </div>

//           <div className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-black text-blue-50 sm:block">
//             💬 Live Chat
//           </div>
//         </section>

//         {error && (
//           <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700">
//             {error}
//           </div>
//         )}

//         <section className="min-h-0 flex-1 overflow-y-auto bg-slate-100 bg-[radial-gradient(circle_at_1px_1px,#dbeafe_1px,transparent_0)] [background-size:24px_24px] px-3 py-5 sm:px-6">
//           {loading ? (
//             <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500">
//               Loading community chat...
//             </div>
//           ) : messages.length === 0 ? (
//             <div className="flex h-full items-center justify-center">
//               <div className="max-w-md rounded-[30px] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
//                 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-3xl">
//                   💬
//                 </div>

//                 <h2 className="mt-5 text-xl font-black text-slate-900">
//                   No messages yet
//                 </h2>

//                 <p className="mt-2 text-sm leading-6 text-slate-500">
//                   Start the first conversation in the BuildUp community room.
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               <div className="my-4 flex justify-center">
//                 <span className="rounded-full bg-white/90 px-4 py-1 text-xs font-black text-slate-500 shadow-sm">
//                   Today
//                 </span>
//               </div>

//               {messages.map((message) => {
//                 const isMine = message.user.id === session?.user?.id;

//                 return (
//                   <div
//                     key={message.id}
//                     className={`flex ${
//                       isMine ? "justify-end" : "justify-start"
//                     }`}
//                   >
//                     {!isMine && (
//                       <div className="mr-2 mt-auto hidden sm:block">
//                         <Avatar user={message.user} />
//                       </div>
//                     )}

//                     <div
//                       className={`max-w-[82%] rounded-3xl px-4 py-3 shadow-sm sm:max-w-[75%] ${
//                         isMine
//                           ? "rounded-br-md bg-blue-600 text-white"
//                           : "rounded-bl-md bg-white text-slate-800"
//                       }`}
//                     >
//                       {!isMine && (
//                         <div className="mb-1 flex flex-wrap items-center gap-2">
//                           <p className="text-sm font-black text-slate-900">
//                             {message.user.name}
//                           </p>

//                           <span
//                             className={`rounded-full px-2 py-0.5 text-[9px] font-black ${roleBadge(
//                               message.user.role
//                             )}`}
//                           >
//                             {message.user.role}
//                           </span>
//                         </div>
//                       )}

//                       <p className="whitespace-pre-line text-sm leading-6">
//                         {message.content}
//                       </p>

//                       <p
//                         className={`mt-1 text-right text-[10px] font-bold ${
//                           isMine ? "text-blue-100" : "text-slate-400"
//                         }`}
//                       >
//                         {formatTime(message.createdAt)}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}

//               <div ref={bottomRef} />
//             </div>
//           )}
//         </section>

//         <form
//           onSubmit={sendMessage}
//           className="border-t border-slate-200 bg-white/95 p-3 backdrop-blur sm:p-4"
//         >
//           <div className="flex items-center gap-2">
//             <input
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="Type your message..."
//               maxLength={1000}
//               className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
//             />

//             <button
//               type="submit"
//               disabled={sending || !content.trim()}
//               className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6 sm:text-sm"
//             >
//               {sending ? "..." : "➤"}
//             </button>
//           </div>

//           <p className="mt-2 hidden text-xs font-semibold text-slate-400 sm:block">
//             Keep conversations respectful, useful, and professional.
//           </p>
//         </form>
//       </div>
//     </main>
//   );
// }

// function Avatar({ user }: { user: ChatUser }) {
//   return (
//     <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-blue-600 text-white">
//       {user.profileImageUrl ? (
//         <Image
//           src={user.profileImageUrl}
//           alt={user.name}
//           fill
//           className="object-cover"
//           sizes="36px"
//         />
//       ) : (
//         <div className="flex h-full w-full items-center justify-center text-xs font-black">
//           {getInitial(user.name)}
//         </div>
//       )}
//     </div>
//   );
// }




"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

type ChatUser = {
  id: string;
  name: string;
  role: string;
  profileImageUrl?: string | null;
};

type CommunityChatMessage = {
  id: string;
  content: string;
  mediaUrl?: string | null;
  mediaType?: "IMAGE" | "VIDEO" | string | null;
  createdAt: string;
  user: ChatUser;
};

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "U";
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function roleBadge(role: string) {
  if (role === "ORGANIZATION") return "bg-blue-50 text-blue-700";
  if (role === "MENTOR") return "bg-violet-50 text-violet-700";
  if (role === "ADMIN") return "bg-slate-100 text-slate-700";
  return "bg-emerald-50 text-emerald-700";
}

export default function CommunityChatPage() {
  const { data: session } = useSession();

  const [messages, setMessages] = useState<CommunityChatMessage[]>([]);
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO" | "">("");
  const [mediaPreview, setMediaPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  async function loadMessages() {
    try {
      const res = await fetch("/api/community/chat", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load messages.");
      }

      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();

    const interval = window.setInterval(loadMessages, 5000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function uploadChatMedia(file: File) {
    try {
      setUploadingMedia(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/community/chat/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to upload media.");
      }

      setMediaUrl(data.mediaUrl);
      setMediaType(data.mediaType);
      setMediaPreview(data.mediaUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setMediaUrl("");
      setMediaType("");
      setMediaPreview("");
    } finally {
      setUploadingMedia(false);
    }
  }

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const text = content.trim();

    if (!text && !mediaUrl) return;

    try {
      setSending(true);
      setError("");

      const res = await fetch("/api/community/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: text,
          mediaUrl,
          mediaType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setContent("");
      setMediaUrl("");
      setMediaType("");
      setMediaPreview("");

      await loadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 px-3 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-[calc(100vh-130px)] max-w-5xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
        <section className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-slate-950 via-blue-950 to-blue-700 px-5 py-4 text-white sm:px-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-100">
              Live Community Chat
            </p>

            <h1 className="mt-1 text-xl font-black sm:text-2xl">
              BuildUp Community Room
            </h1>

            <p className="mt-1 text-xs font-semibold text-blue-100">
              🟢 Community members online
            </p>
          </div>

          <div className="hidden rounded-full bg-white/10 px-4 py-2 text-sm font-black text-blue-50 sm:block">
            💬 Live Chat
          </div>
        </section>

        {error && (
          <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        <section className="min-h-0 flex-1 overflow-y-auto bg-slate-100 bg-[radial-gradient(circle_at_1px_1px,#dbeafe_1px,transparent_0)] [background-size:24px_24px] px-3 py-5 sm:px-6">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500">
              Loading community chat...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-md rounded-[30px] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-3xl">
                  💬
                </div>

                <h2 className="mt-5 text-xl font-black text-slate-900">
                  No messages yet
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Start the first conversation in the BuildUp community room.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="my-4 flex justify-center">
                <span className="rounded-full bg-white/90 px-4 py-1 text-xs font-black text-slate-500 shadow-sm">
                  Today
                </span>
              </div>

              {messages.map((message) => {
                const isMine = message.user.id === session?.user?.id;

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMine && (
                      <div className="mr-2 mt-auto hidden sm:block">
                        <Avatar user={message.user} />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] overflow-hidden rounded-3xl px-4 py-3 shadow-sm sm:max-w-[75%] ${
                        isMine
                          ? "rounded-br-md bg-blue-600 text-white"
                          : "rounded-bl-md bg-white text-slate-800"
                      }`}
                    >
                      {!isMine && (
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <p className="text-sm font-black text-slate-900">
                            {message.user.name}
                          </p>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-black ${roleBadge(
                              message.user.role
                            )}`}
                          >
                            {message.user.role}
                          </span>
                        </div>
                      )}

                      {message.mediaUrl && message.mediaType === "IMAGE" && (
                        <div className="mb-3 overflow-hidden rounded-2xl bg-slate-950">
                          <Image
                            src={message.mediaUrl}
                            alt="Chat image"
                            width={700}
                            height={420}
                            className="h-auto max-h-[360px] w-full object-contain"
                          />
                        </div>
                      )}

                      {message.mediaUrl && message.mediaType === "VIDEO" && (
                        <div className="mb-3 overflow-hidden rounded-2xl bg-black">
                          <video
                            src={message.mediaUrl}
                            controls
                            className="max-h-[360px] w-full rounded-2xl"
                          />
                        </div>
                      )}

                      {message.content && (
                        <p className="whitespace-pre-line text-sm leading-6">
                          {message.content}
                        </p>
                      )}

                      <p
                        className={`mt-1 text-right text-[10px] font-bold ${
                          isMine ? "text-blue-100" : "text-slate-400"
                        }`}
                      >
                        {formatTime(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div ref={bottomRef} />
            </div>
          )}
        </section>

        <form
          onSubmit={sendMessage}
          className="border-t border-slate-200 bg-white/95 p-3 backdrop-blur sm:p-4"
        >
          {mediaPreview && (
            <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
              {mediaType === "IMAGE" ? (
                <div className="relative h-40 overflow-hidden rounded-xl bg-slate-950">
                  <Image
                    src={mediaPreview}
                    alt="Media preview"
                    fill
                    className="object-contain"
                    sizes="300px"
                  />
                </div>
              ) : (
                <video
                  src={mediaPreview}
                  controls
                  className="max-h-44 w-full rounded-xl bg-black"
                />
              )}

              <button
                type="button"
                onClick={() => {
                  setMediaUrl("");
                  setMediaType("");
                  setMediaPreview("");
                }}
                className="mt-3 w-full rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-600 transition hover:bg-red-100"
              >
                Remove Media
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xl transition hover:bg-blue-50">
              {uploadingMedia ? "…" : "📎"}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                className="hidden"
                disabled={uploadingMedia}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadChatMedia(file);
                }}
              />
            </label>

            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message..."
              maxLength={1000}
              className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <button
              type="submit"
              disabled={sending || uploadingMedia || (!content.trim() && !mediaUrl)}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6 sm:text-sm"
            >
              {sending ? "..." : "➤"}
            </button>
          </div>

          <p className="mt-2 hidden text-xs font-semibold text-slate-400 sm:block">
            You can send text, images, and short videos. Keep conversations respectful.
          </p>
        </form>
      </div>
    </main>
  );
}

function Avatar({ user }: { user: ChatUser }) {
  return (
    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-blue-600 text-white">
      {user.profileImageUrl ? (
        <Image
          src={user.profileImageUrl}
          alt={user.name}
          fill
          className="object-cover"
          sizes="36px"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-black">
          {getInitial(user.name)}
        </div>
      )}
    </div>
  );
}