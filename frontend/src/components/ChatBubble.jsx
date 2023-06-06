"use client";

import React from "react";
import Image from "next/image";

export default function ChatBubble({ msgType, msg, imgSrc }) {
  return (
    <div
      className={`chat ${msgType === "received" ? "chat-start" : "chat-end"}`}
    >
      <div className="chat-image avatar">
        <div className="relative w-7 h-7 rounded-full">
          <Image src={imgSrc} fill priority alt="Profile-Image" />
        </div>
      </div>
      <div
        className={`chat-bubble ${
          msgType === "received" ? "bg-accent-color" : "bg-accent-variant-color"
        } text-black max-w-[15rem]`}
      >
        <p className="break-all whitespace-normal">{msg}</p>
      </div>
      <div className="chat-footer opacity-50">Delivered</div>
    </div>
  );
}
