import { getToken } from "next-auth/jwt";
import { verktoyCommentSchema } from "./schema";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Comment, User } from "@prisma/client";

export type commentGET = {
  comment: Comment & {
    user: {
      id: User["id"];
      iname: User["name"];
    };
  };
};

export async function POST(req: NextRequest) {
  const data = verktoyCommentSchema.parse(await req.json());

  const secret = process.env.SECRET;
  const token = await getToken({ req, secret });
  let userId = token?.id as string;

  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      userId: userId,
      postId: data.postId,
    },
  });
  console.log({ comment });

  return NextResponse.json({ comment });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.nextUrl);
  const params = url.searchParams;
  let postId = params.get("postId");
  if (!postId)
    return NextResponse.json({ error: "no post ID" }, { status: 400 });

  const comment = await prisma.comment.findMany({
    where: {
      postId: postId,
    },
    include: {
      user: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
  console.log(comment);
  return NextResponse.json(comment.reverse());
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.nextUrl);
  const params = url.searchParams;
  let commentId = params.get("commentId");

  const secret = process.env.SECRET;
  const token = await getToken({ req, secret });
  const whitelisted = token?.whitelisted;

  if (!commentId)
    return NextResponse.json({ error: "no commentId" }, { status: 400 });

  if (whitelisted === !true) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const comment = await prisma.comment.deleteMany({
    where: {
      id: commentId,
    },
  });
  return NextResponse.json({ comment });
}
