import { z } from "zod";

// skjema for zod håndtering til å lage nye verktøy
export const verktoyPostSchema = z.object({
  fileId: z.string(),
  type: z
    .string()
    .min(5)
    .transform((type) => {
      return type.trim();
    }),
  name: z
    .string()
    .min(5)
    .transform((title) => {
      return title.trim();
    }),
  datePurchased: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "not a valid date!"),
  operation: z
    .string()
    .min(5)
    .transform((operation) => {
      return operation.trim();
    }),
  storageSpace: z
    .string()
    .min(5)
    .transform((title) => {
      return title.trim();
    }),
  extraEquipment: z
    .string()
    .min(10)
    .transform((content) => {
      return content.trim();
    }),
});

// skjema for zod håndtering til å endre verktøy data
export const verktoyEditSchema = z.object({
  fileId: z.string(),
  postId: z.string(),
  type: z
    .string()
    .min(5)
    .transform((type) => {
      return type.trim();
    }),
  name: z
    .string()
    .min(5)
    .transform((title) => {
      return title.trim();
    }),
  datePurchased: z.string(),
  operation: z
    .string()
    .min(5)
    .transform((operation) => {
      return operation.trim();
    }),
  storageSpace: z
    .string()
    .min(5)
    .transform((title) => {
      return title.trim();
    }),
  extraEquipment: z
    .string()
    .min(10)
    .transform((content) => {
      return content.trim();
    }),
});

//exporting av typene som blir laget av zod schema
export type verktoyPostSchemaType = z.infer<typeof verktoyPostSchema>;
export type verktoyEditSchemaType = z.infer<typeof verktoyEditSchema>;
