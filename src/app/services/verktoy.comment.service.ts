import axios from "axios";
import { verktoyCommentSchemaType } from "../api/verktoy/comments/schema";
import { commentGET } from "../api/verktoy/comments/route";

// typer for api call til å lage comment
type CreateCommentParams = verktoyCommentSchemaType;
export type verktoyComment = {
  comment: Comment;
};

// api call til å lage comment
export const createComment = async ({
  content,
  postId,
}: CreateCommentParams) => {
  const res = await axios.post<verktoyComment>("/api/verktoy/comments", {
    content,
    postId,
  });
};

// get comment typer
interface GetCommentsParams {
  postId: string;
}

// api request for å hente comments
export const getComments = async ({ postId }: GetCommentsParams) => {
  let res = await axios.get<commentGET>(`/api/verktoy/comments`, {
    params: {
      postId: postId,
    },
  });

  return res.data;
};

// api request for å slette comments
export const deleteComment = async (commentId: string) => {
  console.log(commentId);
  let res = await axios.delete(`/api/verktoy/comments`, {
    params: {
      commentId: commentId,
    },
  });

  return res.data;
};
