import { NextRequest, NextResponse } from 'next/server';

import fs from 'fs';
import { prisma } from '@/app/lib/prisma';

// henting av bilde
export const GET = async (
  req: NextRequest,
  { params: { id } }: { params: { id: string } },
) => {
  //image data blir hentet
  const image = await prisma.image.findFirst({
    where: {
      id,
    },
  });

  // hvis bilde path ikke blir funnet returner error med "no image found"
  if (!image?.path)
    return NextResponse.json({ error: 'no image found' }, { status: 400 });

  // hvis bilde path blir funnet les bilde og send bildet til siden
  let stream = fs.createReadStream(image?.path);
  return new NextResponse(stream as any);
};
