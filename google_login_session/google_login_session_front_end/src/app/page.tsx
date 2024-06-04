"use client";

import { useEffect, useState } from "react";
import TestButton from "./components/TestButton";

type TUser = { username: string };

export default function Home() {
  const [user, setUser] = useState<TUser | null>(null);

  const handleGoogleLogin = async () => {
    console.log("CLICKED GOOGLE");
    window.open("http://localhost:8080/login/federated/google", "_self");
  };

  const logout = () => {
    fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          console.log("res", res);
          window.location.reload();
        }
      })
      .catch((err) => console.error("err", err));
  };

  useEffect(() => {
    fetch("http://localhost:8080/get-logged-in-user", {
      credentials: "include",
    })
      .then((res) => {
        console.log("res", res);
        if (res.ok) {
          return res.json();
        }
        throw new Error("NO LOGGED IN USER FOUND");
      })
      .then((json) => {
        console.log("json", json);
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
