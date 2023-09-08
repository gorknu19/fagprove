"use client";

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

// knapp for å logge inn
export const LoginButton = () => {
  return (
    <button
      onClick={() => signIn()}
      className={` text-gray-300 bg-gray-700 hover:bg-gray-800 hover:text-white rounded-md px-3 py-2 text-sm font-medium`}
    >
      Logg inn
    </button>
  );
};

// knapp for å logge ut
export const LogoutButton = () => {
  return (
    <button
      onClick={() =>
        signOut({
          redirect: false,
        })
      }
      className={`m-5 text-gray-300 bg-gray-700 hover:bg-gray-800 hover:text-white rounded-md px-3 py-2 text-sm font-medium`}
    >
      Logg ut
    </button>
  );
};

//knapp for å vise profil data
export const ProfileButton = () => {
  return (
    <Link
      href="/profile"
      className={`m-5  text-gray-300 bg-gray-700 hover:bg-gray-800 hover:text-white rounded-md px-3 py-2 text-sm font-medium`}
    >
      Profil
    </Link>
  );
};
