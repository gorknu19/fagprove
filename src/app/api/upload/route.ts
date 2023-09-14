import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { UUID, randomUUID } from 'crypto';
import { prisma } from '@/app/lib/prisma';

//opplasting av bilde
export const POST = async (req: NextRequest) => {
  // data blir satt
  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  //error hvis det ikke er fil
  if (!file) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  //sjekke om filen som er opplastet er bilde
  const fileType = file['type'];
  if (!fileType.startsWith('image')) {
    return NextResponse.json(
      { error: 'this is not an image file' },
      { status: 400 },
    );
  }

  // henter buffer og bytes data
  const bytes = await file.arrayBuffer();

  //sjekk om filen er for stor
  if (bytes.byteLength > 10 * 1000000)
    return NextResponse.json({ error: 'File is too big' }, { status: 400 });

  const buffer = Buffer.from(bytes);

  // lager unik id
  let uniqueId = randomUUID();

  // settter path med id
  const path = `C:\\verktoy-filer\\${uniqueId}`;

  //lagrer info om bildet på database
  let imageDataDB = await prisma.image.create({
    data: {
      path,
      filename: file.name,
      imageId: uniqueId,
    },
  });

  // skriver fil til lagringsplass
  await writeFile(path, buffer);
  console.log(`open ${path} to see the uploaded file`);

  return NextResponse.json({ imageDataDB });
};
