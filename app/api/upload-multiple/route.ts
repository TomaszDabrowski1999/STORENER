import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/lib/admin-session";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Nie przesłano żadnych plików" },
        { status: 400 }
      );
    }

    const validFiles = files.filter(
      (file) => file instanceof File && file.size > 0
    );

    if (validFiles.length === 0) {
      return NextResponse.json(
        { error: "Nie przesłano prawidłowych plików" },
        { status: 400 }
      );
    }

    if (validFiles.length > 12) {
      return NextResponse.json(
        { error: "Możesz przesłać maksymalnie 12 zdjęć" },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of validFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "produkty",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      if (result?.secure_url) {
        uploadedUrls.push(result.secure_url);
      }
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error("UPLOAD MULTIPLE CLOUDINARY ERROR:", error);

    return NextResponse.json(
      { error: "Nie udało się przesłać zdjęć do Cloudinary" },
      { status: 500 }
    );
  }
}