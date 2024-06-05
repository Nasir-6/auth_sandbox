"use client";

import { useEffect, useState } from "react";
import TestButton from "./components/TestButton";

type TUser = { username: string };

export default function Home() {
  const [user, setUser] = useState<TUser | null>(null);

  const handleGoogleLogin = async () => {
    console.log("CLICKED GOOGLE");
    window.open("http://localhost:8080/login/federated/google", "_self"); // Need to access backend login url - which redirects to google login
  };

  const logout = () => {
    fetch("http://localhost:8080/logout", {
      method: "POST", // Use POST To avoid accidental logout!
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          window.location.reload();
        }
      })
      .catch((err) => console.error("err", err));
  };

  // UseEffect to grab user (saved in session) using attached cookie
  useEffect(() => {
    fetch("http://localhost:8080/get-logged-in-user", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("NO LOGGED IN USER FOUND");
      })
      .then((json) => {
        const user = json.user;
        setUser(user);
      })
      .catch((err) => console.error("err", err));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Google Auth test app</h1>
      {user ? (
        <>
          <h1>{`Logged in as: ${user?.username}`}</h1>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleGoogleLogin}>Login with Google</button>
      )}
      <TestButton />
    </main>
  );
}
