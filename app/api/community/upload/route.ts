

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
        { error: "Image file is required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WEBP images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image must not be larger than 5MB." },
        { status: 400 }
      );
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_UPLOAD_PRESET
    ) {
      return NextResponse.json(
        { error: "Image upload is not configured." },
        { status: 500 }
      );
    }

    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET);
    uploadData.append("folder", "buildup/community");

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const data = await uploadRes.json();

    if (!uploadRes.ok || !data.secure_url) {
      console.error("COMMUNITY IMAGE UPLOAD ERROR:", data);

      return NextResponse.json(
        { error: "Failed to upload image." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: data.secure_url,
    });
  } catch (error) {
    console.error("COMMUNITY UPLOAD API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to upload community image." },
      { status: 500 }
    );
  }
}