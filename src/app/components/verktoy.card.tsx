import React, { useState } from "react";
import Image from "next/image";
import { Post } from "@prisma/client";
import ToolModal from "./verktoy.modal";
import { Comments } from "./comments";

interface ToolcardProps {
  verktoy: Post;
}

const ToolCard = ({ verktoy }: ToolcardProps) => {
  const [showTool, setShowTool] = useState<boolean>(false);

  function clickModal() {
    setShowTool(!showTool);
  }
  var formatedDate = verktoy.datePurchased
    .toString()
    .slice(0, 19)
    .replace("T", " ");

  return (
    <>
      <div
        className="bg-slate-500 text-white rounded-lg p-4 shadow-lg m-4 cursor-pointer"
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
        </div>
      </div>
      {showTool && <ToolModal verktoy={verktoy} clickModal={clickModal} />}
    </>
  );
};

export default ToolCard;
