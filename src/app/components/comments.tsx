import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  verktoyCommentSchema,
  verktoyCommentSchemaType,
} from "../api/verktoy/comments/schema";
import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createComment,
  deleteComment,
  getComments,
} from "../services/verktoy.comment.service";

interface CommentsProps {
  postId: string;
}

export const Comments = ({ postId }: CommentsProps) => {
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  const { data, error, isFetching, status } = useQuery({
    queryKey: [postId],
    queryFn: () =>
      getComments({
        postId: postId,
      }),
  });

  console.log(data);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<verktoyCommentSchemaType>({
    resolver: zodResolver(verktoyCommentSchema),
    defaultValues: {
      postId: postId,
    },
  });
  const mutation = useMutation({
    mutationFn: (postData: verktoyCommentSchemaType) => {
      return createComment(postData);
    },
  });

  const onSubmit: SubmitHandler<verktoyCommentSchemaType> = async (data) => {
    await mutation.mutateAsync(data);
    queryClient.invalidateQueries([postId]);
  };

  return (
    <>
      <div className="mt-4">
        {session?.user?.id && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              className="w-4/5 border border-gray-300 rounded-full m-2 p-2 text-black"
              placeholder="Add a comment"
              {...register("content")}
            />
            {errors.content && (
              <span className="text-white block mt-2 bg-red-600 rounded-md p-2 ring-2 ring-red-700 ring-opacity-25">
                {errors.content?.message}
              </span>
            )}
            <button
              className="rounded-full bg-gray-800 p-2 inline-flex items-center justify-center"
              type="submit"
            >
              Legg Igjen Kommentar
            </button>
          </form>
        )}
      </div>
      {Array.isArray(data) &&
        data.map((comment) => {
          var formatedDate = comment.createdAt
            .toString()
            .slice(0, 19)
            .replace("T", " ");
          console.log(comment.id);
          return (
            <div key={comment.id} className="border-t pt-4 mt-4">
              <p className="">{comment.content}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm">{formatedDate}</p>

                {session?.user?.id && (
                  <div className="mt-2">
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded-md"
                      onClick={async () => {
                        console.log(comment.id);
                        await deleteComment(comment.id);
                        queryClient.invalidateQueries([postId]);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </>
  );
};
