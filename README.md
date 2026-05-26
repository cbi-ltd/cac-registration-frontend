# CAC Registration Frontend

Frontend application for CAC business registration and onboarding.

Built with Next.js, React, TypeScript, Zustand, and Tailwind CSS.

---

## Features

- Business name registration
- Multi-step registration flow
- Document upload handling
- Zustand persistent state management
- FormData API submission
- Responsive UI

---

## Tech Stack

- Next.js
- React
- TypeScript
- Zustand
- Tailwind CSS

---

## Prerequisites

Ensure the following are installed:

- Node.js >= 18
- pnpm >= 9

Check versions:

```bash
node -v
pnpm -v
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/cbi-ltd/cac-registration-frontend.git
cd cac-registration-frontend
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Copy the example env file and fill in the required values:

```bash
cp .env.example .env.local
```

Required variables:

```env
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_ENV=
```

> ⚠️ Never commit `.env.local` to version control.

### 4. Run the development server

```bash
pnpm dev
```

App will be available at `http://localhost:3000`.

---

## Building for Production

```bash
pnpm build
pnpm start
```

---

## Deployment (AWS — Docker)

`NEXT_PUBLIC_*` variables are baked in at build time and must be passed as build arguments.

### 1. Build the image

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com/api/merchant/ \
  --build-arg NEXT_PUBLIC_ENV=production \
  -t cac-frontend .
```

### 2. Run the container

```bash
docker run -p 3000:3000 cac-frontend
```

---

## Environment Variables Reference

| Variable                   | Required | Description                                              |
| -------------------------- | -------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | ✅       | Base URL of the backend API                              |
| `NEXT_PUBLIC_ENV`          | ✅       | App environment (`development`, `staging`, `production`) |

---

## Scripts

| Command      | Description              |
| ------------ | ------------------------ |
| `pnpm dev`   | Start development server |
| `pnpm build` | Build for production     |
| `pnpm start` | Start production server  |
| `pnpm lint`  | Run ESLint               |
| `pnpm test`  | Run tests (Vitest)       |

---

## Project Structure

```
├── app/               # Next.js App Router pages and layouts
├── components/        # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and API clients
├── styles/            # Global styles
├── public/            # Static assets
├── test/              # Vitest test files
├── .env.example       # Environment variable template
├── Dockerfile         # Docker build configuration
└── next.config.mjs    # Next.js configuration
```

---

## Notes for DevOps

- Requires a **Node.js runtime** — not a static host
- Uses the **App Router** (`/app` directory)
- All API calls route through `NEXT_PUBLIC_API_BASE_URL` — ensure this is set correctly per environment
- File uploads use the **FormData API** — ensure your load balancer/proxy allows large request bodies (recommended: `client_max_body_size 20m` in Nginx)
- App runs on port `3000` by default
