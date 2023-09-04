export type SerializedStateDates<T> = Omit<
  T,
  "deletedAt" | "publishedAt" | "createdAt" | "updatedAt"
> & {
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};
