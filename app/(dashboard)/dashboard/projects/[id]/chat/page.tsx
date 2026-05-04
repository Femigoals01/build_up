







// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { getPusherClient } from "@/lib/pusher-client";
// import { useAudioRecorder } from "@/hooks/useAudioRecorder";
// import AudioWaveform from "@/components/chat/AudioWaveform";

// /* ================= TYPES ================= */

// type MessageRead = { userId: string };

// type BaseMessage = {
//   id: string;
//   content: string;
//   createdAt: string;
//   reads?: MessageRead[];
// };

// type SystemMessage = BaseMessage & { isSystem: true };

// type UserMessage = BaseMessage & {
//   isSystem: false;
//   sender: { id: string; name: string; role: string };
//   audioUrl?: string;
// };

// type Message = SystemMessage | UserMessage;

// type Chat = { id: string; messages: Message[] };

// /* ================= HELPERS ================= */

// function formatTime(dateString: string) {
//   return new Date(dateString).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// function formatRole(role: string) {
//   return role.charAt(0) + role.slice(1).toLowerCase();
// }

// function getRoleBadgeStyle(role: string) {
//   switch (role) {
//     case "MENTOR":
//       return "bg-purple-100 text-purple-700";
//     case "ORGANIZATION":
//       return "bg-blue-100 text-blue-700";
//     case "VOLUNTEER":
//       return "bg-emerald-100 text-emerald-700";
//     case "ADMIN":
//       return "bg-amber-100 text-amber-700";
//     default:
//       return "bg-gray-100 text-gray-700";
//   }
// }

// /* ================= COMPONENT ================= */

// export default function ProjectChatPage() {
//   const { id: projectId } = useParams<{ id: string }>();
//   const { data: session, status } = useSession();

//   const [chat, setChat] = useState<Chat | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [input, setInput] = useState("");

//   const [typingUser, setTypingUser] = useState<string | null>(null);
//   const typingTimeout = useRef<NodeJS.Timeout | null>(null);
//   const lastTypingRef = useRef(0);

//   const bottomRef = useRef<HTMLDivElement>(null);

//   /* 🎤 Recorder */
//   const { recording, duration, startRecording, stopRecording } =
//     useAudioRecorder();

//   /* 📶 Upload */
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploading, setUploading] = useState(false);

//   /* ================= HELPERS ================= */

//   function isSeen(msg: UserMessage) {
//     return msg.reads?.some((r) => r.userId !== msg.sender.id) ?? false;
//   }

//   const sortedMessages = useMemo(() => {
//     return chat?.messages ?? [];
//   }, [chat?.messages]);

//   /* ================= LOAD CHAT ================= */

//   async function loadChat() {
//     try {
//       const res = await fetch(`/api/chat/${projectId}`, {
//         cache: "no-store",
//       });

//       if (res.ok) setChat(await res.json());
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* ================= SEND TEXT ================= */

//   async function sendMessage() {
//     if (!input.trim() || !chat || !session?.user) return;

//     const tempId = `temp-${Date.now()}`;

//     const optimistic: UserMessage = {
//       id: tempId,
//       content: input,
//       createdAt: new Date().toISOString(),
//       isSystem: false,
//       sender: {
//         id: session.user.id,
//         name: session.user.name!,
//         role: session.user.role,
//       },
//       reads: [],
//     };

//     setChat((p) =>
//       p ? { ...p, messages: [...p.messages, optimistic] } : p
//     );

//     setInput("");

//     await fetch("/api/chat/send", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         chatId: chat.id,
//         content: optimistic.content,
//       }),
//     });
//   }

//   /* ================= SEND AUDIO ================= */

//   async function sendAudio() {
//     if (!chat || !session?.user) return;

//     const audio = await stopRecording();
//     if (!audio) return;

//     const tempId = `temp-audio-${Date.now()}`;
//     const previewUrl = URL.createObjectURL(audio);

