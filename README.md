# LeaveFlow

A small leave-management portal. Employees ask for time off, managers approve or turn it down, and everyone can see where their requests stand.

I built this to practice putting a full stack together end to end: authentication, role-based access, a REST API, and a front end that actually feels finished rather than a wall of default form controls.

## What it does

**For employees**

- Create an account and sign in.
- Request leave by picking a type (annual, sick, casual), a date range, and a short reason.
- See a running leave balance that goes down when a request is approved.
- Track requests with filter tabs for Pending, Approved, and Rejected.
- Cancel a request while it's still pending.

**For managers**

- Sign in and see every request from the team in one place.
- Approve a request, or reject it with a reason the employee can read.
- Same Pending / Approved / Rejected filters to move through the queue.

**Behind the scenes**

- JWT auth. The token is attached to every API call automatically, and an expired or invalid token logs you out instead of leaving you stuck on a broken screen.
- Route guards on both sides of the fence: signed-out users can't open a dashboard, and signed-in users get bounced past the login pages straight to where they belong.
- Leave balance is checked on the server, and pending requests are counted too, so you can't queue up more days than you actually have.
- Start dates in the past are rejected by the browser and the API.
- The landing page quietly pings the backend on load. On a free host that sleeps when idle, this wakes the server up while the visitor is still reading, so the first real request isn't slow.

## Live demo

_Add your deployment links here._

Since registration is open (see the note further down), you can create both an employee and a manager account and walk through the whole flow yourself.

## Tech stack

**Front end**

- React 19 with Vite
- React Router for navigation
- Axios for API calls, with request/response interceptors
- Plain CSS with a small set of design tokens (colours, spacing, radius) and the Inter typeface

**Back end**

- Node with Express 5
- MongoDB with Mongoose
- JSON Web Tokens for auth
- bcrypt for password hashing

## How authentication works

1. On login the server verifies the password, signs a JWT that expires in seven days, and returns it along with the user's public details.
2. The front end stores the token and user in `localStorage` and keeps them in React context.
3. An Axios request interceptor adds `Authorization: Bearer <token>` to every call.
4. An Axios response interceptor watches for `401`. If one comes back while a token exists, it clears the session and sends the user to the landing page.
5. `GET /api/users/me` lets the front end pull a fresh copy of the user (mainly to keep the leave balance current after a manager approves something).

## Project structure

```
leaveFlow/
├── backend/
│   ├── controllers/      request handlers (user.js, leave.js)
│   ├── middlewares/       auth + role checks
│   ├── models/           Mongoose schemas (User, Leave)
│   ├── routes/           route definitions
│   └── index.js          app entry, DB connection, error handling
└── frontend/
    └── src/
        ├── api/          axios instance + interceptors
        ├── components/   navbar, user badge, route guards, login form
        ├── context/      auth provider and hook
        ├── pages/        landing, logins, dashboards, request form, 404
        └── utils/        date formatting, API error parsing
```

## API reference

Base path: `/api`

### Users

| Method | Endpoint          | Access        | Purpose                              |
|--------|-------------------|---------------|--------------------------------------|
| POST   | `/users/register` | Public        | Create an account                    |
| POST   | `/users/login`    | Public        | Sign in, receive a token             |
| GET    | `/users/me`       | Authenticated | Get the current user                 |
| GET    | `/users/health`   | Public        | Uptime check / cold-start ping       |

### Leave requests

| Method | Endpoint               | Access   | Purpose                                  |
|--------|------------------------|----------|------------------------------------------|
| POST   | `/leaves/request`      | Employee | Submit a new request                     |
| GET    | `/leaves/my`           | Employee | List your own requests                   |
| PATCH  | `/leaves/:id/cancel`   | Employee | Cancel one of your pending requests      |
| GET    | `/leaves/all`          | Manager  | List every request (cancelled excluded)  |
| PATCH  | `/leaves/:id/approve`  | Manager  | Approve a pending request                |
| PATCH  | `/leaves/:id/reject`   | Manager  | Reject a pending request (with a reason) |
| GET    | `/leaves/health`       | Public   | Uptime check                             |

## Data models

**User**

| Field        | Type   | Notes                                    |
|--------------|--------|------------------------------------------|
| name         | string | required                                 |
| email        | string | required, unique, lowercased             |
| password     | string | stored hashed                            |
| role         | string | `employee` or `manager`, default employee|
| leaveBalance | number | default 20                               |

**Leave**

| Field        | Type   | Notes                                                  |
|--------------|--------|--------------------------------------------------------|
| employee     | ref    | points to a User                                       |
| leaveType    | string | `annual`, `sick`, or `casual`                          |
| startDate    | date   | required                                               |
| endDate      | date   | required                                               |
| days         | number | inclusive day count between start and end              |
| description  | string | required                                               |
| status       | string | `pending`, `approved`, `rejected`, or `cancelled`      |
| reviewReason | string | set when a manager rejects                             |
| reviewedAt   | date   | set on approve or reject                               |

The day count is simple on purpose: it counts every calendar day from start to end, weekends and public holidays included. Making it calendar-aware is on the list below.

## Running it locally

You'll need Node 18+ and a MongoDB connection string (a free Atlas cluster works fine).

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PORT=9090
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
```

```bash
npm run dev      # nodemon, restarts on change
# or
npm start        # plain node
```

The server exits straight away if it can't reach MongoDB, so a bad connection string fails loudly instead of hanging.

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:9090/api
```

```bash
npm run dev      # dev server
npm run build    # production build into dist/
npm run preview  # serve the build locally
```

## Deployment

**Front end** goes on any static host. Point `VITE_API_BASE_URL` at the deployed API before building. `public/_redirects` and `vercel.json` are included so client-side routes don't 404 on a hard refresh.

**Back end** goes on any Node host. Set `MONGO_URL`, `JWT_SECRET`, and `PORT`, and run `npm start`. If the API and the front end sit on different domains, CORS is already open, so nothing extra is needed there.

## A note on open registration

Anyone can register as either an employee **or** a manager right now. That's deliberate. This is a portfolio project, and I want whoever is looking at it to be able to create both kinds of account and try the full workflow without me handing out credentials.

In a real deployment that would be locked down. Employee sign-up would go through an invite or an HR import, and manager accounts would only be created by an admin or another manager. The role field already exists on the user model, so the change is mostly about who is allowed to hit the register endpoint and with what role.

## Ideas for later

Things I'd add if this were going further:

- **Manager-only onboarding** — invite links for employees, admin-created manager accounts.
- **Notifications** — email the employee when their request is approved or rejected.
- **A calendar view** — see who's off this week at a glance, per team.
- **Smarter day counting** — skip weekends and configurable public holidays.
- **Per-type balances** — separate pools for annual, sick, and casual leave, with an annual reset or monthly accrual.
- **Half-day requests.**
- **Search and pagination** on the manager dashboard once the request list grows.
- **CSV export** for records and reporting.
- **An account page** — change your password, update your name.
- **Sturdier auth** — move the token to an httpOnly cookie and add refresh tokens.
- **Tests** — unit tests on the controllers and a couple of end-to-end flows.
- **A dark theme** — the token setup is already there for it.

## Author

Built by Saim.
