"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

//typer for data som kommer inn i component
interface UploadButtonProps {
  setFile: (file: File) => void;
  file: File | null;
  imageId?: string | null;
}

export const UploadButton = ({ setFile, file, imageId }: UploadButtonProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  // setter preview hvis det er en file allerede
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // når bilde blir opplaset så blir det satt til state
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return console.log("no file uploaded");

    console.log(files[0]);

    setFile(files[0]);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        <label htmlFor={"fileUpload"} className="cursor-pointer">
          <div className="text-gray-300 bg-gray-700 hover:bg-gray-800 hover:text-white font-medium text-sm p-4 flex flex-col items-center gap-2  rounded-t-md  ">
            <span>Velg et bilde for å opplaste</span>
            <input
              type="file"
              // accept="image/*"
              onChange={onChange}
              className="hidden"
              id="fileUpload"
            />
          </div>
          {/* // hvis det er preview så vises den */}
          {preview && (
            <Image
              height={500}
              width={500}
              src={preview}
              alt="verktøy"
              key={"preview"}
            />
          )}
          {/* hvis imageID er satt og ingen preview så vises den istedet, dette er for redigering componenten */}
          {imageId && !preview && (
            <Image
              height={500}
              width={500}
              src={`/api/image/${imageId}`}
              alt="verktøy"
              key={"preview"}
            />
          )}
        </label>
      </div>
    </div>
  );
};
