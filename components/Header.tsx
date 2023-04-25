import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header({
  photo,
  email,
}: {
  photo?: string;
  email?: string;
}) {
  const router = useRouter()
  const logout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        signOut();
       
        localStorage.removeItem("user"); // remove any user data from local storage
        const baseUrl = window.location.origin;
        window.location.href = baseUrl;
      } else {
        console.error("Error logging out:", response.status);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <header className="flex flex-col xs:flex-row justify-between items-center w-full mt-3 border-b pb-7 sm:px-4 px-2 border-gray-500 gap-2">
      <Link href="/dream" className="flex space-x-2">
        <Image
          alt="header text"
          src="/bed.svg"
          className="sm:w-10 sm:h-10 w-9 h-9"
          width={24}
          height={24}
        />
        <h1 className="sm:text-3xl text-xl font-bold ml-2 tracking-tight">
          DecorAI.xyz
        </h1>
      </Link>
      {email ? (
        <div className="flex items-center space-x-4">
           <button
           onClick={logout}
            className="border-r border-gray-300 pr-4 flex space-x-2 hover:text-blue-400 transition"
          >
            <div>Logout</div>
          </button>
          <Link
            href="/dashboard"
            className="border-r border-gray-300 pr-4 flex space-x-2 hover:text-blue-400 transition"
          >
            <div>Dashboard</div>
          </Link>
          <Link
            href="/buy-credits"
            className="border-r border-gray-300 pr-4 flex space-x-2 hover:text-blue-400 transition"
          >
            <div>Buy Credits</div>
            <div className="text-blue-500 bg-blue-200 rounded-full px-2 text-xs flex justify-center items-center font-bold">
              New
            </div>
          </Link>
          {photo ? (
            <Image
              alt="Profile picture"
              src={photo}
              className="w-10 rounded-full"
              width={32}
              height={28}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-white" />
          )}
        </div>
      ) : (
        <Link
          className="flex max-w-fit items-center justify-center space-x-2 rounded-lg border border-blue-600 text-white px-5 py-2 text-sm shadow-md hover:bg-blue-400 bg-blue-600 font-medium transition"
          href="/dream"
        >
          <p>Sign Up </p>
        </Link>
      )}
    </header>
  );
}
