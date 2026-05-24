# Portfolio Next

Next.js 16 rebuild of the Adela portfolio.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- Framer Motion

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev
```

The app expects the existing backend to stay available at `BACKEND_URL`.

## Notes

- Public pages fetch blog/testimonial content server-side where possible.
- Client-side submissions and admin actions use Next route handlers as proxies so the existing backend can remain unchanged.
- The app lives beside the Vite frontend during migration.
