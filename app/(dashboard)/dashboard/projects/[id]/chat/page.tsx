

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { getPusherClient } from "@/lib/pusher-client";
// import { useAudioRecorder } from "@/hooks/useAudioRecorder";

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

// type OnlineUser = { id: string; name: string; role: string };

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

//   const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   const { recording, startRecording, stopRecording } = useAudioRecorder();

//   /* ================= HELPERS ================= */

//   function isSeen(msg: UserMessage) {
//     return msg.reads?.some((r) => r.userId !== msg.sender.id) ?? false;
//   }

//   /* ================= LOAD CHAT ================= */

//   async function loadChat() {
//     const res = await fetch(`/api/chat/${projectId}`, { cache: "no-store" });
//     if (res.ok) setChat(await res.json());
//     setLoading(false);
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

//     const res = await fetch("/api/chat/send", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         chatId: chat.id,
//         content: optimistic.content,
//       }),
//     });

//     if (!res.ok) {
//       setChat((p) =>
//         p
//           ? { ...p, messages: p.messages.filter((m) => m.id !== tempId) }
//           : p
//       );
//     }
//   }

//   /* ================= SEND AUDIO ================= */

//   async function sendAudio() {
//     if (!chat || !session?.user) return;

//     const audio = await stopRecording();
//     if (!audio) return;

//     const tempId = `temp-audio-${Date.now()}`;

//     const optimistic: UserMessage = {
//       id: tempId,
//       content: "",
//       audioUrl: URL.createObjectURL(audio),
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

//     const uploadRes = await fetch("/api/chat/upload-audio", {
//       method: "POST",
//       body: form,
//     });

//     if (!uploadRes.ok) return;

//     const { url } = await uploadRes.json();

//     await fetch("/api/chat/send", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         chatId: chat.id,
//         content: "", // ✅ REQUIRED
//         audioUrl: url,
//       }),
//     });
//   }

//   /* ================= REAL-TIME ================= */

//   useEffect(() => {
//     if (!chat?.id || status !== "authenticated") return;

//     const pusher = getPusherClient();
//     const presence = pusher.subscribe(`presence-chat-${chat.id}`);
//     const channel = pusher.subscribe(`chat-${chat.id}`);

//     presence.bind("pusher:subscription_succeeded", (m: any) =>
//       setOnlineUsers(Object.values(m.members).map((x: any) => x.info))
//     );

//     channel.bind("new-message", (msg: Message) => {
//       setChat((p) =>
//         p && !p.messages.some((m) => m.id === msg.id)
//           ? { ...p, messages: [...p.messages.filter((m) => !m.id.startsWith("temp-")), msg] }
//           : p
//       );
//     });

//     channel.bind("typing", ({ userId, userName }: any) => {
//       if (userId === session?.user.id) return;
//       setTypingUser(userName);
//       clearTimeout(typingTimeout.current!);
//       typingTimeout.current = setTimeout(() => setTypingUser(null), 2000);
//     });

//     return () => {
//       presence.unbind_all();
//       channel.unbind_all();
//       pusher.unsubscribe(`presence-chat-${chat.id}`);
//       pusher.unsubscribe(`chat-${chat.id}`);
//     };
//   }, [chat?.id, status]);

//   useEffect(() => {
//     if (status === "authenticated") loadChat();
//   }, [status]);

//   /* ================= UI ================= */

//   if (loading) return <p className="p-6">Loading chat…</p>;
//   if (!chat) return <p className="p-6">Chat unavailable</p>;

//   return (
//     <div className="flex flex-col h-[100dvh] bg-white">
//       <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
//         {chat.messages.map((msg) =>
//           msg.isSystem ? (
//             <div key={msg.id} className="text-center text-xs">{msg.content}</div>
//           ) : (
//             <div
//               key={msg.id}
//               className={`flex ${msg.sender.id === session?.user.id ? "justify-end" : "justify-start"}`}
//             >
//               <div className="bg-white border rounded-xl p-3 max-w-[80%]">
//                 <p className="text-xs font-semibold">{msg.sender.name}</p>

