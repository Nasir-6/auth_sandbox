function submitForm() {
  console.log("SUBMITTING FORM");
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
  fetch("http://127.0.0.1:3000/register", {
    method: "POST",
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
