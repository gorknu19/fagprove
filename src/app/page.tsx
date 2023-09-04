"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { NewPostModal } from "@/app/components/modal-new-post";
import { ToastContainer } from "react-toastify";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { getPosts } from "./services/verktoy.post.service";

function Forum() {
  const { ref, inView } = useInView();
  const { data: session, status: sessionStatus } = useSession();
  const [createPostModal, setCreatePostModal] = useState<boolean>(false);

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="w-2/3 text-center">
          <h1 className={`text-center font-bold text-lg m-5 `}>
            Welcome to the forum {session?.user?.name}
          </h1>

          <button
            onClick={clickModal}
            className={` text-gray-300 bg-gray-700 hover:bg-gray-800 hover:text-white rounded-md px-3 py-2 text-sm font-medium`}
          >
            Create post
          </button>
          <div className="bg-slate-800 mt-5">
            <h1 className="font-bold"> Posts </h1>
            {data &&
              data.pages.map((page) => {
                return page.posts.map((verktoy: any) => {
                  return (
                    <div key={verktoy.id}>
                      <h1>{verktoy.name}</h1>
                      <Image
                        src={`/api/image/${verktoy.imageId}`}
                        height={500}
                        width={500}
                        alt="post image"
                      />
                    </div>
                  );
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
