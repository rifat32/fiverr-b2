import { Analytics } from "@vercel/analytics/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { getSession, SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchUser = async () => {
     
    
  
        try {
          const response = await fetch("/api/user");
          const data = await response.json();

          if(data?.user) {
            localStorage.setItem("user",JSON.stringify(data.user))
            console.log(localStorage.getItem("user"))
          }
          else{
            localStorage.removeItem("user")
          }

       
          
        } catch (error) {
          console.error(error);
        }
   
      
    
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#fff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999,
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="80"
      height="80"
      viewBox="0 0 24 24"
      style={{ animation: "spin 1s linear infinite" }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="none"
        stroke="#007bff"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  </div>;
  }

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Analytics />
    </SessionProvider>
  );
}

export default MyApp;
