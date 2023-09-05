import axios from "axios";
import { SerializedStateDates } from "@/app/types/generic";
import { verktoyGET } from "../api/verktoy/route";
import { Post } from "@prisma/client";

interface GetPostsParams {
  skip?: number;
  pageSize?: number;
}

interface createPostsParams {
  type: string;
  name: string;
  datePurchased: string;
  operation: string;
  storageSpace: string;
  extraEquipment: string;
  fileId: string;
}
interface EditPostsParams extends createPostsParams {
  postId: string;
}

export const getPosts = async ({ pageSize, skip }: GetPostsParams) => {
  let res = await axios.get<SerializedStateDates<verktoyGET>>("/api/verktoy", {
    params: {
      skip,
      pageSize,
    },
  });

  return res.data;
};

export const createPost = async (data: createPostsParams) => {
  let res = await axios.post("/api/verktoy", data);

  return res.data;
};

export const deletePost = async (postId: string) => {
  console.log(postId);
  let res = await axios.delete(`/api/verktoy`, {
    params: {
      postId: postId,
    },
  });

  return res.data;
};
export const editPost = async (data: EditPostsParams) => {
  let res = await axios.patch("/api/verktoy", data);

  return res.data;
};
