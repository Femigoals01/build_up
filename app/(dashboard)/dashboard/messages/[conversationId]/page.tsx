





// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { getPusherClient } from "@/lib/pusher-client";
// import { useAudioRecorder } from "@/hooks/useAudioRecorder";
// import AudioWaveform from "@/components/chat/AudioWaveform";

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
//   audioUrl?: string | null;
//   fileUrl?: string | null;
//   fileName?: string | null;
//   fileType?: string | null;
//   fileSize?: number | null;
// };

// type Message = SystemMessage | UserMessage;

// type Chat = { id: string; messages: Message[] };

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
//       return "bg-purple-100 text-purple-700 border-purple-200";
//     case "ORGANIZATION":
//       return "bg-blue-100 text-blue-700 border-blue-200";
//     case "VOLUNTEER":
//       return "bg-emerald-100 text-emerald-700 border-emerald-200";
//     case "ADMIN":
//       return "bg-amber-100 text-amber-700 border-amber-200";
//     default:
//       return "bg-gray-100 text-gray-700 border-gray-200";
//   }
// }

// function getInitials(name?: string) {
//   if (!name) return "U";
//   return name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();
// }

// function formatFileSize(size?: number | null) {
//   if (!size) return "";
//   if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
//   return `${(size / (1024 * 1024)).toFixed(1)} MB`;
// }

// export default function DirectChatPage() {
//   const { conversationId } = useParams<{ conversationId: string }>();
//   const { data: session, status } = useSession();

//   const [chat, setChat] = useState<Chat | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [input, setInput] = useState("");

//   const [typingUser, setTypingUser] = useState<string | null>(null);
//   const typingTimeout = useRef<NodeJS.Timeout | null>(null);
//   const lastTypingRef = useRef(0);

//   const bottomRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const { recording, duration, startRecording, stopRecording } =
//     useAudioRecorder();

//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploading, setUploading] = useState(false);

//   const [audioPreview, setAudioPreview] = useState<Blob | null>(null);
//   const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(
//     null
//   );

//   const canSendMessage = Boolean(input.trim() || selectedFile);

//   function isSeen(msg: UserMessage) {
//     return msg.reads?.some((r) => r.userId !== msg.sender.id) ?? false;
//   }

//   const sortedMessages = useMemo(() => chat?.messages ?? [], [chat?.messages]);

//   const otherUser = useMemo(() => {
//     return sortedMessages.find(
//       (msg): msg is UserMessage =>
//         !msg.isSystem && msg.sender.id !== session?.user?.id
//     )?.sender;
//   }, [sortedMessages, session?.user?.id]);

//   async function loadChat() {
//     try {
//       const res = await fetch(`/api/direct-chat/${conversationId}`, {
//         cache: "no-store",
//       });

//       if (res.ok) {
//         setChat(await res.json());
//       }
//     } finally {
//       setLoading(false);
//     }
//   }

//   function handleFileSelect(file: File) {
//     if (selectedFilePreview) URL.revokeObjectURL(selectedFilePreview);

//     setSelectedFile(file);

//     if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
//       setSelectedFilePreview(URL.createObjectURL(file));
//     } else {
//       setSelectedFilePreview(null);
//     }
//   }

//   function removeSelectedFile() {
//     if (selectedFilePreview) URL.revokeObjectURL(selectedFilePreview);
//     setSelectedFile(null);
//     setSelectedFilePreview(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   }

//   async function uploadSelectedFile(file: File) {
//     return new Promise<{
//       url: string;
//       name: string;
//       type: string;
//       size: number;
//     }>((resolve, reject) => {
//       const form = new FormData();
//       form.append("file", file);

//       setUploading(true);
//       setUploadProgress(0);

//       const xhr = new XMLHttpRequest();
//       xhr.open("POST", "/api/chat/upload-file");

//       xhr.upload.onprogress = (event) => {
//         if (event.lengthComputable) {
//           setUploadProgress(Math.round((event.loaded / event.total) * 100));
//         }
//       };

//       xhr.onload = () => {
//         setUploading(false);

//         if (xhr.status >= 200 && xhr.status < 300) {
//           resolve(JSON.parse(xhr.responseText));
//         } else {
//           reject(new Error("File upload failed"));
//         }
//       };

