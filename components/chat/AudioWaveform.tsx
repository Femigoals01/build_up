



"use client";

import { useEffect, useRef } from "react";

export default function AudioWaveform({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 40; i++) {
      const height = Math.random() * 30;
      ctx.fillStyle = "#6366f1";
      ctx.fillRect(i * 4, 40 - height, 3, height);
    }
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      width={160}
      height={40}
      className="rounded-md"
    />
  );
}