//     const optimistic: UserMessage = {
//       id: tempId,
//       content: "",
//       audioUrl: previewUrl,
//       createdAt: new Date().toISOString(),
//       isSystem: false,
//       sender: {
//         id: session.user.id,
//         name: session.user.name!,
//         role: session.user.role,
//       },
//       reads: [],
//     };

//     setChat((p) =>
//       p ? { ...p, messages: [...p.messages, optimistic] } : p
//     );

//     const form = new FormData();
//     form.append("file", audio);

//     setUploading(true);
//     setUploadProgress(0);

//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", "/api/chat/upload-audio");

//     xhr.upload.onprogress = (event) => {
//       if (event.lengthComputable) {
//         const percent = Math.round((event.loaded / event.total) * 100);
//         setUploadProgress(percent);
//       }
//     };

//     xhr.onload = async () => {
//       setUploading(false);

//       const { url } = JSON.parse(xhr.responseText);

//       await fetch("/api/chat/send", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           chatId: chat.id,
//           content: "",
//           audioUrl: url,
//         }),
//       });

//       URL.revokeObjectURL(previewUrl);
//     };

//     xhr.send(form);
//   }

//   /* ================= REALTIME ================= */

//   useEffect(() => {
//     if (!chat?.id || status !== "authenticated") return;

//     const pusher = getPusherClient();
//     const channel = pusher.subscribe(`chat-${chat.id}`);

//     channel.bind("new-message", (msg: Message) => {
//       setChat((p) =>
//         p && !p.messages.some((m) => m.id === msg.id)
//           ? {
//               ...p,
//               messages: [
//                 ...p.messages.filter(
//                   (m) =>
//                     !(
//                       m.id.startsWith("temp-") &&
//                       !m.isSystem &&
//                       !msg.isSystem &&
//                       "sender" in m &&
//                       "sender" in msg &&
//                       m.sender.id === msg.sender.id
//                     )
//                 ),
//                 msg,
//               ],
//             }
//           : p
//       );
//     });

//     channel.bind(
//       "typing",
//       ({ userId, userName }: { userId: string; userName: string }) => {
//         if (userId === session?.user.id) return;

//         setTypingUser(userName);

//         if (typingTimeout.current) clearTimeout(typingTimeout.current);

//         typingTimeout.current = setTimeout(() => {
//           setTypingUser(null);
//         }, 2000);
//       }
//     );

//     return () => {
//       channel.unbind_all();
//       pusher.unsubscribe(`chat-${chat.id}`);
//     };
//   }, [chat?.id, status, session?.user.id]);

//   useEffect(() => {
//     if (status === "authenticated") loadChat();
//   }, [status]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat?.messages]);

//   /* ================= STATES ================= */

//   if (loading) {
//     return (
//       <div className="flex h-[100dvh] items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6">
//         <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
//           <div className="animate-pulse space-y-4">
//             <div className="h-5 w-40 rounded bg-slate-200" />
//             <div className="h-24 rounded-2xl bg-slate-100" />
//             <div className="h-24 rounded-2xl bg-slate-100" />
//             <div className="h-12 rounded-2xl bg-slate-200" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!chat) {
//     return (
//       <div className="flex h-[100dvh] items-center justify-center bg-slate-50 px-6">
//         <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
//           <div className="mb-3 text-4xl">💬</div>
//           <h2 className="text-xl font-semibold text-slate-900">
//             Chat unavailable
//           </h2>
//           <p className="mt-2 text-sm text-slate-500">
//             This conversation could not be loaded right now.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   /* ================= UI ================= */

//   return (
//     <div className="h-[100dvh] bg-gradient-to-br from-slate-100 via-white to-slate-100 p-3 md:p-5">
//       <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
//         {/* HEADER */}
//         <div className="border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-6">
//           <div className="flex items-center justify-between gap-4">
//             <div className="min-w-0">
//               <div className="flex items-center gap-3">
//                 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-lg text-white shadow-sm">
//                   💬
//                 </div>
//                 <div className="min-w-0">
//                   <h1 className="truncate text-lg font-semibold text-slate-900 md:text-xl">
//                     Project Conversation
//                   </h1>
//                   <p className="text-sm text-slate-500">
//                     Communicate clearly with your team in real time
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 sm:block">
//               {sortedMessages.length} message
//               {sortedMessages.length === 1 ? "" : "s"}
//             </div>
//           </div>
//         </div>

