# rahulrahul.com.au

The portfolio and blog for Rahul, Cloud Data & AI Transformation Leader.

- **Frontend:** [Astro](https://astro.build) (static, fast, SEO-friendly). Plain CSS, no framework lock-in.
- **Blog:** Markdown files in `src/content/blog/`. Each one becomes a page at `/blogs/<file-name>`.
- **Backend API:** [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/) in `functions/api/`. Use them to call any third-party API without exposing your keys.
- **Hosting:** Cloudflare Pages, free (see below).

## Project layout

```
src/
  site.ts                  <- your profile content (hero, about, journey, impact, credentials)
  content/blog/*.md        <- blog posts / case studies
  pages/                   <- routes: / , /blogs , /blogs/[slug] , /rss.xml , 404
  components/, layouts/    <- UI pieces
  styles/global.css        <- colours, fonts and design tokens (light + dark)
  assets/rahul.webp        <- profile photo (optimised automatically at build)
public/
  files/Rahul-Resume.pdf   <- resume download
  images/blog/             <- images used inside posts
  _redirects               <- 301s from the old /blogs/blog-article-NNNNN URLs
functions/api/
  contact.ts               <- POST /api/contact  (contact form -> email via Resend)
  example.ts               <- GET  /api/example  (template for calling external APIs)
  health.ts                <- GET  /api/health
  _lib.ts                  <- shared helpers + Env type for secrets
```

## Run locally

Requires Node 20+.

```bash
npm install
npm run dev        # site only, hot reload: http://localhost:4321
npm run preview    # build + site AND /api functions: http://localhost:8788
```

For local secrets, copy `.dev.vars.example` to `.dev.vars` and fill it in (it's git-ignored).

## Common edits

- **Change profile text / stats / jobs:** edit `src/site.ts`.
- **Add a blog post:** create `src/content/blog/my-new-post.md`:

  ```md
  ---
  title: "My new post"
  description: "One or two sentences shown on the card."
  pubDate: 2026-11-01
  tags: ["AWS", "AI"]
  ---
  Your content in Markdown...
  ```

  Put images in `public/images/blog/` and reference them as `![alt](/images/blog/file.png)`. Add `draft: true` to hide a post.
- **Change colours/fonts:** edit the variables at the top of `src/styles/global.css`.

## Adding a backend API

Every file in `functions/api/` is an endpoint. `functions/api/stock.ts` becomes `/api/stock`.

```ts
import { json, type Env } from './_lib';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const res = await fetch('https://api.example.com/data', {
    headers: { Authorization: `Bearer ${env.EXAMPLE_API_KEY}` }, // secret stays on the server
  });
  return json(await res.json());
};
```

Then call it from the page with `fetch('/api/stock')`. Add new secret names to the `Env` interface in `_lib.ts`, put them in `.dev.vars` locally, and in the Cloudflare dashboard for production. `example.ts` is a full working template (it calls a free weather API).

### Enabling the contact form

The form posts to `/api/contact`, which sends you an email through [Resend](https://resend.com) (free: 3,000 emails/month). Until this is configured, the form falls back to opening the visitor's email app.

1. Sign up at resend.com, verify the `rahulrahul.com.au` domain, and create an API key.
2. In Cloudflare Pages -> your project -> Settings -> Variables and Secrets, add:
   - `RESEND_API_KEY` (as a secret)
   - `CONTACT_FROM_EMAIL` = `Website <contact@rahulrahul.com.au>`
   - (`CONTACT_TO_EMAIL` is already set in `wrangler.toml`)
3. Redeploy.

## Free hosting: Cloudflare Pages (recommended)

Why Cloudflare Pages: free for commercial use, unlimited bandwidth, 500 builds/month, 100,000 API calls/day on the free plan, free SSL, a global CDN, and free custom domains. (Vercel's free Hobby plan does not allow commercial use, which a consulting portfolio could count as. Netlify's free plan also works, but its credit limits are tighter.)

1. Push this folder to a GitHub repository (public or private).
2. Go to https://dash.cloudflare.com -> **Workers & Pages** -> **Create** -> **Pages** -> **Connect to Git** and pick the repo.
3. Build settings: Framework preset **Astro**, build command `npm run build`, output directory `dist`. Under environment variables, add `NODE_VERSION` = `22`.
4. Deploy. You get a `https://rahulrahul.pages.dev` URL, and every `git push` redeploys automatically.
5. **Custom domain:** in the Pages project -> **Custom domains** -> add `rahulrahul.com.au` and `www.rahulrahul.com.au`. The easiest route is to move the domain's DNS to Cloudflare (free): add the site in Cloudflare and change the nameservers at your .com.au registrar. You keep your registrar; only DNS moves. If you use email on this domain, copy your existing MX/TXT records into Cloudflare DNS **before** you switch nameservers.

Deploying from your machine without GitHub also works: `npx wrangler login` then `npm run build && npx wrangler pages deploy`.
