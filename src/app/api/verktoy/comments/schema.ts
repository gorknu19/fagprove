import { z } from "zod";

export const verktoyCommentSchema = z.object({
  postId: z.string(),
  content: z.string().min(10),
});

export type verktoyCommentSchemaType = z.infer<typeof verktoyCommentSchema>;
