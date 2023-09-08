"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { NewPostModal } from "@/app/components/modal-new-post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { getPosts } from "./services/verktoy.post.service";
import ToolCard from "./components/verktoy.card";

function Forum() {
  // ref og inview for å trigger henting av flere posts, session data og state for å vise modal for å lage post,
  const { ref, inView } = useInView();
  const { data: session, status: sessionStatus } = useSession();
  const [createPostModal, setCreatePostModal] = useState<boolean>(false);

  //use infinite query som henter ut dataen fra databasen og hjelper hpndtere det å hente nye posts når det trengs
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["verktoy"],
    queryFn: ({ pageParam = 0 }) =>
      //posts blir hentet med størrelse av 5 som blir hentet hver gang
      getPosts({
        skip: pageParam,
        pageSize: 5,
      }),
    // params for å hente flere sider
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  // hvis inview vises hentes flere posts
  React.useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  // modal toggling
  function clickModal() {
    setCreatePostModal(!createPostModal);
  }

  return (
    <>
      <div className="flex justify-center align-middle">
        <div className="text-center">
          <h1 className={`text-center font-bold text-lg m-5 `}>
            Velkommen til verktøy kassa {session?.user?.name}
          </h1>
          {/* // hvis mann er admin kan man se create new post */}
          {session?.user?.whitelisted === true && (
            <button
              onClick={clickModal}
              className={` text-gray-300 bg-gray-700 hover:bg-gray-800 hover:text-white rounded-md px-3 py-2 text-sm font-medium`}
            >
              Legg inn verktøy
            </button>
          )}
          <div className="flex flex-wrap p-5  mt-10">
            {/* data blir mappa ut i tool cards */}
            {data &&
              data.pages.map((page) => {
                return page.posts.map((verktoy) => {
                  return <ToolCard verktoy={verktoy} key={verktoy.id} />;
                });
              })}
          </div>
          {/* kode som henter ny data hvis man scroller ned til den, eller trykker hent flere */}
          {data && (
            <button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              ref={ref}
            >
              {isFetchingNextPage
                ? "Henter flere..."
                : hasNextPage
                ? "Hent flere"
                : "Ingen mer å hente"}
            </button>
          )}
        </div>
      </div>
      {/* modal for visning av new post */}
      {createPostModal && <NewPostModal clickModal={clickModal} />}
    </>
  );
}

export default Forum;