//         {/* RECORDING / UPLOAD / TYPING STATUS BAR */}
//         {(recording || uploading || typingUser) && (
//           <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 md:px-6">
//             <div className="flex flex-wrap items-center gap-3 text-sm">
//               {recording && (
//                 <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 font-medium text-red-600">
//                   <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
//                   Recording... {duration}s
//                 </div>
//               )}

//               {uploading && (
//                 <div className="flex min-w-[220px] flex-1 items-center gap-3">
//                   <span className="text-xs font-medium text-slate-600">
//                     Uploading audio... {uploadProgress}%
//                   </span>
//                   <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
//                     <div
//                       className="h-full rounded-full bg-indigo-600 transition-all duration-300"
//                       style={{ width: `${uploadProgress}%` }}
//                     />
//                   </div>
//                 </div>
//               )}

//               {typingUser && (
//                 <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
//                   <span className="flex gap-1">
//                     <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]" />
//                     <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
//                     <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500" />
//                   </span>
//                   {typingUser} is typing...
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* MESSAGES */}
//         <div className="flex-1 overflow-y-auto bg-[linear-gradient(to_bottom,rgba(248,250,252,0.95),rgba(255,255,255,1))] px-3 py-4 md:px-6 md:py-6">
//           <div className="mx-auto flex max-w-4xl flex-col gap-4">
//             {sortedMessages.length === 0 ? (
//               <div className="flex flex-1 items-center justify-center py-20">
//                 <div className="max-w-sm text-center">
//                   <div className="mb-4 text-5xl">📨</div>
//                   <h3 className="text-lg font-semibold text-slate-900">
//                     No messages yet
//                   </h3>
//                   <p className="mt-2 text-sm text-slate-500">
//                     Start the conversation and keep your project moving.
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               sortedMessages.map((msg) =>
//                 msg.isSystem ? (
//                   <div key={msg.id} className="flex justify-center">
//                     <div className="rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-center text-xs font-medium text-slate-500 shadow-sm">
//                       {msg.content}
//                     </div>
//                   </div>
//                 ) : (
//                   <div
//                     key={msg.id}
//                     className={`flex ${
//                       msg.sender.id === session?.user.id
//                         ? "justify-end"
//                         : "justify-start"
//                     }`}
//                   >
//                     <div className="max-w-[88%] md:max-w-[72%]">
//                       <div
//                         className={`rounded-3xl px-4 py-3 shadow-sm ring-1 ${
//                           msg.sender.id === session?.user.id
//                             ? "bg-indigo-600 text-white ring-indigo-600"
//                             : "bg-white text-slate-900 ring-slate-200"
//                         }`}
//                       >
//                         <div className="mb-2 flex flex-wrap items-center gap-2">
//                           <p
//                             className={`text-xs font-semibold ${
//                               msg.sender.id === session?.user.id
//                                 ? "text-indigo-100"
//                                 : "text-slate-700"
//                             }`}
//                           >
//                             {msg.sender.name}
//                           </p>

//                           <span
//                             className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
//                               msg.sender.id === session?.user.id
//                                 ? "bg-white/15 text-white"
//                                 : getRoleBadgeStyle(msg.sender.role)
//                             }`}
//                           >
//                             {formatRole(msg.sender.role)}
//                           </span>
//                         </div>

//                         {msg.audioUrl ? (
//                           <div className="space-y-3">
//                             <div
//                               className={`rounded-2xl p-3 ${
//                                 msg.sender.id === session?.user.id
//                                   ? "bg-white/10"
//                                   : "bg-slate-50"
//                               }`}
//                             >
//                               <AudioWaveform src={msg.audioUrl} />
//                             </div>
//                             <audio
//                               controls
//                               src={msg.audioUrl}
//                               className="w-full max-w-sm"
//                             />
//                           </div>
//                         ) : (
//                           <p
//                             className={`whitespace-pre-wrap text-sm leading-6 ${
//                               msg.sender.id === session?.user.id
//                                 ? "text-white"
//                                 : "text-slate-800"
//                             }`}
//                           >
//                             {msg.content}
//                           </p>
//                         )}

//                         <div className="mt-3 flex items-center justify-between gap-3">
//                           <p
//                             className={`text-[11px] ${
//                               msg.sender.id === session?.user.id
//                                 ? "text-indigo-100"
//                                 : "text-slate-400"
//                             }`}
//                           >
//                             {formatTime(msg.createdAt)}
//                           </p>

//                           {msg.sender.id === session?.user.id && (
//                             <p className="text-[11px] font-medium text-indigo-100">
//                               {isSeen(msg) ? "✓✓ Seen" : "✓ Sent"}
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )
//               )
//             )}
//             <div ref={bottomRef} />
//           </div>
//         </div>

