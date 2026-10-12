# Power Pulse - Load Shedding & Power Management Platform ⚡

**Live demo:** [Click here to view](https://next-level-assignment-7.vercel.app)

---

## Table of Contents

- [About the Project](#about-the-project)
- [User Roles and Features](#user-roles-and-features)
- [How an Outage Is Handled](#how-an-outage-is-handled)
- [Public Features](#public-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [How the API Connection Works](#how-the-api-connection-works)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Author](#author)

---

## About the Project

**Power Pulse** is a load shedding and power outage management platform. It keeps the public informed about power zones, load shedding schedules and planned outages, lets customers report outages, and gives admins and technicians the tools to manage the network and restore supply.

This repository is the **frontend** (Next.js). The backend API is deployed separately on Vercel.

---

## User Roles and Features

Power Pulse has three roles: **Admin**, **Technician** and **Customer**. Customers and technicians can register from the app; each role gets its own dashboard.

### Admin

- **User management:** view all users and **ban or unban** them
- **Power distribution infrastructure:** create and manage **zones, substations, areas and feeders**
- **Load shedding schedules:** add schedules to manage power supply, update them and manage existing ones
- **Planned outages:** create planned outages when power must be shut down for maintenance or other reasons, and manage them
- **Reported outages:** see every **unexpected outage** reported by customers and **assign a technician** to each one
- **Technician management:** **approve or reject** technician profiles

### Technician

- **Professional profile:** add and update experience, expertise and upload a **resume**
- **Assigned outages:** see the outages assigned to them
- **Status updates:** update an assigned outage to **In Progress** or **Restored**

### Customer

- **Report outages:** report unexpected power outages
- **Track reports:** see all outages they have reported
- **Priority outages:** pay to mark an outage as **high priority** so it is handled sooner (payments via **SSLCommerz**)
- **Payment history:** view all payments from the dashboard

### All roles

- Update profile **picture and name** from **Settings**
- View profile details
- Secure login with email and password or Google

---

## How an Outage Is Handled

1. A **customer** reports an unexpected outage.
2. The customer can optionally **pay through SSLCommerz** to make the outage high priority.
3. The **admin** reviews the reported outage and **assigns a technician**.
4. The **technician** sees the assignment and updates the status to **In Progress**.
5. When power is back, the technician marks the outage as **Restored**.

---

## Public Features

- **Home overview** with live counts of power zones, load shedding events, planned outages and technicians
- **Upcoming load shedding** section with the next scheduled power cuts
- **Power zones explorer** with search, sorting (created or updated, ascending or descending) and pagination
- **Load shedding schedule** and **planned outage** pages, each with a detail view (affected area, start and end time, status)
- **Report an outage** call to action
- **Authentication:** email and password, **Google sign-in**, and **email OTP verification** with a resend timer
- **Route protection:** role-based guards (`ADMIN`, `TECHNICIAN`, `CUSTOMER`) with a **redirect back to the page you originally wanted** after login or registration
- **Payment result pages** for success, failed and cancelled payments
- Responsive design with a mobile navigation drawer, light and dark theme, animations, skeleton loaders, a global loading screen and a custom error page with retry

---

## Tech Stack

| Area | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, [shadcn/ui](https://ui.shadcn.com/), Base UI, `tw-animate-css` |
| Data fetching | TanStack Query, [ofetch](https://github.com/unjs/ofetch) |
| Forms and validation | TanStack Form, [Zod](https://zod.dev/) |
| Charts | Recharts |
| Animation | [Motion](https://motion.dev/) |
| Auth | Cookie-based sessions, Google OAuth (`@react-oauth/google`), `input-otp` for email verification |
| Payments | SSLCommerz |
| Theming | `next-themes` |
| Notifications | Sonner |
| Icons | Lucide, React Icons |
| Images | Cloudinary and ImgBB hosted images via `next/image` |
| Code quality | Biome |
| Package manager | Bun |

---

## Getting Started

### Prerequisites

- **Node.js 20 or newer** and **[Bun](https://bun.sh/)** (the project uses `bun@1.4.2`; npm also works)
- A running instance of the **Power Pulse backend API**
- A **Google OAuth Client ID** for Google sign-in

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/khalidhossain5000/Next-Level-Assignment-7.git
   cd Next-Level-Assignment-7
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

   Using npm instead: `npm install`

3. **Create your environment file**

   Create a `.env` file in the project root and add the variables described in [Environment Variables](#environment-variables).

4. **Start the development server**

   ```bash
   bun run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production (optional)**

   ```bash
   bun run build
   bun run start
   ```

---

## Environment Variables

Create a `.env` file in the root of the project:

```dotenv
# Backend core URL only. Do NOT add /api/v1 at the end.
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# API base path. This must be exactly /api/v1 (not a full URL).
NEXT_PUBLIC_BASE_URL_Production=/api/v1

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Tester accounts (optional demo logins)
TESTER_ADMIN_EMAIL=
TESTER_ADMIN_PASSWORD=
TESTER_CUSTOMER_EMAIL=
TESTER_CUSTOMER_PASSWORD=
TESTER_TECHNICIAN_EMAIL=
TESTER_TECHNICIAN_PASSWORD=
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Yes | Core URL of the backend server, **without** `/api/v1`. Example: `https://your-backend.vercel.app` |
| `NEXT_PUBLIC_BASE_URL_Production` | Yes | API base path. **Must be exactly `/api/v1`**, not the full backend URL. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID used for "Continue with Google". |
| `TESTER_ADMIN_EMAIL` / `TESTER_ADMIN_PASSWORD` | Optional | Credentials of a demo admin account. |
| `TESTER_CUSTOMER_EMAIL` / `TESTER_CUSTOMER_PASSWORD` | Optional | Credentials of a demo customer account. |
| `TESTER_TECHNICIAN_EMAIL` / `TESTER_TECHNICIAN_PASSWORD` | Optional | Credentials of a demo technician account. |

> **Important:** variables starting with `NEXT_PUBLIC_` are embedded in the browser bundle, so never put secrets in them. Restart the dev server after changing any `.env` value.

---

## How the API Connection Works

The frontend never calls the backend URL directly. Instead, `next.config.ts` rewrites every request that starts with `/api/v1` to the backend:

```ts
async rewrites() {
  return [
    {
      source: "/api/v1/:path*",
      destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/:path*`,
    },
  ];
}
```

```text
Browser  ──►  /api/v1/zone  (same origin as the website)
                 │  Next.js rewrite
                 ▼
Backend  ──►  {NEXT_PUBLIC_BACKEND_URL}/api/v1/zone
```

This is why `NEXT_PUBLIC_BASE_URL_Production` is only `/api/v1` and `NEXT_PUBLIC_BACKEND_URL` has no `/api/v1`: the frontend sends relative requests and Next.js adds the backend address. Because the browser sees these requests as same-origin, authentication cookies are sent reliably.

Remote images are allowed from `res.cloudinary.com` and `i.ibb.co.com` (see `images.remotePatterns` in `next.config.ts`). Add any new image host there.

---

## Available Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start the development server |
| `bun run build` | Create an optimized production build |
| `bun run start` | Run the production build locally |
| `bun run lint` | Check the code with Biome |
| `bun run format` | Format the code with Biome |

---

## Project Structure

```text
src/
├── api/                      API request functions
├── app/
│   ├── (dashboard)/
│   │   ├── admin/            Admin dashboard
│   │   ├── customer/         Customer dashboard
│   │   ├── technician/       Technician dashboard
│   │   ├── settings/         Profile settings (all roles)
│   │   ├── layout.tsx
│   │   └── loading.tsx
│   ├── (public)/
│   │   ├── (authentication)/ Login, register, role selection, OTP verification
│   │   ├── (marketing)/      Home, zones, schedules, planned outages
│   │   └── loading.tsx
│   ├── error.tsx             Global error page
│   ├── not-found.tsx         404 page
│   ├── layout.tsx
│   └── globals.css           Theme tokens (light and dark)
├── assets/                   Static assets such as the logo
├── components/
│   ├── auth/                 AuthGuard, RoleGuard
│   ├── form/                 Reusable form components
│   ├── layout/               Navbar, mobile nav, shared layout pieces
│   ├── loader/               Skeleton and loading components
│   ├── modal/                Modals
│   ├── modules/              Feature components
│   └── ui/                   shadcn/ui primitives
├── hooks/                    TanStack Query hooks
├── lib/                      Utilities
├── providers/                App providers (query client, theme, Google OAuth)
├── types/                    Shared TypeScript types
└── validation/               Zod validation schemas
```

---

## Deployment

Both the frontend and the backend are deployed on **Vercel**.

1. Import the repository into Vercel.
2. Add the environment variables from the [table above](#environment-variables) in **Project Settings → Environment Variables**.
3. Make sure `NEXT_PUBLIC_BASE_URL_Production` is `/api/v1` and `NEXT_PUBLIC_BACKEND_URL` is your deployed backend URL without `/api/v1`.
4. Deploy. Every push to the main branch redeploys automatically.

---

## Author

**Khalid Hossain**

- GitHub: [@khalidhossain5000](https://github.com/khalidhossain5000)

---

<p align="center">Built with ⚡ for reliable power management</p>