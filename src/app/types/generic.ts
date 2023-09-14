// type for å serialize dates
export type SerializedStateDates<T> = Omit<
  T,
  'deletedAt' | 'publishedAt' | 'createdAt' | 'updatedAt' | 'datePurchased'
> & {
  publishedAt: string;
  datePurchased: string;
  createdAt: string;
  updatedAt: string;
};

// export type DateTimeToStringRecursive<T> = {
//   [K in keyof T]: T[K] extends Date
//     ? string
//     : T[K] extends object
//     ? DateTimeToStringRecursive<T[K]>
//     : T[K];
// };
