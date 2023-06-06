"use client";

import React from "react";
import { signIn } from "next-auth/react";

export default function GoogleSignIn() {
  return (
    <div className="flex justify-center items-center h-screen bg-secondary-color">
      <div className="w-80 p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-black/75">
          Sign in with Google
        </h2>
        <button
          className="w-full py-2 px-4 rounded bg-blue-600 text-white font-bold hover:bg-blue-700"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          SignIn
        </button>
      </div>
    </div>
  );
}