//       xhr.onerror = () => {
//         setUploading(false);
//         reject(new Error("File upload failed"));
//       };

//       xhr.send(form);
//     });
//   }

//   async function sendMessage() {
//     if (!canSendMessage || !chat || !session?.user || uploading) return;

//     const messageText = input.trim();
//     let uploadedFile:
//       | {
//           url: string;
//           name: string;
//           type: string;
//           size: number;
//         }
//       | null = null;

//     if (selectedFile) {
//       uploadedFile = await uploadSelectedFile(selectedFile);
//     }

//     const tempId = `temp-${Date.now()}`;

//     const optimistic: UserMessage = {
//       id: tempId,
//       content: messageText,
//       createdAt: new Date().toISOString(),
//       isSystem: false,
//       sender: {
//         id: session.user.id,
//         name: session.user.name || "User",
//         role: session.user.role,
//       },
//       reads: [],
//       fileUrl: uploadedFile?.url ?? selectedFilePreview,
//       fileName: uploadedFile?.name ?? selectedFile?.name ?? null,
//       fileType: uploadedFile?.type ?? selectedFile?.type ?? null,
//       fileSize: uploadedFile?.size ?? selectedFile?.size ?? null,
//     };

//     setChat((prev) =>
//       prev ? { ...prev, messages: [...prev.messages, optimistic] } : prev
//     );

//     setInput("");
//     removeSelectedFile();

//     await fetch("/api/direct-chat/send", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         conversationId: chat.id,
//         content: messageText,
//         fileUrl: uploadedFile?.url ?? null,
//         fileName: uploadedFile?.name ?? null,
//         fileType: uploadedFile?.type ?? null,
//         fileSize: uploadedFile?.size ?? null,
//       }),
//     });
//   }

//   async function handleRecordingRelease() {
//     const blob = await stopRecording();
//     if (!blob || blob.size === 0) return;

//     const url = URL.createObjectURL(blob);
//     setAudioPreview(blob);
//     setAudioPreviewUrl(url);
//   }

//   function cancelAudioPreview() {
//     if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
//     setAudioPreview(null);
//     setAudioPreviewUrl(null);
//   }

//   async function sendAudioPreview() {
//     if (!chat || !session?.user || !audioPreview || uploading) return;

//     const previewUrl = audioPreviewUrl || URL.createObjectURL(audioPreview);
//     const tempId = `temp-audio-${Date.now()}`;

//     const optimistic: UserMessage = {
//       id: tempId,
//       content: "",
//       audioUrl: previewUrl,
//       createdAt: new Date().toISOString(),
//       isSystem: false,
//       sender: {
//         id: session.user.id,
//         name: session.user.name || "User",
//         role: session.user.role,
//       },
//       reads: [],
//     };

//     setChat((prev) =>
//       prev ? { ...prev, messages: [...prev.messages, optimistic] } : prev
//     );

//     const form = new FormData();
//     form.append("file", audioPreview);

//     setUploading(true);
//     setUploadProgress(0);

//     const xhr = new XMLHttpRequest();
//     xhr.open("POST", "/api/chat/upload-audio");

//     xhr.upload.onprogress = (event) => {
//       if (event.lengthComputable) {
//         setUploadProgress(Math.round((event.loaded / event.total) * 100));
//       }
//     };

//     xhr.onload = async () => {
//       setUploading(false);

//       try {
//         const { url } = JSON.parse(xhr.responseText);

//         await fetch("/api/direct-chat/send", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             conversationId: chat.id,
//             content: "",
//             audioUrl: url,
//           }),
//         });
//       } finally {
//         cancelAudioPreview();
//       }
//     };

//     xhr.onerror = () => {
//       setUploading(false);
//       cancelAudioPreview();
//     };

//     xhr.send(form);
//   }

//   useEffect(() => {
//     if (!chat?.id || status !== "authenticated") return;

//     const pusher = getPusherClient();
//     const channelName = `direct-${chat.id}`;
//     const channel = pusher.subscribe(channelName);

//     channel.bind("new-message", (msg: Message) => {
//       setChat((prev) =>
//         prev && !prev.messages.some((m) => m.id === msg.id)
//           ? {
//               ...prev,
//               messages: [
//                 ...prev.messages.filter(
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
//           : prev
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
//       pusher.unsubscribe(channelName);
//     };
//   }, [chat?.id, status, session?.user.id]);

