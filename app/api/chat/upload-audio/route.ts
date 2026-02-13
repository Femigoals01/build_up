


// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { writeFile, mkdir } from "fs/promises";
// import path from "path";
// import crypto from "crypto";

// export async function POST(req: Request) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }



//     const formData = await req.formData();

// console.log("FORM DATA ENTRIES:");
// for (const [key, value] of formData.entries()) {
//   console.log(key, value);
// }
//     const file = formData.get("file") as File | null;

    

//     if (!file) {
//       return NextResponse.json({ error: "No file received" }, { status: 400 });
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());

//     const filename = `${crypto.randomUUID()}.webm`;

//     const uploadDir = path.join(
//       process.cwd(),
//       "public",
//       "uploads"
//     );

//     // ✅ CRITICAL FIX — ensure folder exists
//     await mkdir(uploadDir, { recursive: true });

//     const filePath = path.join(uploadDir, filename);

//     await writeFile(filePath, buffer);

//     return NextResponse.json({
//       url: `/uploads/${filename}`,
//     });
//   } catch (error) {
//     console.error("AUDIO UPLOAD ERROR:", error);
//     return NextResponse.json(
//       { error: "Failed to upload audio" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const upload = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "video", // audio is treated as video
        folder: "chat-audio",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });

  return NextResponse.json({ url: upload.secure_url });
}