//         {/* INPUT */}
//         <div className="border-t border-slate-200 bg-white px-3 py-3 md:px-6 md:py-4">
//           <div className="mx-auto flex max-w-4xl items-end gap-2 md:gap-3">
//             <div className="flex-1 rounded-[24px] border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
//               <input
//                 value={input}
//                 onChange={(e) => {
//                   setInput(e.target.value);

//                   const now = Date.now();
//                   if (chat && now - lastTypingRef.current > 1000) {
//                     lastTypingRef.current = now;

//                     fetch("/api/chat/typing", {
//                       method: "POST",
//                       headers: { "Content-Type": "application/json" },
//                       body: JSON.stringify({ chatId: chat.id }),
//                     });
//                   }
//                 }}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     sendMessage();
//                   }
//                 }}
//                 className="w-full bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
//                 placeholder="Type your message..."
//               />
//             </div>

//             <button
//               onMouseDown={startRecording}
//               onMouseUp={sendAudio}
//               className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-lg shadow-sm transition ${
//                 recording
//                   ? "border-red-600 bg-red-600 text-white"
//                   : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
//               }`}
//               title="Hold to record"
//               type="button"
//             >
//               🎤
//             </button>

//             <button
//               onClick={sendMessage}
//               className="h-12 rounded-2xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
//               disabled={!input.trim()}
//               type="button"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getPusherClient } from "@/lib/pusher-client";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import AudioWaveform from "@/components/chat/AudioWaveform";

/* ================= TYPES ================= */

type MessageRead = { userId: string };

type BaseMessage = {
  id: string;
  content: string;
  createdAt: string;
  reads?: MessageRead[];
};

type SystemMessage = BaseMessage & { isSystem: true };

type UserMessage = BaseMessage & {
  isSystem: false;
  sender: { id: string; name: string; role: string };
  audioUrl?: string;
};

type Message = SystemMessage | UserMessage;

type Chat = { id: string; messages: Message[] };

