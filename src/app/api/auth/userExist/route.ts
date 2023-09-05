import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = (req: NextRequest) => {
  console.log("test");
  console.log("test");
  console.log("test");
  console.log("test");
  console.log("test");
  console.log("test");
  const url = new URL(req.nextUrl);
  const params = url.searchParams;
  let userId = params.get("userId");

  if (!userId)
    return NextResponse.json(
      { error: "user id finnes ikke " },
      { status: 400 },
    );

  const res = prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  return res;
};
