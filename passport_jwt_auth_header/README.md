# Passport JWT Auth Header

This node app is dealing with the server side logic of dealing with Auth with JWTs - more specifically when it recieves the token in the form of Authorization: "Bearer: jshdjsahdsahdjkasdjkasnkcnk.token.jkasdjsadj"

If it is the first time running it please npm install - in this folder.

Copy the .example.env file and copy/paste the values for the Vars (You should use your own MongoDb URL string - to connect to your own DB) - and save it as an .env file.

Then run "node generateKeypair.js"

Then go to postman and test it out using the req body to send "uname" and "pw" to login or register (USE THE POST ROUTES!!).

After that use the GET "/protected-route" - with the token you recieved from the earlier step placed inside the auth headers:

Authorization: "PLACE TOKEN HERE" (Include Bearer)

Note: we are using asymmetric keys
The logic behind this is:

- PRIVATE KEY is used to sign jwt tokens (This is done on the authentication server - which is this node server other examples are like Auth0 - servers )
- Now all other Clients/APIs can use the Public key to verify the JWT once recieved - here we are using it here in the server - but you can now use the Public key on other services (like in a microservice architecture) - to verify all requests!

- This is how Auth0 works - they handle the authorisation, refreshing and creation of jwts
- They keep the private key secure
- They give you a public key
- Now once they've issued the JWT you can use the public key to verify the JWT
- They have a rotation of JSON Web Key Sets (JWKS) hosted on a URL - [Find out more here](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets)
