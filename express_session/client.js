const logoutBtn = document.getElementById("logout-btn");
const resultElem = document.getElementById("result");

async function dashboard() {
  console.log("document.cookie", document.cookie);
  console.log("FETCHING");
  await fetch("http://localhost:3000/dashboard", {
    method: "GET",
    credentials: "include",
  })
    .then((res) => res.text())
    .then((text) => {
      resultElem.textContent = text;
    });
}

// dashboard();

logoutBtn.addEventListener(
  "click",
  dashboard()

  // function () {
  //   fetch("http://localhost:3000/logout", {
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => res.text())
  //     .then((text) => {
  //       console.log("text", text);
  //       resultElem.textContent = text;
  //     });
  // }
);
