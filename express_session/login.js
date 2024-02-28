async function login() {
  console.log("SUBMITTING LOGIN FORM");
  // Collect form data
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const reqBody = {
    email,
    password,
  };

  // Make a POST request using fetch
  await fetch("http://127.0.0.1:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // DONT FORGET THIS to ensure json is sent back!!
    },
    body: JSON.stringify(reqBody),
    credentials: "include", // DON'T FORGET TO ADD THIS TO BOTH REQUEST and RESPONSE
  })
    .then(async (response) => {
      const result = await response.text();
      document.getElementById("result").textContent = result;
    })
    .catch(async (error) => {
      console.error("Error:", error);
      const result = await error.text();
      document.getElementById("result").textContent = result;
    });
}
