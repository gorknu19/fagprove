import React, { useState } from "react";
import Image from "next/image";
import { Post } from "@prisma/client";
import ToolModal from "./verktoy.modal";
import { Comments } from "./comments";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../services/verktoy.post.service";
import { EditToolModal } from "./EditToolModal";

// typer for data som blir sendt inn til component
interface ToolcardProps {
  verktoy: Post;
}

const ToolCard = ({ verktoy }: ToolcardProps) => {
  //states for hvis tool modal ska vises eller edit tool modal så session data og queryclient
  const [showTool, setShowTool] = useState<boolean>(false);
  const [showEditTool, setShowEditTool] = useState<boolean>(false);
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  // håndterer om modaler har blitt klicket og "toggla" de
  function clickModal() {
    setShowTool(!showTool);
  }
  function clickEditModal() {
    setShowEditTool(!showEditTool);
  }
  // lager dato om til noe pent så det ikke ser dårlig ut på siden
  var formatedDate = verktoy.datePurchased.toString().slice(0, 10);

  return (
    <>
      <div
        className="bg-slate-500 text-white rounded-lg p-4 shadow-lg m-4 cursor-pointer "
        onClick={clickModal}
      >
        <div className="flex justify-center">
          <Image
            src={`/api/image/${verktoy.imageId}`}
            alt="verktoy"
            width={200}
            height={200}
            className="rounded-md"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold">{verktoy.type}</h3>
          <p>Type: {verktoy.name} </p>
          <p>Dato Kjøpt: {formatedDate}</p>

          {/* Hvis mann er admin så kan mann slette ( med confirmation ) og edit verktoy */}
          {session?.user?.whitelisted === true && (
            <div className="mt-2">
              <button
                className="px-2 py-1 bg-red-600 text-white rounded-md m-2"
                onClick={async (e) => {
                  //e.stopPropagation gjør at normale show modal tingen ikke skjer
                  e.stopPropagation();
                  var result = confirm(
                    `er du sikker du vil slette ${verktoy.type}?`,
                  );
                  if (result) {
                    await deletePost(verktoy.id);
                    queryClient.invalidateQueries(["verktoy"]);
                  }
                }}
              >
                Slett
              </button>
              <button
                className="px-2 py-1 bg-blue-600 text-white rounded-md"
                onClick={async (e) => {
                  //e.stopPropagation gjør at normale show modal tingen ikke skjer
                  e.stopPropagation();
                  clickEditModal();
                }}
              >
                Endre
              </button>
            </div>
          )}
        </div>
      </div>
      {showEditTool && (
        // hvis edit tool er trygt sender den verkoy data til modalen for redigerbg
        <EditToolModal verktoy={verktoy} clickModal={clickEditModal} />
      )}
      {showTool && (
        // hvis et verktly er valgt så viser den dataen i en modal, ved å sende verktoy dataen til modalen
        <ToolModal verktoy={verktoy} clickModal={clickModal} />
      )}
    </>
  );
};

export default ToolCard;
