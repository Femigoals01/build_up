

// "use client";

// import { useEffect, useRef } from "react";

// export default function AudioWaveform({ src }: { src: string }) {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const audio = new Audio(src);
//     const ctx = canvas.getContext("2d")!;
//     const audioCtx = new AudioContext();
//     const analyser = audioCtx.createAnalyser();
//     const source = audioCtx.createMediaElementSource(audio);

//     source.connect(analyser);
//     analyser.connect(audioCtx.destination);

//     analyser.fftSize = 256;
//     const bufferLength = analyser.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength);

//     function draw() {
//       requestAnimationFrame(draw);

//       analyser.getByteFrequencyData(dataArray);

//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       const barWidth = (canvas.width / bufferLength) * 2;
//       let x = 0;

//       for (let i = 0; i < bufferLength; i++) {
//         const barHeight = dataArray[i] / 2;
//         ctx.fillStyle = "#6366f1";
//         ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
//         x += barWidth + 1;
//       }
//     }

//     draw();
//   }, [src]);

//   return <canvas ref={canvasRef} width={200} height={50} />;
// }


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
