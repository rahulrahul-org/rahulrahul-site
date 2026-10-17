# rahulrahul.com.au

The portfolio and blog for Rahul, Cloud Data & AI Transformation Leader.

- **Frontend:** [Astro](https://astro.build) (static, fast, SEO-friendly). Plain CSS, no framework lock-in.
- **Blog:** Markdown files in `src/content/blog/`. Each one becomes a page at `/blogs/<file-name>`.
- **Backend API:** a [Cloudflare Worker](https://developers.cloudflare.com/workers/) in `worker/`. Use it to call any third-party API without exposing your keys.
- **Hosting:** Cloudflare Workers, free (see below). The Worker serves the static site and runs `/api/*`.

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
worker/
  index.ts                 <- Worker entry: routes /api/* to handlers, serves the site otherwise
  lib.ts                   <- shared helpers + Env type for secrets
  api/contact.ts           <- POST /api/contact  (contact form -> email via Resend)
  api/example.ts           <- GET  /api/example  (template for calling external APIs)
  api/health.ts            <- GET  /api/health
wrangler.jsonc             <- Cloudflare config (Worker name, assets, variables)
```

## Run locally

Requires Node 20+.

```bash
npm install
npm run dev        # site only, hot reload: http://localhost:4321
npm run preview    # build + site AND /api Worker: http://localhost:8788
npm run deploy     # build + deploy from your machine (after `npx wrangler login`)
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

1. Create `worker/api/stock.ts` and export a handler per HTTP method:

   ```ts
   import { json, type Handler } from '../lib';

   export const GET: Handler = async (request, env) => {
     const res = await fetch('https://api.example.com/data', {
       headers: { Authorization: `Bearer ${env.EXAMPLE_API_KEY}` }, // secret stays on the server
     });
     return json(await res.json());
   };
   ```

2. Register it in `worker/index.ts`: `import * as stock from './api/stock';` and add `'/api/stock': stock` to `routes`.
3. Call it from the page with `fetch('/api/stock')`.

Add new secret names to the `Env` interface in `worker/lib.ts`. Put them in `.dev.vars` locally and in the Cloudflare dashboard for production. `example.ts` is a full working template (it calls a free weather API).

### Enabling the contact form

The form posts to `/api/contact`, which emails you through **Amazon SES** (us-east-1). `rahulrahul.com.au` is already verified there, so no DNS changes are needed. Until the keys below are set, the form falls back to opening the visitor's email app.

1. In AWS IAM, create a user (e.g. `website-contact-form`) with **no console access**, and attach this inline policy so the key can only send mail from the website address:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Action": "ses:SendEmail",
       "Resource": "*",
       "Condition": { "StringEquals": { "ses:FromAddress": "website@rahulrahul.com.au" } }
     }]
   }
   ```

2. Create an access key for that user (use case: "Application running outside AWS").
3. In the Cloudflare dashboard -> Workers & Pages -> your Worker -> Settings -> Variables and Secrets, add both as type **Secret**:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

   `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` and `AWS_REGION` are already set in `wrangler.jsonc`.
4. Secrets take effect immediately; submit the form to test.

If SES is still in its *sandbox*, that's fine: you're only sending to your own verified domain.

## Free hosting: Cloudflare Workers

Why Cloudflare: free for commercial use, static pages and files are served free and without limits, 100,000 API calls/day, free SSL, a global CDN, and free custom domains. (Vercel's free Hobby plan does not allow commercial use, which a consulting portfolio could count as.)

1. Push this folder to GitHub (already done: `rahulrahul-org/rahulrahul-site`).
2. Go to https://dash.cloudflare.com -> **Workers & Pages** -> **Create** -> **Continue with GitHub** and pick the repo.
3. Settings:
   - **Project name:** `rahulrahul-site`. It must match `"name"` in `wrangler.jsonc`. If you pick a different name, change it there too.
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy` (the default)
   - Under advanced settings / build variables, add `NODE_VERSION` = `22` if a build complains about the Node version.
4. Deploy. You get a `https://rahulrahul-site.<your-subdomain>.workers.dev` URL, and every `git push` to `main` redeploys automatically.
5. **Custom domain:** Worker -> **Settings** -> **Domains & Routes** -> **Add** -> **Custom domain**, then add `rahulrahul.com.au` (and `www.rahulrahul.com.au`). The domain's DNS has to be on Cloudflare (free): add the site in Cloudflare and change the nameservers at your .com.au registrar. You keep your registrar; only DNS moves. If you use email on this domain, copy your existing MX/TXT records into Cloudflare DNS **before** you switch nameservers.
