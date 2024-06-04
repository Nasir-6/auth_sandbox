"use client";
import React from "react";

const TestButton = () => {
  const test = () => {
    fetch("http://localhost:8080/test", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          console.log("res", res);
        }
      })
      .catch((err) => console.error("err", err));
  };
  return <button onClick={test}>TestButton</button>;
};

export default TestButton;
