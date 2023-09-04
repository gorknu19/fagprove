import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { UUID, randomUUID } from "crypto";

import fs from "fs";
import { prisma } from "@/app/lib/prisma";

// export const POST = async (req: NextRequest) => {
//   const data = await req.formData();
//   const file: File | null = data.get("file") as unknown as File;

//   if (!file) {
//     return NextResponse.json({ success: false }, { status: 400 });
//   }

//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);

//   let uniqueId = randomUUID();

//   const path = `C:\\verktoy-filer\\${uniqueId}`;

//   let imageDataDB = await prisma.image.create({
//     data: {
//       path,
//       filename: file.name,
//       imageId: uniqueId,
//     },
//   });

//   await writeFile(path, buffer);
//   console.log(`open ${path} to see the uploaded file`);

//   return NextResponse.json({ imageDataDB });
// };

export const GET = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) => {
  const image = await prisma.image.findFirst({
    where: {
      id,
    },
  });

  if (!image?.path)
    return NextResponse.json({ error: "no image found" }, { status: 400 });

  let stream = fs.createReadStream(image?.path);
  return new NextResponse(stream as any);
  console.log(image);
};
