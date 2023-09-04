"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { NewPostModal } from "@/app/components/modal-new-post";
import { ToastContainer } from "react-toastify";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { getPosts } from "./services/verktoy.post.service";
import ToolCard from "./components/verktoy.card";
import { Post } from "@prisma/client";
import ToolModal from "./components/verktoy.modal";

function Forum() {
  const { ref, inView } = useInView();
  const { data: session, status: sessionStatus } = useSession();
  const [createPostModal, setCreatePostModal] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<Post | null>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["verktoy"],
    queryFn: ({ pageParam = 0 }) =>
      getPosts({
        skip: pageParam,
        pageSize: 5,
      }),
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  function clickModal() {
    setCreatePostModal(!createPostModal);
  }

  return (
    <>
      <div className="flex justify-center align-middle">
        <div className="text-center">
          <h1 className={`text-center font-bold text-lg m-5 `}>
            Welcome to the forum {session?.user?.name}
          </h1>
          {session?.user?.id && (
            <button
              onClick={clickModal}
              className={` text-gray-300 bg-gray-700 hover:bg-gray-800 hover:text-white rounded-md px-3 py-2 text-sm font-medium`}
            >
              Create post
            </button>
          )}
          <h1 className="font-bold"> Posts </h1>
          <div className="flex flex-wrap p-5">
            {data &&
              data.pages.map((page) => {
                return page.posts.map((verktoy) => {
                  return <ToolCard verktoy={verktoy} key={verktoy.id} />;
                });
              })}
          </div>
        </div>
      </div>

      {createPostModal && <NewPostModal clickModal={clickModal} />}
      <ToastContainer
        position={"top-right"}
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme={"dark"}
      />
    </>
  );
}

export default Forum;
