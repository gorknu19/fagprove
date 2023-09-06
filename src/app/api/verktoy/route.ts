import { Post, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { verktoyEditSchema, verktoyPostSchema } from "./schema";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/auth-options";
import { prisma } from "@/app/lib/prisma";
import { getToken } from "next-auth/jwt";

// typer for henting av posts
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

//laging av posts
export const POST = async (req: NextRequest) => {
  // henter og validerer data til POST schema som er i schema fil
  let jsonBody = await req.json();
  let validator = verktoyPostSchema.safeParse(jsonBody);

  // henter whitelisted data fra server session
  const session = await getServerSession(authOptions);
  const whitelisted = session?.user?.whitelisted;

  //sjekker om du har admin rettigheter til å lage posts
  if (whitelisted === !true) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  // sjekker om data ikke kom forbi validering og om mann i det heletatt er logget inn
  if (!validator.success)
    return NextResponse.json({ error: validator.error }, { status: 400 });
  if (!session?.user?.id)
    return NextResponse.json(
      { error: "ikke logget inn eller ikke rettigheter" },
      { status: 401 },
    );

  // henter data fra validator

  let { data } = validator;
  console.log(data);
  // lager posts med data som ble hentet
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
  // returnerer dataen om nye posten
  return NextResponse.json({ data: res }, { status: 200 });
};

export async function GET(req: NextRequest) {
  // henting av data senndt fra bruker
  const url = new URL(req.nextUrl);
  const params = url.searchParams;
  let pageSize = parseInt(params.get("pageSize") || "2");
  let skip = parseInt(params.get("skip") || "0");
  let userId = params.get("userId");

  // teller mengden posts
  const postsLength = await prisma.post.count();

  // henter posts der den skipper de som har blitt hentet allerede og henter ut kor mange jeg har sagt skall hentes ut hver gang
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

  // forteller på hvilken post jeg er og når flere må hentes og hvis jeg har nått at alle er blitt tatt resetes nextcursor for å stoppe at mer data blir forsøkt hentet
  let nextCursor: number | undefined = skip + pageSize;
  if (nextCursor > postsLength) {
    nextCursor = undefined;
  }

  // sender tilbake all dataen om hvor mange posts totalt, hvor mange som er hentet og alle post som ble hentet
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

  const session = await getServerSession(authOptions);
  const whitelisted = session?.user?.whitelisted;

  if (whitelisted === !true) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  if (!postId)
    return NextResponse.json({ error: "no postId" }, { status: 400 });

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
  // henting av data
  let jsonBody = await req.json();
  const session = await getServerSession(authOptions);
  const whitelisted = session?.user?.whitelisted;

  //sjekker whitelist
  if (whitelisted === !true) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }

  // validerer om dataen er rett og passer
  let validator = verktoyEditSchema.safeParse(jsonBody);
  if (!validator.success)
    return NextResponse.json({ error: validator.error }, { status: 400 });

  // sjekker om mann er logget inn
  if (!session?.user?.id)
    return NextResponse.json(
      { error: "ikke logget inn eller ikke rettigheter" },
      { status: 401 },
    );
  // henter data fra valideringen
  let { data } = validator;
  console.log(data);

  // oppdaterer post med bruk at post id og sender inn ny data
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

  // sender tilbake responsen for patchen
  return NextResponse.json({ data: res }, { status: 200 });
};