//                 {msg.audioUrl ? (
//                   <audio controls src={msg.audioUrl} className="mt-1 w-56" />
//                 ) : (
//                   <p>{msg.content}</p>
//                 )}

//                 {msg.sender.id === session?.user.id && (
//                   <p className="text-[10px] text-right text-gray-400">
//                     {isSeen(msg) ? "✓✓ Seen" : "✓ Sent"}
//                   </p>
//                 )}
//               </div>
//             </div>
//           )
//         )}
//         <div ref={bottomRef} />
//       </div>

//       {typingUser && (
//         <div className="px-4 py-1 text-xs italic text-gray-500">
//           ✍️ {typingUser} is typing…
//         </div>
//       )}

//       <div className="border-t p-3 flex gap-2">
//         <input
//           value={input}
//           onChange={(e) => {
//             setInput(e.target.value);
//             const now = Date.now();
//             if (now - lastTypingRef.current > 1000 && chat) {
//               lastTypingRef.current = now;
//               fetch("/api/chat/typing", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ chatId: chat.id }),
//               });
//             }
//           }}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           className="flex-1 border rounded-xl px-4 py-2"
//           placeholder="Type message…"
//         />

//         <button
//           onMouseDown={startRecording}
//           onMouseUp={sendAudio}
//           className={`px-3 rounded-xl ${recording ? "bg-red-600 text-white" : "bg-gray-200"}`}
//         >
//           🎤
//         </button>

//         <button onClick={sendMessage} className="bg-indigo-600 text-white px-4 rounded-xl">
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useEffect, useRef, useState } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { getPusherClient } from "@/lib/pusher-client";
// import { useAudioRecorder } from "@/hooks/useAudioRecorder";

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

// type OnlineUser = { id: string; name: string; role: string };

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

//   const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   /* 🎤 Recorder */
//   const { recording, duration, startRecording, stopRecording } =
//     useAudioRecorder();

//   /* 📶 Upload state */
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploading, setUploading] = useState(false);

//   /* ================= HELPERS ================= */

//   function isSeen(msg: UserMessage) {
//     return msg.reads?.some((r) => r.userId !== msg.sender.id) ?? false;
//   }

//   /* ================= LOAD CHAT ================= */

//   async function loadChat() {
//     const res = await fetch(`/api/chat/${projectId}`, {
//       cache: "no-store",
//     });
//     if (res.ok) setChat(await res.json());
//     setLoading(false);
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

//     const res = await fetch("/api/chat/send", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ chatId: chat.id, content: optimistic.content }),
//     });

//     if (!res.ok) {
//       setChat((p) =>
//         p
//           ? { ...p, messages: p.messages.filter((m) => m.id !== tempId) }
//           : p
//       );
//     }
//   }

//   /* ================= SEND AUDIO ================= */

//   async function sendAudio() {
//     if (!chat || !session?.user) return;

//     const audio = await stopRecording();
//     if (!audio) return;

//     const tempId = `temp-audio-${Date.now()}`;

//     const optimistic: UserMessage = {
//       id: tempId,
//       content: "",
//       audioUrl: URL.createObjectURL(audio),
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

//     /* Upload with progress */
//     const form = new FormData();
//     form.append("file", audio);

//     setUploading(true);
//     setUploadProgress(0);

//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", "/api/chat/upload-audio");

//     xhr.upload.onprogress = (event) => {
//       if (event.lengthComputable) {
//         const percent = Math.round(
//           (event.loaded / event.total) * 100
//         );
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
//     };

//     xhr.send(form);
//   }

//   /* ================= REAL-TIME ================= */

//   useEffect(() => {
//     if (!chat?.id || status !== "authenticated") return;

//     const pusher = getPusherClient();
//     const presence = pusher.subscribe(`presence-chat-${chat.id}`);
//     const channel = pusher.subscribe(`chat-${chat.id}`);

//     presence.bind("pusher:subscription_succeeded", (m: any) =>
//       setOnlineUsers(Object.values(m.members).map((x: any) => x.info))
//     );

