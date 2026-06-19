


import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 25 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Media file is required." },
        { status: 400 }
      );
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WEBP, MP4, WEBM, and MOV files are allowed." },
        { status: 400 }
      );
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image must not be larger than 5MB." },
        { status: 400 }
      );
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: "Video must not be larger than 25MB." },
        { status: 400 }
      );
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_UPLOAD_PRESET
    ) {
      return NextResponse.json(
        { error: "Media upload is not configured." },
        { status: 500 }
      );
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);
    uploadData.append("folder", "buildup/community-chat");

    const resourceType = isVideo ? "video" : "image";

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const data = await uploadRes.json();

    if (!uploadRes.ok || !data.secure_url) {
      console.error("COMMUNITY CHAT MEDIA UPLOAD ERROR:", data);

      return NextResponse.json(
        { error: "Failed to upload media." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mediaUrl: data.secure_url,
      mediaType: isVideo ? "VIDEO" : "IMAGE",
    });
  } catch (error) {
    console.error("COMMUNITY CHAT UPLOAD API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to upload chat media." },
      { status: 500 }
    );
  }
}