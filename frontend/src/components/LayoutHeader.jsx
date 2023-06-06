"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IconCheck, IconInbox, IconX } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import Image from "next/image";

import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Header from "./Header";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";

export default function LayoutHeader({
  name,
  from,
  profile,
  userId,
  allRequest,
}) {
  const [dialog, setDialog] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [noEmail, setNoEmail] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  // const url = "https://chat-application-ynit.onrender.com/api";
  const url = "http://localhost:5000/api";
  const friendRequestTitle = "Friend Requests";
  const sendFriendRequestTitle = "Send a Friend Request";
  const sendFriendRequestDesc =
    "Type the email of your friend to sent a request";

  const friendRequestDesc =
    allRequest.length !== 0 ? (
      <ul>
        {allRequest.map((list) => (
          <li
            key={list.id}
            className="hover:bg-secondary-color rounded px-2 py-3 "
          >
            <div className="flex items-center justify-between w-full">
              <h1 className="cursor-default">{list.name}</h1>
              <div className="flex space-x-2">
                {/* close icon */}
                <div
                  onClick={() => declineRequest(list.id)}
                  className="hover:bg-destructive/20 p-2 rounded cursor-pointer transition-transform ease-in-out duration-200 hover:scale-105"
                >
                  <IconX size={"1.5rem"} className="text-destructive" />
                </div>

                {/* accept icon */}
                <div
                  onClick={() => acceptFriendRequest(list.id)}
                  className="hover:bg-green-800/20 p-2 rounded cursor-pointer transition-transform ease-in-out duration-200 hover:scale-105"
                >
                  <IconCheck size={"1.5rem"} className="text-green-800" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No Friend Request</p>
    );

  const handleSendRequest = (e) => {
    e.preventDefault();
    axios
      .post(`${url}/sendRequest`, { senderId: userId, toEmail })
      .then((res) => {
        if (res.data.error) {
          setNoEmail(true);
        }
      })
      .catch((error) => console.log(error))
      .finally(() =>
        toast({
          title: "Friend Request Sent!!",
          action: <ToastAction altText="Done">Ok!</ToastAction>,
        })
      );

    setToEmail("");
  };

  const acceptFriendRequest = (friendId) => {
    axios
      .post(`${url}/acceptRequest`, { userId, friendId })
      .catch((err) => console.log(err))
      .finally(() => {
        toast({ title: "Friend Request Accepted!!" });
        router.refresh();
      });
  };

  const declineRequest = (friendId) => {
    axios
      .post(`${url}/declineRequest`, { userId, friendId })
      .catch((err) => console.log(err))
      .finally(() => {
        toast({ title: "Friend Request Declined!!" });
        router.refresh();
      });
  };

  return (
    <section className="flex w-full justify-between items-center pr-3">
      <Header name={name} from={from} profile={profile} />

      {/* logout */}
      <div className="flex items-center gap-5">
        <div
          className="relative w-6 h-6 cursor-pointer"
          onClick={() => signOut()}
        >
          <Image
            src="/logoutIcon.png"
            priority={true}
            fill
            alt="logOut Icon"
            className="object-contain"
          />
        </div>

        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-none">
              <IconInbox size={"1.5rem"} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* menu 1 */}
              <DialogTrigger>
                <DropdownMenuItem onClick={() => setDialog(1)}>
                  Friend Requests
                </DropdownMenuItem>
              </DialogTrigger>

              {/* menu 2 */}
              <DialogTrigger>
                <DropdownMenuItem onClick={() => setDialog(2)}>
                  Send Friend Request
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* dialog */}
          <DialogContent className="bg-secondary-variant-color">
            <DialogHeader>
              <DialogTitle>
                {dialog === 1 ? friendRequestTitle : sendFriendRequestTitle}
              </DialogTitle>
              {dialog === 1 ? (
                friendRequestDesc
              ) : (
                <DialogDescription>{sendFriendRequestDesc}</DialogDescription>
              )}
            </DialogHeader>

            {/* input field */}
            {dialog === 2 && (
              <form onSubmit={handleSendRequest}>
                <div className="flex w-full items-center space-x-2">
                  <Label htmlFor="email">Email:</Label>
                  <div className="flex flex-col justify-center flex-grow">
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      className="border-accent-color"
                      onChange={(e) => setToEmail(e.target.value)}
                      value={toEmail}
                      onBlur={() => setNoEmail(false)}
                    />
                    {noEmail && (
                      <p className="text-sm text-destructive">
                        Enter your email address.
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="bg-accent-color hover:bg-accent-variant-color"
                    onClick={handleSendRequest}
                  >
                    Send
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
