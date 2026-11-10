# Lab 09 — Implementation Documentation

This document follows the six-task structure in the CS-301L Lab 09 task sheet.

## 1. Secure Application Bootstrap

**Files:** `src/main.ts`, `src/auth/dto/register.dto.ts`

- `helmet()` adds standard HTTP security headers. A successful API response should include `X-Content-Type-Options: nosniff`.
- CORS allows only the origin `http://localhost:5173`.
- The global `ValidationPipe` uses:
  - `whitelist: true` — removes properties without validation decorators.
  - `forbidNonWhitelisted: true` — rejects requests containing unknown properties instead of silently accepting them.
  - `transform: true` — transforms incoming payloads to DTO instances.
- A registration request containing an extra property such as `isAdmin` must return HTTP 400.

**Test:** `GET /health` to inspect security headers, then `POST /auth/register` with a valid registration body plus `isAdmin: true` to confirm rejection.

## 2. DTO Validation and Update Endpoint

**Files:** `src/notes/dto/create-note.dto.ts`, `src/notes/dto/update-note.dto.ts`, `src/notes/notes.controller.ts`, `src/notes/notes.service.ts`, `src/common/pipes/positive-int.pipe.ts`

`CreateNoteDto.tags` is optional. When supplied, it must be an array containing no more than five strings; each string can contain no more than 20 characters. The decorators implement the exact constraints requested in the task sheet.

`UpdateNoteDto` extends `PartialType(CreateNoteDto)`, so each create-note property becomes optional for PATCH requests. `PositiveIntPipe` rejects zero, negative, decimal and non-numeric IDs. Before updating, the controller loads the note and checks that the caller is its owner or has the `admin` role. Other authenticated users receive 403.

**Tests:** POST six tags (400); POST a 25-character tag (400); PATCH a note as its owner (200); PATCH another user's note as a normal user (403).

## 3. Custom Middleware — Request ID

**Files:** `src/common/middleware/request-id.middleware.ts`, `src/common/middleware/logger.middleware.ts`, `src/app.module.ts`

`RequestIdMiddleware` calls Node's built-in `randomUUID()`, stores the value in `req.id`, and adds it to the response as `X-Request-Id`. `LoggerMiddleware` reads that ID and logs the method, URL, response status and elapsed milliseconds when the response finishes.

`AppModule` registers `RequestIdMiddleware` before `LoggerMiddleware` for the Auth and Notes controllers. The registration order ensures the logger can read the ID created by the first middleware.

**Test:** Call `GET /notes` with a valid bearer token. Compare the `X-Request-Id` response header with the matching `[HTTP]` line in the server terminal.

## 4. Custom Pipe — SortOrderPipe

**Files:** `src/common/pipes/sort-order.pipe.ts`, `src/notes/notes.controller.ts`, `src/notes/notes.service.ts`

The pipe returns `asc` when the query value is missing. It accepts `asc` and `desc` without case sensitivity, then returns the normalized lowercase value. Any other value throws `BadRequestException` with the exact message `order must be asc or desc`.

The `GET /notes` controller binds the pipe to `@Query('order', SortOrderPipe)`. The service sorts the current user's notes by title in the requested direction.

**Tests:** `GET /notes` (ascending); `GET /notes?order=DESC` (descending); `GET /notes?order=random` (400).

## 5. Authentication — Change Password

**Files:** `src/auth/dto/change-password.dto.ts`, `src/auth/auth.controller.ts`, `src/auth/auth.service.ts`, `src/users/users.service.ts`

The endpoint is protected with `AuthGuard`. It uses `req.user.sub` as the current user's ID. The service loads that user, compares `currentPassword` with the stored bcrypt hash, rejects an incorrect current password with 401, rejects a same-as-current new password with 400, hashes the new password, and calls `UsersService.updatePassword()`.

The endpoint returns only `{ "message": "Password updated" }`; it never returns a password or hash. The DTO requires a new password with at least eight characters, one uppercase letter and one number.

**Tests:** no token (401); incorrect current password (401); weak new password (400); same password (400); valid change (200); old password login (401); new password login (200).

## 6. Authorization — Admin Users List

**Files:** `src/users/users.controller.ts`, `src/users/users.module.ts`, `src/common/decorators/roles.decorator.ts`, `src/common/guards/roles.guard.ts`

`GET /users` uses `@UseGuards(AuthGuard, RolesGuard)` and `@Roles('admin')`. The authentication guard runs first so the role guard receives the authenticated user's role. `UsersService.findAllSafe()` maps each user into a safe object, and the controller explicitly returns only `id`, `name`, `email`, and `role`. The `passwordHash` property is not part of the response.

**Tests:** no token (401); normal user token (403); admin token (200).

---

# Reflection Questions (2–4 lines each)

### 1. What is the difference between a 401 and a 403 response? Give one example from your project for each.

**401 Unauthorized** means the request is not successfully authenticated, such as calling `POST /auth/change-password` without a valid JWT. **403 Forbidden** means the user is authenticated but lacks permission, such as a normal user requesting `GET /users` or trying to update another user's note.

### 2. Why must validation happen on the server even when the front end already validates the form?

Front-end validation can be bypassed by sending requests directly through tools such as Postman or custom scripts. Server-side validation is therefore the trusted enforcement point and prevents invalid or unexpected data from entering the application.

### 3. A JWT payload is readable by anyone. Why is the token still safe to use for authentication?

A signed JWT is not encrypted, so its payload should not contain secrets. The server verifies its signature and expiry before trusting its claims; changing the payload invalidates the signature. HTTPS should protect the token while it is transmitted.

### 4. Why does the login endpoint return the same error message for an unknown email and a wrong password?

Using one generic message avoids revealing whether a particular email address has an account. This reduces account enumeration and gives an attacker less information when guessing valid users.

### 5. In what order do middleware, guards and pipes run? Why must AuthGuard come before RolesGuard?

For a NestJS request, middleware runs before guards, and pipes run before the route handler to validate/transform parameters and bodies. `AuthGuard` must run before `RolesGuard` because it validates the JWT and attaches the authenticated user's role; the role guard then checks authorization.

## Design limitations to know before the viva

- This standalone lab uses in-memory arrays rather than a database. Data resets when the app restarts. The supplied task PDF describes the behavior to implement but does not specify a database schema or persistence adapter.
- The development JWT secret is a fallback for local practice only. Set a unique secret in `.env` for your own local environment and never commit it.
- The demo seed users are for local testing only. Change or remove them before any real deployment.
