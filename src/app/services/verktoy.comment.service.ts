import axios from "axios";
import { verktoyCommentSchemaType } from "../api/verktoy/comments/schema";
import { commentGET } from "../api/verktoy/comments/route";

type CreateCommentParams = verktoyCommentSchemaType;
export type verktoyComment = {
  comment: Comment;
};

export const createComment = async ({
  content,
  postId,
}: CreateCommentParams) => {
  const res = await axios.post<verktoyComment>("/api/verktoy/comments", {
    content,
    postId,
  });
};

interface GetCommentsParams {
  postId: string;
}
interface deleteCommentsParams {
  commentId: string;
}

export const getComments = async ({ postId }: GetCommentsParams) => {
  console.log(postId);
  let res = await axios.get<commentGET>(`/api/verktoy/comments`, {
    params: {
      postId: postId,
    },
  });

  return res.data;
};

export const deleteComment = async (commentId: deleteCommentsParams) => {
  console.log(commentId);
  let res = await axios.delete(`/api/verktoy/comments`, {
    params: {
      commentId: commentId,
    },
  });

  return res.data;
};
