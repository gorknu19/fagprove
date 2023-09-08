import axios from "axios";
import { SerializedStateDates } from "@/app/types/generic";
import { verktoyGET } from "../api/verktoy/route";
import { Post } from "@prisma/client";

//typer for å hente posts
interface GetPostsParams {
  skip?: number;
  pageSize?: number;
}

//typer for å lage post
interface createPostsParams {
  type: string;
  name: string;
  datePurchased: string;
  operation: string;
  storageSpace: string;
  extraEquipment: string;
  fileId: string;
}

//extending av lage post typer for å få den til å passe edit
interface EditPostsParams extends createPostsParams {
  postId: string;
}
// api call til å hent posts
export const getPosts = async ({ pageSize, skip }: GetPostsParams) => {
  let res = await axios.get<SerializedStateDates<verktoyGET>>("/api/verktoy", {
    params: {
      skip,
      pageSize,
    },
  });

  return res.data;
};

//api call til å lage posts
export const createPost = async (data: createPostsParams) => {
  let res = await axios.post("/api/verktoy", data);

  return res.data;
};

// api call til å delete posts
export const deletePost = async (postId: string) => {
  console.log(postId);
  let res = await axios.delete(`/api/verktoy`, {
    params: {
      postId: postId,
    },
  });

  return res.data;
};

// api call til å edit posts
export const editPost = async (data: EditPostsParams) => {
  let res = await axios.patch("/api/verktoy", data);

  return res.data;
};
