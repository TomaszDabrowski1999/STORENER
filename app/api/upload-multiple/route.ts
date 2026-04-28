import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of validFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const safeName = file.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9.\-_]/g, "");

      const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/${fileName}`);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (error) {
    console.error("UPLOAD MULTIPLE ERROR:", error);

    return NextResponse.json(
      { error: "Nie udało się przesłać zdjęć" },
      { status: 500 }
    );
  }
}