//     channel.bind("new-message", (msg: Message) => {
//       setChat((p) =>
//         p && !p.messages.some((m) => m.id === msg.id)
//           ? {
//               ...p,
//               messages: [
//                 ...p.messages.filter((m) => !m.id.startsWith("temp-")),
//                 msg,
//               ],
//             }
//           : p
//       );
//     });

//     channel.bind("typing", ({ userId, userName }: any) => {
//       if (userId === session?.user.id) return;
//       setTypingUser(userName);
//       clearTimeout(typingTimeout.current!);
//       typingTimeout.current = setTimeout(
//         () => setTypingUser(null),
//         2000
//       );
//     });

//     return () => {
//       presence.unbind_all();
//       channel.unbind_all();
//       pusher.unsubscribe(`presence-chat-${chat.id}`);
//       pusher.unsubscribe(`chat-${chat.id}`);
//     };
//   }, [chat?.id, status]);

//   useEffect(() => {
//     if (status === "authenticated") loadChat();
//   }, [status]);

//   /* Auto-scroll */
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat?.messages, typingUser]);

//   /* ================= UI ================= */

//   if (loading) return <p className="p-6">Loading chat…</p>;
//   if (!chat) return <p className="p-6">Chat unavailable</p>;

//   return (
//     <div className="flex flex-col h-[100dvh] bg-white">

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
//         {chat.messages.map((msg) =>
//           msg.isSystem ? (
//             <div key={msg.id} className="text-center text-xs">
//               {msg.content}
//             </div>
//           ) : (
//             <div
//               key={msg.id}
//               className={`flex ${
//                 msg.sender.id === session?.user.id
//                   ? "justify-end"
//                   : "justify-start"
//               }`}
//             >
//               <div className="bg-white border rounded-2xl p-3 max-w-[85%] shadow-sm">

//                 <p className="text-xs font-semibold">
//                   {msg.sender.name}
//                 </p>

//                 {msg.audioUrl ? (
//                   <div className="mt-2 space-y-1">
//                     <div className="flex gap-[2px] items-end h-6">
//                       {Array.from({ length: 20 }).map((_, i) => (
//                         <div
//                           key={i}
//                           className="w-[2px] bg-indigo-400 rounded"
//                           style={{ height: `${Math.random() * 100}%` }}
//                         />
//                       ))}
//                     </div>
//                     <audio
//                       controls
//                       src={msg.audioUrl}
//                       className="w-56"
//                     />
//                   </div>
//                 ) : (
//                   <p>{msg.content}</p>
//                 )}

//                 {msg.sender.id === session?.user.id && (
//                   <p className="text-[10px] text-right text-gray-400">
//                     {isSeen(msg) ? "✓✓ Seen" : "✓ Sent"}
//                   </p>
//                 )}
//               </div>
//             </div>
//           )
//         )}
//         <div ref={bottomRef} />
//       </div>

//       {/* Recording indicator */}
//       {recording && (
//         <div className="px-4 py-2 text-sm text-red-600 font-medium">
//           🔴 Recording… {duration}s
//         </div>
//       )}

//       {/* Upload progress */}
//       {uploading && (
//         <div className="w-full bg-gray-200 h-2">
//           <div
//             className="bg-indigo-600 h-2 transition-all"
//             style={{ width: `${uploadProgress}%` }}
//           />
//         </div>
//       )}

//       {/* Typing */}
//       {typingUser && (
//         <div className="px-4 py-1 text-xs italic text-gray-500">
//           ✍️ {typingUser} is typing…
//         </div>
//       )}

//       {/* Input */}
//       <div className="border-t p-3 flex gap-2">
//         <input
//           value={input}
//           onChange={(e) => {
//             setInput(e.target.value);
//             const now = Date.now();
//             if (now - lastTypingRef.current > 1000 && chat) {
//               lastTypingRef.current = now;
//               fetch("/api/chat/typing", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ chatId: chat.id }),
//               });
//             }
//           }}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           className="flex-1 border rounded-xl px-4 py-2"
//           placeholder="Type message…"
//         />