//   useEffect(() => {
//     if (status === "authenticated") loadChat();
//   }, [status, conversationId]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat?.messages, typingUser]);

//   useEffect(() => {
//     return () => {
//       if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
//       if (selectedFilePreview) URL.revokeObjectURL(selectedFilePreview);
//     };
//   }, [audioPreviewUrl, selectedFilePreview]);

//   if (loading) {
//     return (
//       <div className="flex h-[100dvh] items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6">
//         <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
//           <div className="animate-pulse space-y-4">
//             <div className="h-5 w-40 rounded bg-slate-200" />
//             <div className="h-24 rounded-3xl bg-slate-100" />
//             <div className="h-24 rounded-3xl bg-slate-100" />
//             <div className="h-12 rounded-2xl bg-slate-200" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!chat) {
//     return (
//       <div className="flex h-[100dvh] items-center justify-center bg-slate-50 px-6">
//         <div className="max-w-md rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
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

//   return (
//     <div className="h-[100dvh] bg-gradient-to-br from-slate-100 via-white to-indigo-50 p-3 md:p-5">
//       <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.10)]">
//         <div className="border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-6">
//           <div className="flex items-center justify-between gap-4">
//             <div className="flex min-w-0 items-center gap-3">
//               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-sm font-bold text-white shadow-sm">
//                 {getInitials(otherUser?.name || "DM")}
//               </div>

//               <div className="min-w-0">
//                 <h1 className="truncate text-lg font-bold text-slate-900 md:text-xl">
//                   {otherUser?.name || "Direct Conversation"}
//                 </h1>
//                 <div className="mt-1 flex flex-wrap items-center gap-2">
//                   {otherUser?.role ? (
//                     <span
//                       className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getRoleBadgeStyle(
//                         otherUser.role
//                       )}`}
//                     >
//                       {formatRole(otherUser.role)}
//                     </span>
//                   ) : null}