/* ================= HELPERS ================= */

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRole(role: string) {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

function getRoleBadgeStyle(role: string) {
  switch (role) {
    case "MENTOR":
      return "bg-purple-100 text-purple-700";
    case "ORGANIZATION":
      return "bg-blue-100 text-blue-700";
    case "VOLUNTEER":
      return "bg-emerald-100 text-emerald-700";
    case "ADMIN":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

/* ================= COMPONENT ================= */

export default function ProjectChatPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const { data: session, status } = useSession();

  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");

  const [typingUser, setTypingUser] = useState<string | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastTypingRef = useRef(0);

  const bottomRef = useRef<HTMLDivElement>(null);

  const { recording, duration, startRecording, stopRecording } =
    useAudioRecorder();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  function isSeen(msg: UserMessage) {
    return msg.reads?.some((r) => r.userId !== msg.sender.id) ?? false;
  }

  const sortedMessages = useMemo(() => {
    return chat?.messages ?? [];
  }, [chat?.messages]);

  async function loadChat() {
    try {
      const res = await fetch(`/api/chat/${projectId}`, {
        cache: "no-store",
      });

      if (res.ok) setChat(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || !chat || !session?.user) return;

    const tempId = `temp-${Date.now()}`;

    const optimistic: UserMessage = {
      id: tempId,
      content: input,
      createdAt: new Date().toISOString(),
      isSystem: false,
      sender: {
        id: session.user.id,
        name: session.user.name!,
        role: session.user.role,
      },
      reads: [],
    };

    setChat((p) => (p ? { ...p, messages: [...p.messages, optimistic] } : p));

    setInput("");

    await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: chat.id,
        content: optimistic.content,
      }),
    });
  }

  async function sendAudio() {
    if (!chat || !session?.user) return;

    const audio = await stopRecording();
    if (!audio) return;

    const tempId = `temp-audio-${Date.now()}`;
    const previewUrl = URL.createObjectURL(audio);

    const optimistic: UserMessage = {
      id: tempId,
      content: "",
      audioUrl: previewUrl,
      createdAt: new Date().toISOString(),
      isSystem: false,
      sender: {
        id: session.user.id,
        name: session.user.name!,
        role: session.user.role,
      },
      reads: [],
    };

    setChat((p) => (p ? { ...p, messages: [...p.messages, optimistic] } : p));

    const form = new FormData();
    form.append("file", audio);

    setUploading(true);
    setUploadProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/chat/upload-audio");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = async () => {
      setUploading(false);

      const { url } = JSON.parse(xhr.responseText);

      await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: chat.id,
          content: "",
          audioUrl: url,
        }),
      });

      URL.revokeObjectURL(previewUrl);
    };

    xhr.send(form);
  }

  useEffect(() => {
    if (!chat?.id || status !== "authenticated") return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`chat-${chat.id}`);

    channel.bind("new-message", (msg: Message) => {
      setChat((p) =>
        p && !p.messages.some((m) => m.id === msg.id)
          ? {
              ...p,
              messages: [
                ...p.messages.filter(
                  (m) =>
                    !(
                      m.id.startsWith("temp-") &&
                      !m.isSystem &&
                      !msg.isSystem &&
                      "sender" in m &&
                      "sender" in msg &&
                      m.sender.id === msg.sender.id
                    )
                ),
                msg,
              ],
            }
          : p
      );
    });

    channel.bind(
      "typing",
      ({ userId, userName }: { userId: string; userName: string }) => {
        if (userId === session?.user.id) return;

        setTypingUser(userName);

        if (typingTimeout.current) clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
          setTypingUser(null);
        }, 2000);
      }
    );

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`chat-${chat.id}`);
    };
  }, [chat?.id, status, session?.user.id]);

  useEffect(() => {
    if (status === "authenticated") loadChat();
  }, [status]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  if (loading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="h-24 rounded-2xl bg-slate-100" />
            <div className="h-24 rounded-2xl bg-slate-100" />
            <div className="h-12 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mb-3 text-4xl">💬</div>
          <h2 className="text-xl font-semibold text-slate-900">
            Chat unavailable
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            This conversation could not be loaded right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] max-w-full overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-100 p-2 sm:p-3 md:p-5">
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)] sm:rounded-[28px]">
        {/* HEADER */}
        <div className="border-b border-slate-200 bg-white/90 px-3 py-3 backdrop-blur sm:px-4 sm:py-4 md:px-6">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-lg text-white shadow-sm sm:h-11 sm:w-11">
                  💬
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg md:text-xl">
                    Project Conversation
                  </h1>
                  <p className="truncate text-xs text-slate-500 sm:text-sm">
                    Communicate clearly with your team in real time
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 sm:block">
              {sortedMessages.length} message
              {sortedMessages.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        {/* RECORDING / UPLOAD / TYPING STATUS BAR */}
        {(recording || uploading || typingUser) && (
          <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 sm:px-4 md:px-6">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {recording && (
                <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 font-medium text-red-600">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
                  Recording... {duration}s
                </div>
              )}

              {uploading && (
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="shrink-0 text-xs font-medium text-slate-600">
                    Uploading... {uploadProgress}%
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {typingUser && (
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500" />
                  </span>
                  {typingUser} is typing...
                </div>
              )}
            </div>
          </div>
        )}

        {/* MESSAGES */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(to_bottom,rgba(248,250,252,0.95),rgba(255,255,255,1))] px-3 py-4 md:px-6 md:py-6">
          <div className="mx-auto flex max-w-4xl flex-col gap-4">
            {sortedMessages.length === 0 ? (
              <div className="flex flex-1 items-center justify-center py-20">
                <div className="max-w-sm text-center">
                  <div className="mb-4 text-5xl">📨</div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    No messages yet
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Start the conversation and keep your project moving.
                  </p>
                </div>
              </div>
            ) : (
              sortedMessages.map((msg) =>
                msg.isSystem ? (
                  <div key={msg.id} className="flex justify-center">
                    <div className="rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-center text-xs font-medium text-slate-500 shadow-sm">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender.id === session?.user.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className="max-w-[92%] sm:max-w-[88%] md:max-w-[72%]">
                      <div
                        className={`rounded-3xl px-4 py-3 shadow-sm ring-1 ${
                          msg.sender.id === session?.user.id
                            ? "bg-indigo-600 text-white ring-indigo-600"
                            : "bg-white text-slate-900 ring-slate-200"
                        }`}
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <p
                            className={`text-xs font-semibold ${
                              msg.sender.id === session?.user.id
                                ? "text-indigo-100"
                                : "text-slate-700"
                            }`}
                          >
                            {msg.sender.name}
                          </p>

                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              msg.sender.id === session?.user.id
                                ? "bg-white/15 text-white"
                                : getRoleBadgeStyle(msg.sender.role)
                            }`}
                          >
                            {formatRole(msg.sender.role)}
                          </span>
                        </div>

                        {msg.audioUrl ? (
                          <div className="space-y-3">
                            <div
                              className={`rounded-2xl p-3 ${
                                msg.sender.id === session?.user.id
                                  ? "bg-white/10"
                                  : "bg-slate-50"
                              }`}
                            >
                              <AudioWaveform src={msg.audioUrl} />
                            </div>
                            <audio
                              controls
                              src={msg.audioUrl}
                              className="w-full max-w-full"
                            />
                          </div>
                        ) : (
                          <p
                            className={`break-words whitespace-pre-wrap text-sm leading-6 ${
                              msg.sender.id === session?.user.id
                                ? "text-white"
                                : "text-slate-800"
                            }`}
                          >
                            {msg.content}
                          </p>
                        )}

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <p
                            className={`text-[11px] ${
                              msg.sender.id === session?.user.id
                                ? "text-indigo-100"
                                : "text-slate-400"
                            }`}
                          >
                            {formatTime(msg.createdAt)}
                          </p>

                          {msg.sender.id === session?.user.id && (
                            <p className="text-[11px] font-medium text-indigo-100">
                              {isSeen(msg) ? "✓✓ Seen" : "✓ Sent"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* INPUT */}
        <div className="border-t border-slate-200 bg-white px-3 py-3 md:px-6 md:py-4">
          <div className="mx-auto flex max-w-4xl flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
            <div className="min-w-0 flex-1 rounded-[24px] border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
              <input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);

                  const now = Date.now();
                  if (chat && now - lastTypingRef.current > 1000) {
                    lastTypingRef.current = now;

                    fetch("/api/chat/typing", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ chatId: chat.id }),
                    });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="w-full bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                placeholder="Type your message..."
              />
            </div>

            <div className="grid grid-cols-[48px_1fr] gap-2 sm:flex sm:shrink-0 sm:gap-3">
              <button
                onMouseDown={startRecording}
                onMouseUp={sendAudio}
                onTouchStart={startRecording}
                onTouchEnd={sendAudio}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-lg shadow-sm transition ${
                  recording
                    ? "border-red-600 bg-red-600 text-white"
                    : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                title="Hold to record"
                type="button"
              >
                🎤
              </button>

              <button
                onClick={sendMessage}
                className="h-12 w-full rounded-2xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                disabled={!input.trim()}
                type="button"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}