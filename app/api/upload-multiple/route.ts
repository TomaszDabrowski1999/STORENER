import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { requireAdmin } from "@/lib/admin-session";
import { validateImageFile, MAX_FILES } from "@/lib/upload-validation";
import { hit, getClientIp, tooManyRequests } from "@/lib/rate-limit";

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

  const ip = getClientIp(request);
  const limit = hit(`upload-multi:${ip}`, 20, 10 * 60 * 1000);

  if (!limit.ok) {
    return tooManyRequests(limit.retryAfterSeconds);
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files");

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Nie przesłano żadnych plików" },
        { status: 400 }
      );
    }

    // Limit sprawdzamy PRZED walidacją i wczytaniem plików do pamięci,
    // żeby 500 plików nie zostało najpierw zbuforowanych.
    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `Możesz przesłać maksymalnie ${MAX_FILES} zdjęć` },
        { status: 400 }
      );
    }

    const buffers: Buffer[] = [];

    for (const file of files) {
      const validation = await validateImageFile(file);

      // Zasada „wszystko albo nic" – przy błędnym pliku nie wysyłamy
      // niczego, żeby admin nie został z połową galerii w chmurze.
      if (!validation.ok) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      buffers.push(validation.buffer);
    }

    const uploadedUrls: string[] = [];

    for (const buffer of buffers) {
      const result = await new Promise<{ secure_url?: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "produkty", resource_type: "image" },
              (error, uploadResult) => {
                if (error) reject(error);
                else resolve(uploadResult as { secure_url?: string });
              }
            )
            .end(buffer);
        }
      );

      if (result?.secure_url) {
        uploadedUrls.push(result.secure_url);
      }
    }

    return NextResponse.json({ success: true, urls: uploadedUrls });
  } catch (error) {
    console.error("UPLOAD MULTIPLE CLOUDINARY ERROR:", error);

    return NextResponse.json(
      { error: "Nie udało się przesłać zdjęć" },
      { status: 500 }
    );
  }
}