//         <button
//           onMouseDown={startRecording}
//           onMouseUp={sendAudio}
//           className={`px-3 rounded-xl ${
//             recording ? "bg-red-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           🎤
//         </button>

//         <button
//           onClick={sendMessage}
//           className="bg-indigo-600 text-white px-4 rounded-xl"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }




// "use client";

// import { useEffect, useRef, useState } from "react";
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

// type OnlineUser = { id: string; name: string; role: string };

// export default function ProjectChatPage() {
//   const { id: projectId } = useParams<{ id: string }>();
//   const { data: session, status } = useSession();

//   const [chat, setChat] = useState<Chat | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [input, setInput] = useState("");

//   const [typingUser, setTypingUser] = useState<string | null>(null);
//   const typingTimeout = useRef<NodeJS.Timeout | null>(null);
//   const lastTypingRef = useRef(0);

//   const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   const { recording, duration, startRecording, stopRecording } =
//     useAudioRecorder();

//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploading, setUploading] = useState(false);

//   function isSeen(msg: UserMessage) {
//     return msg.reads?.some((r) => r.userId !== msg.sender.id) ?? false;
//   }

//   async function loadChat() {
//     const res = await fetch(`/api/chat/${projectId}`, {
//       cache: "no-store",
//     });
//     if (res.ok) setChat(await res.json());
//     setLoading(false);
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
//       body: JSON.stringify({ chatId: chat.id, content: optimistic.content }),
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
//         const percent = Math.round(
//           (event.loaded / event.total) * 100
//         );
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

//     return () => {
//       channel.unbind_all();
//       pusher.unsubscribe(`chat-${chat.id}`);
//     };
//   }, [chat?.id, status]);

//   useEffect(() => {
//     if (status === "authenticated") loadChat();
//   }, [status]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat?.messages]);

//   if (loading) return <p className="p-6">Loading chat…</p>;
//   if (!chat) return <p className="p-6">Chat unavailable</p>;

//   return (
//     <div className="flex flex-col h-[100dvh] bg-white">

//       <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
//         {chat.messages.map((msg) =>
//           msg.isSystem ? (
//             <div key={msg.id} className="text-center text-xs">
//               {msg.content}
//             </div>
//           ) : (
//             <div
//               key={msg.id}
//               className={`flex ${
//                 msg.sender.id === session?.user.id
//                   ? "justify-end"
//                   : "justify-start"
//               }`}
//             >
//               <div className="bg-white border rounded-2xl p-3 max-w-[85%] shadow-sm">

//                 <p className="text-xs font-semibold">
//                   {msg.sender.name}
//                 </p>

//                 {msg.audioUrl ? (
//                   <div className="mt-2 space-y-2">
//                     <AudioWaveform src={msg.audioUrl} />
//                     <audio controls src={msg.audioUrl} className="w-56" />
//                   </div>
//                 ) : (
//                   <p>{msg.content}</p>
//                 )}

//                 {msg.sender.id === session?.user.id && (
//                   <p className="text-[10px] text-right text-gray-400">
//                     {isSeen(msg) ? "✓✓ Seen" : "✓ Sent"}
//                   </p>
//                 )}
//               </div>
//             </div>
//           )
//         )}
//         <div ref={bottomRef} />
//       </div>

//       {recording && (
//         <div className="px-4 py-2 text-sm text-red-600 font-medium">
//           🔴 Recording… {duration}s
//         </div>
//       )}

//       {uploading && (
//         <div className="w-full bg-gray-200 h-2">
//           <div
//             className="bg-indigo-600 h-2 transition-all"
//             style={{ width: `${uploadProgress}%` }}
//           />
//         </div>
//       )}

//       <div className="border-t p-3 flex gap-2">
//         <input
//           value={input}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           className="flex-1 border rounded-xl px-4 py-2"
//           placeholder="Type message…"
//           onChange={(e) => setInput(e.target.value)}
//         />

//         <button
//           onMouseDown={startRecording}
//           onMouseUp={sendAudio}
//           className={`px-3 rounded-xl ${
//             recording ? "bg-red-600 text-white" : "bg-gray-200"
//           }`}
//         >
//           🎤
//         </button>

