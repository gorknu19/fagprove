import { z } from "zod";

// comment schema for laging av kommentar
export const verktoyCommentSchema = z.object({
  postId: z.string(),
  content: z.string().min(5).max(128),
});

// henter typer fra schema
export type verktoyCommentSchemaType = z.infer<typeof verktoyCommentSchema>;
