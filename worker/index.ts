// Worker entry point. Requests to /api/* come here (see "run_worker_first" in
// wrangler.jsonc); everything else is served straight from the built site in ./dist.
//
// To add an API: create worker/api/<name>.ts exporting GET/POST handlers, then add it below.

import { json, type Env, type Handler } from './lib';
import * as contact from './api/contact';
import * as example from './api/example';
import * as health from './api/health';

type Route = Partial<Record<'GET' | 'POST' | 'PUT' | 'DELETE', Handler>>;

const routes: Record<string, Route> = {
  '/api/contact': contact,
  '/api/example': example,
  '/api/health': health,
};

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const route = routes[pathname.replace(/\/$/, '')];

    if (!route) {
      return pathname.startsWith('/api/') ? json({ error: 'Not found' }, 404) : env.ASSETS.fetch(request);
    }
    const handler = route[request.method as keyof Route];
    if (!handler) return json({ error: 'Method not allowed' }, 405, { allow: Object.keys(route).join(', ') });

    try {
      return await handler(request, env);
    } catch (err) {
      console.error(err);
      return json({ error: 'Internal error' }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