//                   <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
//                     <span className="h-2 w-2 rounded-full bg-emerald-500" />
//                     Private chat
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 sm:block">
//               {sortedMessages.length} message
//               {sortedMessages.length === 1 ? "" : "s"}
//             </div>
//           </div>
//         </div>

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
//                     Uploading... {uploadProgress}%
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
//                   {typingUser} is typing...
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_28%),linear-gradient(to_bottom,rgba(248,250,252,0.95),rgba(255,255,255,1))] px-3 py-4 md:px-6 md:py-6">
//           <div className="mx-auto flex max-w-4xl flex-col gap-4">
//             {sortedMessages.length === 0 ? (
//               <div className="flex flex-1 items-center justify-center py-20">
//                 <div className="max-w-sm text-center">
//                   <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-4xl">
//                     📨
//                   </div>
//                   <h3 className="text-lg font-bold text-slate-900">
//                     Start the conversation
//                   </h3>
//                   <p className="mt-2 text-sm leading-6 text-slate-500">
//                     Send a private message to keep the work moving.
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               sortedMessages.map((msg) =>
//                 msg.isSystem ? (
//                   <div key={msg.id} className="flex justify-center">
//                     <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-center text-xs font-medium text-slate-500 shadow-sm">
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
//                         className={`rounded-[26px] px-4 py-3 shadow-sm ring-1 ${
//                           msg.sender.id === session?.user.id
//                             ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white ring-indigo-500"
//                             : "bg-white text-slate-900 ring-slate-200"
//                         }`}
//                       >
//                         <div className="mb-2 flex flex-wrap items-center gap-2">
//                           <p
//                             className={`text-xs font-bold ${
//                               msg.sender.id === session?.user.id
//                                 ? "text-indigo-100"
//                                 : "text-slate-700"
//                             }`}
//                           >
//                             {msg.sender.name}
//                           </p>

//                           <span
//                             className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
//                               msg.sender.id === session?.user.id
//                                 ? "border-white/15 bg-white/15 text-white"
//                                 : getRoleBadgeStyle(msg.sender.role)
//                             }`}
//                           >
//                             {formatRole(msg.sender.role)}
//                           </span>
//                         </div>

//                         {msg.content && (
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

//                         {msg.audioUrl && (
//                           <div className="mt-3 space-y-3">
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
//                         )}

//                         {msg.fileUrl && (
//                           <div className="mt-3">
//                             {msg.fileType?.startsWith("image") ? (
//                               <a href={msg.fileUrl} target="_blank">
//                                 <img
//                                   src={msg.fileUrl}
//                                   alt={msg.fileName || "Uploaded image"}
//                                   className="max-h-72 max-w-full rounded-2xl border border-white/20 object-cover"
//                                 />
//                               </a>
//                             ) : msg.fileType?.startsWith("video") ? (
//                               <video
//                                 controls
//                                 src={msg.fileUrl}
//                                 className="max-h-72 max-w-full rounded-2xl"
//                               />
//                             ) : (
//                               <a
//                                 href={msg.fileUrl}
//                                 target="_blank"
//                                 rel="noreferrer"
//                                 className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
//                                   msg.sender.id === session?.user.id
//                                     ? "border-white/20 bg-white/10 text-white"
//                                     : "border-slate-200 bg-slate-50 text-slate-700"
//                                 }`}
//                               >
//                                 <span className="text-xl">📎</span>
//                                 <span className="min-w-0">
//                                   <span className="block truncate">
//                                     {msg.fileName || "Open file"}
//                                   </span>
//                                   <span className="block text-xs opacity-70">
//                                     {formatFileSize(msg.fileSize)}
//                                   </span>
//                                 </span>
//                               </a>
//                             )}
//                           </div>
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

//         <div className="border-t border-slate-200 bg-white px-3 py-3 md:px-6 md:py-4">
//           {selectedFile && (
//             <div className="mx-auto mb-3 max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 p-3">
//               <div className="flex items-center justify-between gap-3">
//                 <div className="min-w-0 flex items-center gap-3">
//                   {selectedFilePreview && selectedFile.type.startsWith("image/") ? (
//                     <img
//                       src={selectedFilePreview}
//                       alt={selectedFile.name}
//                       className="h-14 w-14 rounded-xl object-cover"
//                     />
//                   ) : selectedFilePreview && selectedFile.type.startsWith("video/") ? (
//                     <video
//                       src={selectedFilePreview}
//                       className="h-14 w-14 rounded-xl object-cover"
//                     />
//                   ) : (
//                     <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-2xl">
//                       📎
//                     </div>
//                   )}

//                   <div className="min-w-0">
//                     <p className="truncate text-sm font-semibold text-slate-800">
//                       {selectedFile.name}
//                     </p>
//                     <p className="text-xs text-slate-500">
//                       {formatFileSize(selectedFile.size)}
//                     </p>
//                   </div>
//                 </div>

//                 <button
//                   type="button"
//                   onClick={removeSelectedFile}
//                   className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           )}

//           {audioPreview && audioPreviewUrl && (
//             <div className="mx-auto mb-3 flex max-w-4xl flex-col gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-3 sm:flex-row sm:items-center sm:justify-between">
//               <audio controls src={audioPreviewUrl} className="w-full sm:w-72" />

//               <div className="flex gap-2">
//                 <button
//                   onClick={cancelAudioPreview}
//                   type="button"
//                   className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={sendAudioPreview}
//                   type="button"
//                   className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
//                 >
//                   Send Audio
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="mx-auto flex max-w-4xl items-end gap-2 md:gap-3">
//             <div className="flex flex-1 items-center gap-2 rounded-[24px] border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
//               <input
//                 value={input}
//                 onChange={(e) => {
//                   setInput(e.target.value);

//                   const now = Date.now();

//                   if (chat && now - lastTypingRef.current > 1000) {
//                     lastTypingRef.current = now;

//                     fetch("/api/direct-chat/typing", {
//                       method: "POST",
//                       headers: { "Content-Type": "application/json" },
//                       body: JSON.stringify({ conversationId: chat.id }),
//                     });
//                   }
//                 }}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     sendMessage();
//                   }
//                 }}
//                 className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
//                 placeholder="Type your message..."
//               />

//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 className="hidden"
//                 accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0];
//                   if (file) handleFileSelect(file);
//                 }}
//               />

//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg text-slate-600 hover:bg-slate-200"
//                 title="Attach file"
//                 type="button"
//               >
//                 📎
//               </button>
//             </div>

//             <button
//               onMouseDown={startRecording}
//               onMouseUp={handleRecordingRelease}
//               onTouchStart={startRecording}
//               onTouchEnd={handleRecordingRelease}
//               className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-lg shadow-sm transition ${
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
//               className="h-12 shrink-0 rounded-2xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
//               disabled={!canSendMessage || uploading}
//               type="button"
//             >
//               {uploading ? "Sending..." : "Send"}
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
  audioUrl?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  fileSize?: number | null;
};

