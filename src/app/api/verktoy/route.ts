import { Post, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { verktoyEditSchema, verktoyPostSchema } from "./schema";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/auth-options";
import { prisma } from "@/app/lib/prisma";
import { getToken } from "next-auth/jwt";

export type verktoyGET = {
  posts: (Post & {
    user: {
      id: User["id"];
      name: User["name"];
    };
  })[];
  postsLength: number;
  nextCursor?: number;
};

export const POST = async (req: NextRequest) => {
  let jsonBody = await req.json();
  let validator = verktoyPostSchema.safeParse(jsonBody);
  const session = await getServerSession(authOptions);

  if (!validator.success)
    return NextResponse.json({ error: validator.error }, { status: 400 });
  if (!session?.user?.id)
    return NextResponse.json(
      { error: "ikke logget inn eller ikke rettigheter" },
      { status: 401 },
    );

  let { data } = validator;
  console.log(data);
  const res = await prisma.post.create({
    data: {
      type: data.type,
      name: data.name,
      extraEquipment: data.extraEquipment,
      operation: data.operation,
      storageSpace: data.storageSpace,
      datePurchased: new Date(data.datePurchased),
      imageId: data.fileId,
      userId: session?.user?.id,
    },
  });

  return NextResponse.json({ data: res }, { status: 200 });
};

export async function GET(req: NextRequest) {
  const url = new URL(req.nextUrl);
  const params = url.searchParams;
  let pageSize = parseInt(params.get("pageSize") || "2");
  let skip = parseInt(params.get("skip") || "0");
  let userId = params.get("userId");
  const postsLength = await prisma.post.count();
  const posts = await prisma.post.findMany({
    skip: skip,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },

    include: {
      user: {
        select: {
          name: true,
          id: true,
        },
      },
      Image: {},
    },
  });
  let nextCursor: number | undefined = skip + pageSize;
  if (nextCursor > postsLength) {
    nextCursor = undefined;
  }

  return NextResponse.json({
    posts,
    postsLength,
    nextCursor: nextCursor,
  });
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.nextUrl);
  const params = url.searchParams;
  let postId = params.get("postId");

  const secret = process.env.SECRET;
  const token = await getToken({ req, secret });
  const whitelisted = token?.whitelisted;

  if (!postId)
    return NextResponse.json({ error: "no postId" }, { status: 400 });

  if (whitelisted === !true) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  const comment = await prisma.comment.deleteMany({
    where: {
      postId: postId,
    },
  });
  const post = await prisma.post.deleteMany({
    where: {
      id: postId,
    },
  });

  return NextResponse.json({ comment, post });
}

export const PATCH = async (req: NextRequest) => {
  let jsonBody = await req.json();
  let validator = verktoyEditSchema.safeParse(jsonBody);
  const session = await getServerSession(authOptions);

  if (!validator.success)
    return NextResponse.json({ error: validator.error }, { status: 400 });
  if (!session?.user?.id)
    return NextResponse.json(
      { error: "ikke logget inn eller ikke rettigheter" },
      { status: 401 },
    );

  let { data } = validator;
  console.log(data);
  const res = await prisma.post.update({
    where: {
      id: data.postId,
    },
    data: {
      type: data.type,
      name: data.name,
      extraEquipment: data.extraEquipment,
      operation: data.operation,
      storageSpace: data.storageSpace,
      datePurchased: new Date(data.datePurchased),
      imageId: data.fileId,
      userId: session?.user?.id,
    },
  });

  return NextResponse.json({ data: res }, { status: 200 });
};
