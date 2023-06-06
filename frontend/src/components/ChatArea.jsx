"use client";

import React, { useEffect, useState } from "react";
import ChatBubble from "./ChatBubble";
import Image from "next/image";
import { io } from "socket.io-client";

let socket;

export default function ChatArea({
  messages,
  friendsId,
  userProfile,
  userId,
  friendsProfile,
}) {
  const [typedMessage, setTypedMessage] = useState("");
  const [chat, setChat] = useState(messages);

  const handleInput = async (e) => {
    e.preventDefault();
    socket.emit("chat message", { userId, friendsId, message: typedMessage });
    setTypedMessage("");
  };

  useEffect(() => {
    socket = io("http://localhost:5000");
    socket.emit("connected user", { id: userId });
    socket.on("chat message", ({ message }) => {
      setChat((prev) => [...prev, message]);
    });
  }, []);

  useEffect(() => {
    const element = document.getElementById("target");
    element.scrollIntoView();
  }, [chat]);

  return (
    <>
      <section className="overflow-y-auto h-full">
        <div className="pt-5">
          {chat.map((message) => (
            <ChatBubble
              key={message.id}
              msg={message.messageContent}
              msgType={message.receiverId === friendsId ? "sent" : "received"}
              imgSrc={
                message.receiverId === friendsId ? userProfile : friendsProfile
              }
            />
          ))}
        </div>
        <div id="target"></div>
      </section>

      <section className="flex items-center h-20 px-3 gap-3 bg-secondary-color">
        {/* input */}
        <div className="grow">
          <form onSubmit={handleInput}>
            <input
              type="text"
              name="message"
              id="message"
              className="w-full h-8 bg-white/[15%] rounded-xl focus-visible:outline-none px-3.5"
              value={typedMessage}
              autoComplete="off"
              onChange={(e) => setTypedMessage(e.target.value)}
            />
          </form>
        </div>

        {/* send button */}
        <div
          className="relative w-10 h-10 cursor-pointer"
          onClick={handleInput}
        >
          <Image src="/send-button.png" fill alt="sent-button" />
        </div>
      </section>
    </>
  );
}
