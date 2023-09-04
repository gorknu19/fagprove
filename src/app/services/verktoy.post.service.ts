import axios from "axios";
import { SerializedStateDates } from "@/app/types/generic";
import { verktoyGET } from "../api/verktoy/route";

interface GetPostsParams {
  skip?: number;
  pageSize?: number;
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
