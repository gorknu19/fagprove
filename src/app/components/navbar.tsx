"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  LoginButton,
  LogoutButton,
  ProfileButton,
} from "@/app/components/nextauth.buttons";
import { useState } from "react";

function Navbar() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState<boolean>(false);

  function clickModal() {
    setShowModal(!showModal);
  }
  return (
    <>
      <nav className={`bg-slate-900 text-white top-0`}>
        <div className={"mx-auto px-2"}>
          <div className={`relative flex h-16 items-center justify-between`}>
            <div className={`flex flex-1 items-center`}>
              <div className={`items-center mr-5`}></div>
              <div className="flex space-x-7">
                <a
                  href="/"
                  className={`text-gray-300  rounded-md px-3 py-2  font-bold text-3xl`}
                >
                  Verktøy
                </a>
              </div>
            </div>
            <div className=" inset-y-0 right-0 flex space-x-4 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {!session && (
                <>
                  <LoginButton />
                </>
              )}
              {session?.user && (
                <>
                  <div>
                    <p className="text-gray-300 rounded-md px-3 py-2 text-sm font-medium">
                      Logget inn som: {session.user.name}
                    </p>
                  </div>
                  <div className="relative ml-3">
                    <div>
                      <button
                        type="button"
                        className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        aria-expanded="false"
                        aria-haspopup="true"
                        onClick={clickModal}
                      >
                        <span className="sr-only">Open user menu</span>
                        {session.user && (
                          <svg
                            className="block h-6 w-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    {showModal && (
                      <div
                        className="absolute right-0 z-10 mt-4 pt-4 w-48 origin-top-right rounded-md  bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <ProfileButton />
                        <LogoutButton />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
