import { Post } from "@prisma/client";
import Image from "next/image";
import { Comments } from "./comments";

interface ToolModalProps {
  verktoy: Post;
  clickModal: () => void;
}

const ToolModal: React.FC<ToolModalProps> = ({
  verktoy: verktoy,
  clickModal,
}) => {
  return (
    <>
      <div className="fixed w-full p-4 md:inset-0  max-h-full text-center m-auto">
        <div className="relative w-full max-w-md max-h-full m-auto">
          <div className="bg-slate-700 rounded-lg shadow dark:bg-gray-700  border border-black ">
            <div className="px-6 py-6 lg:px-8">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-hide="authentication-modal"
                onClick={clickModal}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="mt-10">
                <div className="flex justify-center">
                  <Image
                    src={`/api/image/${verktoy.imageId}`}
                    alt="verktoy"
                    width={200}
                    height={200}
                    className="rounded-md"
                  />
                </div>
                <h3 className="text-2xl font-semibold">{verktoy.name}</h3>
                <p>Type: {verktoy.type}</p>
                <p>Date Purchased: {verktoy.datePurchased.toString()}</p>
                <p>Operation: {verktoy.operation}</p>
                <p>Storage Spot: {verktoy.storageSpace}</p>
                <p>Extra Equipment: {verktoy.extraEquipment}</p>
                {/* <p>Comments: {verktoy.comments}</p> */}

                <Comments postId={verktoy.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolModal;
