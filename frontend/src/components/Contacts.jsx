"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Contacts({ friends }) {
  const [selectedUser, setSelectedUser] = useState("");
  const router = useRouter();

  const handleUser = (email, name) => {
    setSelectedUser(email);
    router.push(`/${email}?name=${name}`);
  };

  return (
    <div className="bg-secondary-color h-full overflow-y-auto md:block">
      {friends.map((friend) => (
        <div
          key={friend.id}
          className={`flex gap-4 items-center w-full h-20 px-3 hover:bg-secondary-variant-color transition-colors duration-150 cursor-pointer ${
            friend.email === selectedUser ? "bg-secondary-variant-color" : ""
          }`}
          onClick={() => handleUser(friend.email, friend.name)}
        >
          <div className="relative w-10 h-10">
            <Image
              src={friend.image}
              fill
              alt="user-profile"
              priority={true}
              className="object-cover rounded-full"
            />
          </div>
          <h1 className="text-2xl">{friend.name}</h1>
        </div>
      ))}
    </div>
  );
}
