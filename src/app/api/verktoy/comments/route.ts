import { getToken } from "next-auth/jwt";
import { verktoyCommentSchema } from "./schema";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Comment, User } from "@prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/auth-options";

// type definering for get funksjon
export type commentGET = {
  comment: Comment & {
    user: {
      id: User["id"];
      iname: User["name"];
    };
  };
};

//funkjson for å lage posts fra post request
export async function POST(req: NextRequest) {
  // data blir hentet
  const data = verktoyCommentSchema.parse(await req.json());

  //setting av session data og feilhåndtering hvis session ikke finnes for å stoppe folk uten bruker å lage comments
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: "not authenticated" }, { status: 401 });

  // laging av comment på databasen
  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      userId: session?.user?.id,
      postId: data.postId,
    },
  });

  // send data om comment tilbake siden den er lagt
  return NextResponse.json({ comment });
}

// henting av comments
export async function GET(req: NextRequest) {
  // henting av data og håndtering hvis postId ikke finnes
  const url = new URL(req.nextUrl);
  const params = url.searchParams;
  let postId = params.get("postId");
  if (!postId)
    return NextResponse.json({ error: "no post ID" }, { status: 400 });

  // hent comments for post med postID, og hent ut bruker data til den som lagde kommentaren
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

  // sender tilbake comments i reverse rekkefølge så de nyeste kommer på toppen
  return NextResponse.json(comment.reverse());
}

// sletting av kommentarer
export async function DELETE(req: NextRequest) {
  //henting av data
  const url = new URL(req.nextUrl);
  const params = url.searchParams;
  let commentId = params.get("commentId");

  // henting av whitelisted bolean variabel fra konto på server side
  const session = await getServerSession(authOptions);
  const whitelisted = session?.user?.whitelisted;

  // sjekker om mann har lov å skette ellers så skjer det ikke
  if (whitelisted === !true) {
    return NextResponse.json({ error: "not authorized" }, { status: 401 });
  }
  // sjekker om comment id faktisk finnes
  if (!commentId)
    return NextResponse.json({ error: "no commentId" }, { status: 400 });

  // sletter kommentar med commentId
  const comment = await prisma.comment.deleteMany({
    where: {
      id: commentId,
    },
  });

  // sender slettet kommentar data tilbake
  return NextResponse.json({ comment });
}
