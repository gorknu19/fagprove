import React, { useState } from "react";
import Image from "next/image";
import { Post } from "@prisma/client";
import ToolModal from "./verktoy.modal";
import { Comments } from "./comments";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../services/verktoy.post.service";
import { EditToolModal } from "./EditToolModal";

interface ToolcardProps {
  verktoy: Post;
}

const ToolCard = ({ verktoy }: ToolcardProps) => {
  const [showTool, setShowTool] = useState<boolean>(false);
  const [showEditTool, setShowEditTool] = useState<boolean>(false);
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();

  function clickModal() {
    setShowTool(!showTool);
  }
  function clickEditModal() {
    setShowEditTool(!showEditTool);
  }
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
          {session?.user?.id && (
            <div className="mt-2">
              <button
                className="px-2 py-1 bg-red-600 text-white rounded-md m-2"
                onClick={async (e) => {
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
        <EditToolModal verktoy={verktoy} clickModal={clickEditModal} />
      )}
      {showTool && <ToolModal verktoy={verktoy} clickModal={clickModal} />}
    </>
  );
};

export default ToolCard;
