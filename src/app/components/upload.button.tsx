"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

interface UploadButtonProps {
  setFile: (file: File) => void;
  file: File | null;
}

export const UploadButton = ({ setFile, file }: UploadButtonProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

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
            <span>Choose some files to upload</span>
            <input
              type="file"
              onChange={onChange}
              className="hidden"
              id="fileUpload"
            />
          </div>

          {preview && (
            <Image height={500} width={500} src={preview} alt="nice" />
          )}
        </label>
        {/* <button
          className={` text-gray-300 bg-gray-700 hover:bg-gray-800 hover:text-white rounded-b-md px-3 py-4 text-sm font-medium`}
          onClick={onUpload}
          type="button"
        >
          Upload Picture
        </button> */}
        <input className="hidden" />
      </div>
    </div>
  );
};
