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

// typer for det som kommer inn til comment component
interface CommentsProps {
  postId: string;
}

export const Comments = ({ postId }: CommentsProps) => {
  // henteing av session data og sett query client
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  //henting av data med usequery
  const { data, error, isFetching, status } = useQuery({
    queryKey: [postId],
    queryFn: () =>
      getComments({
        postId: postId,
      }),
  });

  //usefomr som blir brukt for formen som sender inn data til å lage comment, som har resolver fra zod som validerer alt før den i det heletatt sender de
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

  // det som kjøres når formen går forbi validering
  const mutation = useMutation({
    mutationFn: (postData: verktoyCommentSchemaType) => {
      return createComment(postData);
    },
  });

  // funskjon som kjøres når form blir sendt inn der mutation går til query tingen og validerer data så invalidate postid som gjør at den henter post dataen igjen
  const onSubmit: SubmitHandler<verktoyCommentSchemaType> = async (data) => {
    await mutation.mutateAsync(data);
    queryClient.invalidateQueries([postId]);
  };

  return (
    <>
      <div className="mt-4">
        {/* sjekker om mann er logget inn for at lag comment form ska vises */}
        {session?.user && (
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
      {/* map av comments som blir hentet for å vise de fram */}
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
                {/* hvis mann har admin rettigheter så kan manns e slette og edit knapper */}
                {session?.user?.whitelisted === true && (
                  <div className="mt-2">
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded-md"
                      onClick={async () => {
                        console.log(comment.id);
                        await deleteComment(comment.id);
                        queryClient.invalidateQueries([postId]);
                      }}
                    >
                      slett
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
