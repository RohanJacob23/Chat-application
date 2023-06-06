import Header from "@/components/Header";
import Contacts from "@/components/Contacts";
import SetToLocalStorage from "@/utils/SetToLocalStorage";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LayoutHeader from "@/components/LayoutHeader";

export const metadata = {
  title: "Messaging App",
  description: "Messaging app built with Next.js 13",
};

const URL = process.env.URL;

const fetchUser = async (email) => {
  const res = await fetch(`${URL}?email=${email}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

const fetchUserFriends = async (email) => {
  const res = await fetch(`${URL}/friends?email=${email}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

const fetchFriendRequest = async (id) => {
  const res = await fetch(`${URL}/getRequest?userId=${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default async function ChatLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/userAuth");

  const {
    user: { email, image, name },
  } = session;

  const user = await fetchUser(email);
  const userFriends = await fetchUserFriends(email);
  const allRequest = await fetchFriendRequest(user.id);

  return (
    <>
      <main className="md:flex h-screen relative">
        {/* side nav */}
        <section className="absolute md:relative flex flex-col w-full md:w-2/3 h-screen text-white border-r-[0.01rem] border-gray-500 bg-secondary-color z-40">
          <LayoutHeader
            from="layout"
            name={name}
            profile={image}
            userId={user.id}
            allRequest={allRequest}
          />
          {/* name list */}
          <Contacts friends={userFriends} />
        </section>
        {children}
      </main>
    </>
  );
}
