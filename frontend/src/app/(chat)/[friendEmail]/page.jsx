import React from "react";
import Header from "@/components/Header";
import ChatArea from "@/components/ChatArea";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const URL = process.env.URL;

const fetchUser = async (email) => {
  const res = await fetch(`${URL}?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

const getMessages = async (userId, receiverId) => {
  const res = await fetch(
    `${URL}/message?userId=${userId}&receiverId=${receiverId}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default async function page({ params: { friendEmail } }) {
  const {
    user: { email, image },
  } = await getServerSession(authOptions);
  const user = await fetchUser(email);
  const friend = await fetchUser(friendEmail);

  const messages = await getMessages(user.id, friend.id);

  return (
    <section className="absolute md:relative flex flex-col text-white w-full h-full bg-chatBg bg-no-repeat bg-cover z-50">
      {/* Header section */}
      <Header from="page" profile={friend.image} name={friend.name} />

      {/* chat area */}
      <ChatArea
        messages={messages}
        friendsId={friend.id}
        userProfile={image}
        userId={user.id}
        friendsProfile={friend.image}
      />
    </section>
  );
}
