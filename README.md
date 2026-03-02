# SQL Reserve — Full-Stack Banking System

Hey there! This is **SQL Reserve**, a project I built for my DBMS course. While it started as an academic assignment, I wanted to push it further and build something that looks and feels like a real-world production app—handling everything from ACID-compliant fund transfers to real-time security auditing.

**Check it out live:** [https://sql-reserve.onrender.com](https://sql-reserve.onrender.com)

---

## Why I Built This
The goal wasn't just to make "another CRUD app." I wanted to see how much logic I could offload to the database itself. Instead of doing everything in Node.js, I leaned heavily on **PostgreSQL triggers, stored procedures, and views** to ensure data integrity at the source. It’s built to be "bulletproof" against race conditions and data corruption.

---

## Features

### For Customers
* **Clean Dashboard:** No clutter. Just your account cards, balance, and status badges (Active/Frozen).
* **Rock-Solid Transfers:** I spent a lot of time on the `transfer_funds()` procedure. It uses row-level locking (`FOR UPDATE`) so you can't "double-spend" even if you spam the button.
* **Transaction History:** Fully paginated with filters, so you can actually find that one coffee you bought three weeks ago.

### For Admins (The "God Mode")
* **The Command Center:** A dedicated dashboard showing real-time system stats (total users, today's volume, etc.).
* **Account Control:** Admins can freeze suspicious accounts, adjust balances, or close them entirely.
* **The Paper Trail:** Every sensitive action triggers an audit log. If someone changes a status or moves $10k+, it gets flagged automatically.

---

## The Tech Stack

I went with a modern, type-safe stack to keep things from breaking:

* **Frontend:** React 19 + Vite (blazing fast) + Tailwind CSS 4. I used Framer Motion for those smooth UI transitions.
* **Backend:** Node.js with Express 5. Written in TypeScript because I value my sanity when it comes to API responses.
* **Database:** PostgreSQL. The star of the show. It handles the heavy lifting through procedures and pgcrypto.
* **Security:** Passwords are salted/hashed with **Bcrypt**, and sensitive stuff like National IDs are encrypted using **AES-256-CBC**.

---

## Database Deep Dive
This is where the "DBMS Course" part really shines. I didn't just make tables; I built a system:

| Feature | What it actually does |
| :--- | :--- |
| **Atomic Transfers** | Wrapped in `BEGIN/COMMIT/ROLLBACK`. If a transfer fails halfway, *nobody* loses money. |
| **Automatic Flagging** | A trigger watches for transactions > $10,000 and logs them for review immediately. |
| **Real-time Views** | Used `system_stats` views so the Admin Dashboard doesn't have to run 5 heavy queries every refresh. |
| **Row-Level Locking** | Prevents race conditions. Your balance stays accurate even under heavy concurrent load. |

Security Note
I've implemented Rate Limiting (20 requests per 15 mins) on login/register endpoints to stop brute-force bots. The app also uses JWTs with expiry and CORS restrictions in production to keep things tight.

Author
Shankar Adhikary — I like building things that worK !!
