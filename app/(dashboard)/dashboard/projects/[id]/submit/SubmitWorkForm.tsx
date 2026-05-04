




"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SubmitWorkForm({
  projectId,
  previousRejected = false,
}: {
  projectId: string;
  previousRejected?: boolean;
}) {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [workUrl, setWorkUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!message.trim() && !workUrl.trim() && !fileUrl.trim() && !file) {
      setError("Please add a message, work link, proof file URL, or upload a file.");
      return;
    }

    try {
      setLoading(true);

      let uploadedFileUrl = fileUrl.trim();

      if (file) {
        setUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload/submission-file", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json().catch(() => null);

        if (!uploadRes.ok) {
          setError(uploadData?.error || "File upload failed.");
          return;
        }

        uploadedFileUrl = uploadData?.url || "";
      }

      const res = await fetch("/api/submissions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          message: message.trim(),
          workUrl: workUrl.trim(),
          fileUrl: uploadedFileUrl,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Failed to submit work.");
        return;
      }

      router.push("/dashboard/volunteer");
      router.refresh();
    } catch (error) {
      console.error("Submit work error:", error);
      setError("Something went wrong while submitting your work.");
    } finally {
      setUploading(false);
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];

    if (!selected) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(selected.type)) {
      setError("Only JPG, PNG, WEBP, and PDF files are allowed.");
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (selected.size > maxSize) {
      setError("File must be 10MB or less.");
      return;
    }

    setError("");
    setFile(selected);
    setFileUrl("");
    setPreviewUrl(URL.createObjectURL(selected));
  }

  function removeFile() {
    setFile(null);
    setPreviewUrl("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Work Delivery
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Submit completed work
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {previousRejected
            ? "Revision was requested. Submit your improved work for another review."
            : "Share your completed work with the organization for review."}
        </p>
      </div>

      {previousRejected ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Revision requested. Please submit an improved version.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Submission Message
        </label>

        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Explain what you completed, what changed, and anything the organization should review..."
          className="min-h-[150px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <div>
        <label
          htmlFor="workUrl"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Work Link
        </label>

        <input
          id="workUrl"
          type="url"
          value={workUrl}
          onChange={(e) => setWorkUrl(e.target.value)}
          placeholder="https://github.com/your-work or https://live-demo.com"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <label
          htmlFor="proofFile"
          className="block text-sm font-semibold text-slate-800"
        >
          Upload Proof File
        </label>

        <p className="mt-1 text-sm text-slate-500">
          Upload an image or PDF as proof of delivery. Max size: 10MB.
        </p>

        <input
          id="proofFile"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf"
          onChange={handleFileChange}
          className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
        />

        {file ? (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {file.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)}MB •{" "}
                  {file.type === "application/pdf" ? "PDF" : "Image"}
                </p>
              </div>

              <button
                type="button"
                onClick={removeFile}
                className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Remove
              </button>
            </div>

            {previewUrl && file.type.startsWith("image/") ? (
              <img
                src={previewUrl}
                alt="Submission preview"
                className="mt-4 max-h-56 w-full rounded-2xl border border-slate-200 object-cover"
              />
            ) : previewUrl && file.type === "application/pdf" ? (
              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm font-semibold text-blue-700">
                📄 PDF selected and ready to upload.
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="fileUrl"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Proof File URL
        </label>

        <input
          id="fileUrl"
          type="url"
          value={fileUrl}
          disabled={Boolean(file)}
          onChange={(e) => setFileUrl(e.target.value)}
          placeholder="Optional: Cloudinary, Drive, document, image, or proof link"
          className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
        />

        {file ? (
          <p className="mt-2 text-xs text-slate-500">
            File URL is disabled because you selected a file to upload.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? uploading
              ? "Uploading file..."
              : "Submitting..."
            : "Submit Work"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/dashboard/volunteer")}
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}