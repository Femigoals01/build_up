




import { useEffect, useRef, useState } from "react";

export function useAudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /* ================= START ================= */

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      // ✅ COMPRESSED AUDIO (64kbps)
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
        audioBitsPerSecond: 64000,
      });

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      setDuration(0);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.start();
      setRecording(true);

      // 📱 VIBRATION ON START
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      // ⏱ Duration counter
      intervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Mic error:", error);
    }
  }

  /* ================= STOP ================= */

  function stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;

      if (!recorder) {
        resolve(null);
        return;
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        setRecording(false);
        setDuration(0);

        if (intervalRef.current) clearInterval(intervalRef.current);

        // Stop mic stream
        streamRef.current?.getTracks().forEach((track) =>
          track.stop()
        );

        // 📱 VIBRATION ON STOP
        if (navigator.vibrate) {
          navigator.vibrate([50, 50, 50]);
        }

        resolve(blob);
      };

      recorder.stop();
    });
  }

  return { recording, duration, startRecording, stopRecording };
}
