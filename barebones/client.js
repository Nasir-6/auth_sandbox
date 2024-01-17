const adminBtn = document.getElementById("admin-btn");
const userBtn = document.getElementById("user-btn");
const getAdminDataBtn = document.getElementById("admin-data-btn");
const resultElem = document.getElementById("result");

adminBtn.addEventListener("click", function () {
  login("admin");
});

userBtn.addEventListener("click", function () {
  login("user");
});

function login(username) {
  fetch("http://localhost:3000/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  })
    .then((res) => res.text())
    .then((text) => {
      resultElem.textContent = text;
    });
}

getAdminDataBtn.addEventListener("click", function () {
  fetch("http://localhost:3000/adminData", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.text())
    .then((text) => {
      console.log("text", text);
      resultElem.textContent = text;
    });
});
