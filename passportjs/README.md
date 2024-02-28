# express-session

This one is built upon the barebones one - but now sessions are managed using express-sessions.

What I learnt:

- Make sure to have withCredentials set for both front-end req (include credentials: "include" in fetch) and back-end responses (cors({ origin: "http://127.0.0.1:5500", credentials: true }))
- When you setup express-session - don't set sameSite - this will enable chrome/the client to save cookies
- If you set sameSite to none then chrome wont store unless you set secure to true - But since we are developing locally with http this wont work!!
- Need to readup on sameSite cookies - https://web.dev/articles/samesite-cookies-explained
- The way express-session works is if you change req.session.whatver - it will create a session and send a cookie - otherwise it will assume no session is to be created - GENIUS!!
- There was a bug where I was sending res.sendStatus(401).send("whatever") IT SHOULD be res.status(401).send("whatever") cannot adjust response headers once sent!!
- Send minimal info via cookies - to keep data confidential - only pass over what you need - all user data is stored on the server - only requested data is sent via requests - cookies only contains enough to identify person in DB!

Some Flaws - will learn libraries/methods to improve:

This will be built upon - intially was supposed to be passportjs folder - but a lot was learnt through working with express-session
