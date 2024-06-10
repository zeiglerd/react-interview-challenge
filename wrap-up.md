## Questions

### What issues, if any, did you find with the existing code?
- Security
    - Requires no password to log in.
    - `.env` file should be called [something like] `.env.example` and the `.env` should not be checked into VC.
- `./package-lock.json`, `./api/package-lock.json`, and `./ui/package-lock.json` are included in `./gitignore`; however, I would advocate we check `package-lock.json` files into VC, as it would ensure subsequent builds use the same version of dependencies we've been deploying and developing with... Alternatively, if the intention was to not check-in changes to `./package-lock.json` (since it's not a Node.js project per se), perhaps `./gitignore` should be updated from `**/package-lock.json` to `/package-lock.json` instead.
- Not storing dollar amounts or account IDs as `BIGSERIAL`.

### What issues, if any, did you find with the request to add functionality?
- `joi` errors were not being raised to the front end correctly.
- Mixed use of `account_number` (backend) and `accountNumber` (frontend) in code.
- Thrown errors are being raised to the front end with little care, which could potentially expose sensitive details about the server.

### Would you modify the structure of this project if you were to start it over? If so, how?
- I have a few thoughts; but I ultimately believe this to be semantics, unless a functional reason arises to make the change, such as what if we were to move away from Docker and into the cloud? Deploying the projects could be easier if they're in their own repositories. Additionally, having the projects in their own repositories may allow more developers to modify code without stepping on each other's feet, especially in the case of splitting feature work between front-end and back-end development teams. In saying all of that, this simplified structure bodes well for the use case and a more traditional hosting solution.

### Were there any pieces of this project that you were not able to complete that you'd like to mention?
n/a

### If you were to continue building this out, what would you like to add next?
- Shared library for TS and other shared functionality.
- Add a `README.md` to `./api` and `./ui`
- Add functional and unit tests.
- DB pool.

### If you have any other comments or info you'd like the reviewers to know, please add them below.
- I could not run the `docker run build` command on my Windows machine; however, the `docker compose up -d` command did spin up the Docker stack. I did reach out to Michael Hartung who confirmed the same issue on their side as well.
