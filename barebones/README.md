# Barebones

This little project is based off of https://youtu.be/mL8EuL7jSbg?si=05qSU4slSau32YIk.

The reason I wanted to build it out is to learn how auth works under the hood. This will form the foundations of building my understanding.

What I learnt:

- Auth happens on the server (not on client)
- Sessions are stored in the server
- Pass the sessionId via cookies (enable httpOnly so no access via clientside js - only via http requests)
- use credentials: include so cookies included!

Some Flaws - will learn libraries/methods to improve:

- How to manage sessions (Same person logging in shouldn't have two sessions)
- Logout
- Use these to authorise actual api endpoints
- encrypt passwords/sessionIds

Note: React and other libraries weren't used so the barebones code can be as simple and clear as possible (Also that's how it was in the video by Kyle)
