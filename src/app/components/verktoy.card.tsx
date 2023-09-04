import React, { useState } from "react";
import Image from "next/image";
import { Post } from "@prisma/client";
import ToolModal from "./verktoy.modal";

interface ToolcardProps {
  verktoy: Post;
}

const ToolCard = ({ verktoy }: ToolcardProps) => {
  const [showTool, setShowTool] = useState<boolean>(false);

  function clickModal() {
    setShowTool(!showTool);
  }

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
          <p>Dato Kjøpt: {verktoy.datePurchased.toString()}</p>
        </div>
      </div>
      {showTool && <ToolModal verktoy={verktoy} clickModal={clickModal} />}
    </>
  );
};

export default ToolCard;