type Message = SystemMessage | UserMessage;

type Chat = { id: string; messages: Message[] };

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
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "ORGANIZATION":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "VOLUNTEER":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "ADMIN":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatFileSize(size?: number | null) {
  if (!size) return "";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DirectChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { data: session, status } = useSession();

  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");

  const [typingUser, setTypingUser] = useState<string | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastTypingRef = useRef(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { recording, duration, startRecording, stopRecording } =
    useAudioRecorder();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [audioPreview, setAudioPreview] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(
    null
  );

  const canSendMessage = Boolean(input.trim() || selectedFile);

  function isSeen(msg: UserMessage) {
    return msg.reads?.some((r) => r.userId !== msg.sender.id) ?? false;
  }

  const sortedMessages = useMemo(() => chat?.messages ?? [], [chat?.messages]);

  const otherUser = useMemo(() => {
    return sortedMessages.find(
      (msg): msg is UserMessage =>
        !msg.isSystem && msg.sender.id !== session?.user?.id
    )?.sender;
  }, [sortedMessages, session?.user?.id]);

  async function loadChat() {
    try {
      const res = await fetch(`/api/direct-chat/${conversationId}`, {
        cache: "no-store",
      });

      if (res.ok) {
        setChat(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }

  function handleFileSelect(file: File) {
    if (selectedFilePreview) URL.revokeObjectURL(selectedFilePreview);

    setSelectedFile(file);

    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      setSelectedFilePreview(URL.createObjectURL(file));
    } else {
      setSelectedFilePreview(null);
    }
  }

  function removeSelectedFile() {
    if (selectedFilePreview) URL.revokeObjectURL(selectedFilePreview);
    setSelectedFile(null);
    setSelectedFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadSelectedFile(file: File) {
    return new Promise<{
      url: string;
      name: string;
      type: string;
      size: number;
    }>((resolve, reject) => {
      const form = new FormData();
      form.append("file", file);

      setUploading(true);
      setUploadProgress(0);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/chat/upload-file");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = () => {
        setUploading(false);

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error("File upload failed"));
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        reject(new Error("File upload failed"));
      };

      xhr.send(form);
    });
  }

  async function sendMessage() {
    if (!canSendMessage || !chat || !session?.user || uploading) return;

    const messageText = input.trim();

    let uploadedFile:
      | {
          url: string;
          name: string;
          type: string;
          size: number;
        }
      | null = null;

    if (selectedFile) {
      uploadedFile = await uploadSelectedFile(selectedFile);
    }

    const tempId = `temp-${Date.now()}`;

    const optimistic: UserMessage = {
      id: tempId,
      content: messageText,
      createdAt: new Date().toISOString(),
      isSystem: false,
      sender: {
        id: session.user.id,
        name: session.user.name || "User",
        role: session.user.role,
      },
      reads: [],
      fileUrl: uploadedFile?.url ?? selectedFilePreview,
      fileName: uploadedFile?.name ?? selectedFile?.name ?? null,
      fileType: uploadedFile?.type ?? selectedFile?.type ?? null,
      fileSize: uploadedFile?.size ?? selectedFile?.size ?? null,
    };

    setChat((prev) =>
      prev ? { ...prev, messages: [...prev.messages, optimistic] } : prev
    );

    setInput("");
    removeSelectedFile();

    await fetch("/api/direct-chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: chat.id,
        content: messageText,
        fileUrl: uploadedFile?.url ?? null,
        fileName: uploadedFile?.name ?? null,
        fileType: uploadedFile?.type ?? null,
        fileSize: uploadedFile?.size ?? null,
      }),
    });
  }

  async function handleRecordingRelease() {
    const blob = await stopRecording();
    if (!blob || blob.size === 0) return;

    const url = URL.createObjectURL(blob);
    setAudioPreview(blob);
    setAudioPreviewUrl(url);
  }

  function cancelAudioPreview() {
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setAudioPreview(null);
    setAudioPreviewUrl(null);
  }

  async function sendAudioPreview() {
    if (!chat || !session?.user || !audioPreview || uploading) return;

    const previewUrl = audioPreviewUrl || URL.createObjectURL(audioPreview);
    const tempId = `temp-audio-${Date.now()}`;

    const optimistic: UserMessage = {
      id: tempId,
      content: "",
      audioUrl: previewUrl,
      createdAt: new Date().toISOString(),
      isSystem: false,
      sender: {
        id: session.user.id,
        name: session.user.name || "User",
        role: session.user.role,
      },
      reads: [],
    };

    setChat((prev) =>
      prev ? { ...prev, messages: [...prev.messages, optimistic] } : prev
    );

    const form = new FormData();
    form.append("file", audioPreview);

    setUploading(true);
    setUploadProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/chat/upload-audio");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = async () => {
      setUploading(false);

      try {
        const { url } = JSON.parse(xhr.responseText);

        await fetch("/api/direct-chat/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: chat.id,
            content: "",
            audioUrl: url,
          }),
        });
      } finally {
        cancelAudioPreview();
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      cancelAudioPreview();
    };

    xhr.send(form);
  }

  useEffect(() => {
    if (!chat?.id || status !== "authenticated") return;

    const pusher = getPusherClient();
    const channelName = `direct-${chat.id}`;
    const channel = pusher.subscribe(channelName);

    channel.bind("new-message", (msg: Message) => {
      setChat((prev) =>
        prev && !prev.messages.some((m) => m.id === msg.id)
          ? {
              ...prev,
              messages: [
                ...prev.messages.filter(
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
          : prev
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
      pusher.unsubscribe(channelName);
    };
  }, [chat?.id, status, session?.user.id]);

  useEffect(() => {
    if (status === "authenticated") loadChat();
  }, [status, conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages, typingUser]);

  useEffect(() => {
    return () => {
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
      if (selectedFilePreview) URL.revokeObjectURL(selectedFilePreview);
    };
  }, [audioPreviewUrl, selectedFilePreview]);

  if (loading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-6">
        <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-5 w-40 rounded bg-slate-200" />
            <div className="h-24 rounded-3xl bg-slate-100" />
            <div className="h-24 rounded-3xl bg-slate-100" />
            <div className="h-12 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
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
    <div className="h-[100dvh] max-w-full overflow-hidden bg-gradient-to-br from-slate-100 via-white to-indigo-50 p-2 sm:p-3 md:p-5">
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.10)] sm:rounded-[32px]">
        <div className="border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-600 text-sm font-bold text-white shadow-sm">
                {getInitials(otherUser?.name || "DM")}
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold text-slate-900 md:text-xl">
                  {otherUser?.name || "Direct Conversation"}
                </h1>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {otherUser?.role ? (
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getRoleBadgeStyle(
                        otherUser.role
                      )}`}
                    >
                      {formatRole(otherUser.role)}
                    </span>
                  ) : null}

                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Private chat
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 sm:block">
              {sortedMessages.length} message
              {sortedMessages.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>

        {(recording || uploading || typingUser) && (
          <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 md:px-6">
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
                  {typingUser} is typing...
                </div>
              )}
            </div>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_28%),linear-gradient(to_bottom,rgba(248,250,252,0.95),rgba(255,255,255,1))] px-3 py-4 md:px-6 md:py-6">
          <div className="mx-auto flex max-w-4xl flex-col gap-4">
            {sortedMessages.length === 0 ? (
              <div className="flex flex-1 items-center justify-center py-20">
                <div className="max-w-sm text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 text-4xl">
                    📨
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Start the conversation
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Send a private message to keep the work moving.
                  </p>
                </div>
              </div>
            ) : (
              sortedMessages.map((msg) =>
                msg.isSystem ? (
                  <div key={msg.id} className="flex justify-center">
                    <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-center text-xs font-medium text-slate-500 shadow-sm">
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
                    <div className="max-w-[88%] md:max-w-[72%]">
                      <div
                        className={`rounded-[26px] px-4 py-3 shadow-sm ring-1 ${
                          msg.sender.id === session?.user.id
                            ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white ring-indigo-500"
                            : "bg-white text-slate-900 ring-slate-200"
                        }`}
                      >
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <p
                            className={`text-xs font-bold ${
                              msg.sender.id === session?.user.id
                                ? "text-indigo-100"
                                : "text-slate-700"
                            }`}
                          >
                            {msg.sender.name}
                          </p>

                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                              msg.sender.id === session?.user.id
                                ? "border-white/15 bg-white/15 text-white"
                                : getRoleBadgeStyle(msg.sender.role)
                            }`}
                          >
                            {formatRole(msg.sender.role)}
                          </span>
                        </div>

                        {msg.content && (
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

                        {msg.audioUrl && (
                          <div className="mt-3 space-y-3">
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
                        )}

                        {msg.fileUrl && (
                          <div className="mt-3">
                            {msg.fileType?.startsWith("image") ? (
                              <a href={msg.fileUrl} target="_blank">
                                <img
                                  src={msg.fileUrl}
                                  alt={msg.fileName || "Uploaded image"}
                                  className="max-h-72 max-w-full rounded-2xl border border-white/20 object-cover"
                                />
                              </a>
                            ) : msg.fileType?.startsWith("video") ? (
                              <video
                                controls
                                src={msg.fileUrl}
                                className="max-h-72 max-w-full rounded-2xl"
                              />
                            ) : (
                              <a
                                href={msg.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={`flex max-w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                                  msg.sender.id === session?.user.id
                                    ? "border-white/20 bg-white/10 text-white"
                                    : "border-slate-200 bg-slate-50 text-slate-700"
                                }`}
                              >
                                <span className="text-xl">📎</span>
                                <span className="min-w-0">
                                  <span className="block truncate">
                                    {msg.fileName || "Open file"}
                                  </span>
                                  <span className="block text-xs opacity-70">
                                    {formatFileSize(msg.fileSize)}
                                  </span>
                                </span>
                              </a>
                            )}
                          </div>
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

        <div className="border-t border-slate-200 bg-white px-3 py-3 md:px-6 md:py-4">
          {selectedFile && (
            <div className="mx-auto mb-3 max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex items-center gap-3">
                  {selectedFilePreview &&
                  selectedFile.type.startsWith("image/") ? (
                    <img
                      src={selectedFilePreview}
                      alt={selectedFile.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  ) : selectedFilePreview &&
                    selectedFile.type.startsWith("video/") ? (
                    <video
                      src={selectedFilePreview}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-2xl">
                      📎
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeSelectedFile}
                  className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {audioPreview && audioPreviewUrl && (
            <div className="mx-auto mb-3 flex max-w-4xl flex-col gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-3 sm:flex-row sm:items-center sm:justify-between">
              <audio controls src={audioPreviewUrl} className="w-full sm:w-72" />

              <div className="flex gap-2">
                <button
                  onClick={cancelAudioPreview}
                  type="button"
                  className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Cancel
                </button>

                <button
                  onClick={sendAudioPreview}
                  type="button"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Send Audio
                </button>
              </div>
            </div>
          )}

          <div className="mx-auto flex max-w-4xl flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-[24px] border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
              <input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);

                  const now = Date.now();

                  if (chat && now - lastTypingRef.current > 1000) {
                    lastTypingRef.current = now;

                    fetch("/api/direct-chat/typing", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ conversationId: chat.id }),
                    });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                placeholder="Type your message..."
              />

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg text-slate-600 hover:bg-slate-200"
                title="Attach file"
                type="button"
              >
                📎
              </button>
            </div>

            <div className="grid grid-cols-[48px_1fr] gap-2 sm:flex sm:shrink-0 sm:gap-3">
              <button
                onMouseDown={startRecording}
                onMouseUp={handleRecordingRelease}
                onTouchStart={startRecording}
                onTouchEnd={handleRecordingRelease}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-lg shadow-sm transition ${
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
                disabled={!canSendMessage || uploading}
                type="button"
              >
                {uploading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}