function register() {
  console.log("SUBMITTING REGISTER FORM");
  // Collect form data
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log("name", name);
  const reqBody = {
    name,
    email,
    password,
  };
  console.log("reqbody", reqBody);

  // Make a POST request using fetch
  // NOTE: MAKE SURE TO INCLUDE credentials - in every request - so the cookie is stored!!
  fetch("http://127.0.0.1:3000/register", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  })
    .then(async (response) => {
      const result = await response.text();
      document.getElementById("result").textContent = result;
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
