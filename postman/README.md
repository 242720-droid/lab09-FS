# Postman collection notes

Import `Lab09.postman_collection.json` and `Lab09.local.postman_environment.json` into Postman, then select **Lab09 Local**.

Run the requests in folder order. The two login requests save bearer tokens to `userToken` and `adminToken`. The note-creation requests save the generated note IDs for later PATCH tests.

For Task 5, run the entire password-change folder in order and restart the API before repeating it, because the demo users are seeded in memory at startup. The successful password change changes the in-memory user password for the rest of that server session.

Postman commonly sends 201 Created for NestJS `@Post()` handlers by default; the collection expects 201 for these POST requests. The lab sheet's expected 200 for a successful change-password can be obtained by adding `@HttpCode(200)` to that controller method. To match the task sheet exactly, this project sets the change-password endpoint to 200 using `@HttpCode(200)`; see the endpoint code.
