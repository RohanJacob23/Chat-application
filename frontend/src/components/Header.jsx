"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function Header({ name, from, profile }) {
  const router = useRouter();
  return (
    <>
      {/* header section */}
      <div className="flex gap-5 items-center justify-between w-full h-20 bg-secondary-color px-3">
        <div className="flex gap-3 items-center">
          {from === "page" && (
            <IconArrowLeft
              size={"1.5rem"}
              className="block md:hidden cursor-pointer"
              onClick={() => router.push("/")}
            />
          )}
          {/* user's profile picture */}
          <div className="relative w-10 h-10">
            <Image
              src={profile}
              fill
              alt="user-profile"
              priority={true}
              className="object-cover rounded-full"
            />
          </div>

          {/* user name */}
          <h1
            className={`font-semibold text-2xl md:text-3xl ${
              from === "layout" ? "text-gradient" : ""
            }`}
          >
            {name}
          </h1>
        </div>
      </div>
    </>
  );
}
