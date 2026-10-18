# Movie App

## Deploying a demo to Vercel

Import this repository into Vercel and keep the Vite defaults:

- Framework preset: Vite
- Root directory: `./`
- Build command: `npm run build`
- Output directory: `dist`

Add these server-side environment variables in the Vercel project settings:

- `TMDB_API_READ_ACCESS_TOKEN`
- `GROQ_API_KEY`
- `GROQ_MODEL` (optional; defaults to `openai/gpt-oss-20b`)

Do not add the API credentials with a `VITE_` prefix. The `/api/tmdb` and
`/api/groq/chat/completions` functions use them on the server. Redeploy after
adding or changing environment variables.

The Vercel rewrites in `vercel.json` serve the React app for direct visits and
refreshes, including unknown client-side routes that should display the app's
not-found page. API routes are excluded from the fallback.

For local development, put the same variable names in `.env.local`. The Vite
development proxy uses them without adding the credentials to the browser bundle.

The public chat endpoint limits message length and history, but it does not
provide per-user rate limiting by itself. Before sharing the demo publicly,
create a Vercel Firewall rate-limit rule for `POST /api/groq/chat/completions`
(for example, 5 requests per IP per minute) and configure usage monitoring and
limits with the Groq account.