//         <button
//           onClick={sendMessage}
//           className="bg-indigo-600 text-white px-4 rounded-xl"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useRef, useState } from "react";
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

  /* 🎤 Recorder */
  const { recording, duration, startRecording, stopRecording } =
    useAudioRecorder();

  /* 📶 Upload */
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  /* ================= HELPERS ================= */

  function isSeen(msg: UserMessage) {
    return msg.reads?.some((r) => r.userId !== msg.sender.id) ?? false;
  }

  /* ================= LOAD CHAT ================= */

  async function loadChat() {
    const res = await fetch(`/api/chat/${projectId}`, {
      cache: "no-store",
    });

    if (res.ok) setChat(await res.json());
    setLoading(false);
  }

  /* ================= SEND TEXT ================= */

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

    setChat((p) =>
      p ? { ...p, messages: [...p.messages, optimistic] } : p
    );

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

  /* ================= SEND AUDIO ================= */

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

    setChat((p) =>
      p ? { ...p, messages: [...p.messages, optimistic] } : p
    );

    const form = new FormData();
    form.append("file", audio);

    setUploading(true);
    setUploadProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/chat/upload-audio");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round(
          (event.loaded / event.total) * 100
        );
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

  /* ================= REALTIME ================= */

  useEffect(() => {
    if (!chat?.id || status !== "authenticated") return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`chat-${chat.id}`);

    /* 🔔 New Message */
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

    /* ✍️ Typing */
    channel.bind(
      "typing",
      ({ userId, userName }: { userId: string; userName: string }) => {
        if (userId === session?.user.id) return;

        setTypingUser(userName);

        if (typingTimeout.current)
          clearTimeout(typingTimeout.current);

        typingTimeout.current = setTimeout(() => {
          setTypingUser(null);
        }, 2000);
      }
    );

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`chat-${chat.id}`);
    };
  }, [chat?.id, status]);

  useEffect(() => {
    if (status === "authenticated") loadChat();
  }, [status]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  /* ================= UI ================= */

  if (loading) return <p className="p-6">Loading chat…</p>;
  if (!chat) return <p className="p-6">Chat unavailable</p>;

  return (
    <div className="flex flex-col h-[100dvh] bg-white">

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {chat.messages.map((msg) =>
          msg.isSystem ? (
            <div key={msg.id} className="text-center text-xs">
              {msg.content}
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
              <div className="bg-white border rounded-2xl p-3 max-w-[85%] shadow-sm">
                <p className="text-xs font-semibold">
                  {msg.sender.name}
                </p>

                {msg.audioUrl ? (
                  <div className="mt-2 space-y-2">
                    <AudioWaveform src={msg.audioUrl} />
                    <audio
                      controls
                      src={msg.audioUrl}
                      className="w-56"
                    />
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}

                {msg.sender.id === session?.user.id && (
                  <p className="text-[10px] text-right text-gray-400">
                    {isSeen(msg) ? "✓✓ Seen" : "✓ Sent"}
                  </p>
                )}
              </div>
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* RECORDING INDICATOR */}
      {recording && (
        <div className="px-4 py-2 text-sm text-red-600 font-medium">
          🔴 Recording… {duration}s
        </div>
      )}

      {/* UPLOAD PROGRESS */}
      {uploading && (
        <div className="w-full bg-gray-200 h-2">
          <div
            className="bg-indigo-600 h-2 transition-all"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* TYPING UI */}
      {typingUser && (
        <div className="px-4 py-1 text-xs italic text-gray-500">
          ✍️ {typingUser} is typing…
        </div>
      )}

      {/* INPUT */}
      <div className="border-t p-3 flex gap-2">
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
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 border rounded-xl px-4 py-2"
          placeholder="Type message…"
        />

        <button
          onMouseDown={startRecording}
          onMouseUp={sendAudio}
          className={`px-3 rounded-xl ${
            recording ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
        >
          🎤
        </button>

        <button
          onClick={sendMessage}
          className="bg-indigo-600 text-white px-4 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}
