# Required Screenshot Evidence

Save genuine screenshots from your own running app and Postman/Thunder Client in this folder. No screenshots have been fabricated or pre-filled.

| Suggested filename | What the screenshot must show |
|---|---|
| `task1-headers.png` | Successful response headers containing `X-Content-Type-Options: nosniff` (for example, `GET /health`) |
| `task1-rejected-extra-property.png` | `POST /auth/register` with `isAdmin: true` and the 400 response |
| `task2-six-tags-rejected.png` | `POST /notes` with six tags and 400 |
| `task2-long-tag-rejected.png` | `POST /notes` with a 25-character tag and 400 |
| `task2-owner-update.png` | Owner's `PATCH /notes/:id` returning 200 and changed title |
| `task2-other-user-forbidden.png` | Different normal user updating that note and receiving 403 |
| `task3-request-id.png` | Postman response header `X-Request-Id` |
| `task3-terminal-log.png` | Terminal log line with the same request ID, method, path, status and duration |
| `task4-ascending.png` | `GET /notes` response sorted by title ascending |
| `task4-descending.png` | `GET /notes?order=DESC` response sorted by title descending |
| `task4-invalid-order.png` | `GET /notes?order=random` returning 400 and the required message |
| `task5-no-token.png` | Change-password request without token returning 401 |
| `task5-wrong-current-password.png` | Wrong current password returning 401 |
| `task5-weak-password.png` | Weak new password returning 400 validation errors |
| `task5-same-password.png` | Same current/new password returning 400 |
| `task5-password-updated.png` | Valid change returning `Password updated` |
| `task5-old-password-rejected.png` | Old password login returning 401 after the change |
| `task5-new-password-login.png` | New password login returning 200 with a token |
| `task6-no-token.png` | `GET /users` without token returning 401 |
| `task6-normal-user-forbidden.png` | `GET /users` as normal user returning 403 |
| `task6-admin-list.png` | `GET /users` as admin returning 200 with no `passwordHash` field |

Keep the response body/status visible and include the request URL where possible. For Task 3, the request ID in Postman must match the ID in the terminal screenshot.
