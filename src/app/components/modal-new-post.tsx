import { useForm, SubmitHandler } from 'react-hook-form';
import { UploadButton } from './upload.button';
import { useRef, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  verktoyPostSchema,
  verktoyPostSchemaType,
} from '../api/verktoy/schema';
import { useQueryClient } from '@tanstack/react-query';
import { createPost } from '../services/verktoy.post.service';

interface newPostModalProps {
  clickModal: () => void;
}

export const NewPostModal = ({ clickModal }: newPostModalProps) => {
  //state for fil, session data og query client

  const [file, setFile] = useState<File | null>(null);
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  //useform som blir brukt for formen som sender inn data til å lage comment, som har resolver fra zod som validerer alt før den i det heletatt sender de

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    trigger,
    getValues,
    setError,
  } = useForm<verktoyPostSchemaType>({
    resolver: zodResolver(verktoyPostSchema),
  });

  // onsubmit 2 blir kjørt når form blir levert inn så den kan lagre bildet på databasen før densender inn data med image id som kommer fra det api'et

  const onSubmit2 = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!getValues('fileId'))
      setError('fileId', {
        type: 'custom',
        message: 'upload a picture first',
      });

    if (!file) return console.log('no file uploaded!');

    // setting av data som blir sendt
    let url = '/api/upload';
    var formData = new FormData();
    formData.append('file', file, file.name);

    // bilde blir sendt og lagert på pc
    let res = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // fileId blir satt
    setValue('fileId', res.data.imageDataDB.id);

    // original onsubmit kjør
    onSubmit(e);
  };

  // on submit som også sjekker om data er rendt med handle submit, og hvis den går forbi validering, så blir posten sendt og posts blir henta på nytt

  const onSubmit = handleSubmit(async (e) => {
    let data = e;
    createPost(data);
    clickModal();
    queryClient.invalidateQueries({ queryKey: ['verktoy'] });
  });

  return (
    <>
      <div className="fixed w-full p-4 md:inset-0 max-h-full text-center m-auto box-border  overflow-y-auto">
        <div className="relative w-full max-w-md max-h-full m-auto">
          <div className="bg-slate-500 rounded-lg shadow dark:bg-gray-700  border border-black ">
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
                <span className="sr-only">Lukk modal</span>
              </button>
              <h1 className="p-2 font-bold "> Nytt verktøy</h1>
              <form
                onSubmit={onSubmit2}
                className="flex flex-col text-black space-y-2"
              >
                <UploadButton setFile={setFile} file={file} />
                {errors.fileId && (
                  <p className="text-red-500">{errors.fileId.message}</p>
                )}
                <label htmlFor="type" className="text-white">
                  Type:
                </label>
                <input
                  type="text"
                  {...register('type')}
                  placeholder="eks:  Borhammer"
                  id="type"
                  className="rounded-md ring-1 ring-black shadow-md"
                />
                {errors.type && (
                  <p className="text-red-500">{errors.type.message}</p>
                )}
                <label htmlFor="name" className="text-white">
                  Navn:
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="eks:  GBH 18V-26F"
                  {...register('name')}
                  className="rounded-md ring-1 ring-black shadow-md"
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
                <label htmlFor="datePurchased" className="text-white">
                  Dato kjøpt:
                </label>
                <input
                  type="date"
                  {...register('datePurchased')}
                  placeholder="eks: 23.05.2021"
                  id="datePurchased"
                  className="rounded-md ring-1 ring-black shadow-md"
                />
                {errors.datePurchased && (
                  <p className="text-red-500">{errors.datePurchased.message}</p>
                )}
                <label htmlFor="operation" className="text-white">
                  Drift:
                </label>
                <input
                  type="text"
                  {...register('operation')}
                  id="operation"
                  placeholder="eks: Batteri 18V"
                  className="rounded-md ring-1 ring-black shadow-md"
                />
                {errors.operation && (
                  <p className="text-red-500">{errors.operation.message}</p>
                )}
                <label htmlFor="storageSpace" className="text-white">
                  Lagerplass:
                </label>
                <input
                  type="text"
                  {...register('storageSpace')}
                  placeholder="eks: Hylle 2"
                  id="storageSpace"
                  className="rounded-md ring-1 ring-black shadow-md"
                />
                {errors.storageSpace && (
                  <p className="text-red-500">{errors.storageSpace.message}</p>
                )}
                <label htmlFor="extraEquipment" className="text-white">
                  Ekstrautstyr:
                </label>
                <input
                  type="text"
                  {...register('extraEquipment')}
                  id="extraEquipment"
                  className="rounded-md ring-1 ring-black shadow-md"
                  placeholder="eks: Bor, batteri, Dybdeanlegg"
                />
                {errors.extraEquipment && (
                  <p className="text-red-500">
                    {errors.extraEquipment.message}
                  </p>
                )}

                <input
                  type="submit"
                  className={`text-gray-300 bg-gray-700 hover:bg-gray-800 hover:text-white rounded-md px-3 py-4 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
