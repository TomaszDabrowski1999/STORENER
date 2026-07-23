import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-session";
import { v2 as cloudinary } from "cloudinary";
import { validateImageFile } from "@/lib/upload-validation";
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

  // Limit również dla admina – przejęte konto administratora nie powinno
  // móc w minutę wyczerpać limitu Cloudinary ani zapchać dysku.
  const ip = getClientIp(request);
  const limit = hit(`upload:${ip}`, 60, 10 * 60 * 1000);

  if (!limit.ok) {
    return tooManyRequests(limit.retryAfterSeconds);
  }

  try {
    const formData = await request.formData();
    const validation = await validateImageFile(formData.get("file"));

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const result = await new Promise<{ secure_url?: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "produkty",
            // resource_type: "image" wymusza po stronie Cloudinary
            // przetworzenie pliku jako obrazu – dodatkowa warstwa kontroli.
            resource_type: "image",
          },
          (err, res) => {
            if (err) reject(err);
            else resolve(res as { secure_url?: string });
          }
        )
        .end(validation.buffer);
    });

    if (!result?.secure_url) {
      return NextResponse.json(
        { error: "Nie udało się przesłać zdjęcia" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, imageUrl: result.secure_url });
  } catch (error) {
    // Surowy komunikat błędu może zdradzać konfigurację Cloudinary –
    // szczegóły trafiają wyłącznie do logów serwera.
    console.error("UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Nie udało się przesłać zdjęcia" },
      { status: 500 }
    );
  }
}
