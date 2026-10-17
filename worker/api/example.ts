// GET /api/example?city=Melbourne
//
// Template for calling any third-party API from the backend, so API keys never reach the
// browser. The browser calls /api/example; this function calls the real API with the
// secret from env, caches the result at the edge, and returns only what the page needs.
//
// This demo uses Open-Meteo (free, no key). To call an API that needs a key, put the key in
// EXAMPLE_API_KEY (Cloudflare dashboard or .dev.vars) and send it as shown below.

import { json, type Handler } from '../lib';

export const GET: Handler = async (request, env) => {
  const url = new URL(request.url);
  const city = (url.searchParams.get('city') || 'Melbourne').slice(0, 60);

  // 1. Geocode the city name
  const geo = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?count=1&name=${encodeURIComponent(city)}`,
  ).then((r) => r.json<{ results?: { latitude: number; longitude: number; name: string; country: string }[] }>());
  const place = geo.results?.[0];
  if (!place) return json({ error: `Unknown city: ${city}` }, 404);

  // 2. Call the upstream API. For a keyed API you would add e.g.
  //    headers: { Authorization: `Bearer ${env.EXAMPLE_API_KEY}` }
  const upstream = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,wind_speed_10m`,
    { cf: { cacheTtl: 300, cacheEverything: true } }, // cache upstream response for 5 minutes
  );
  if (!upstream.ok) return json({ error: 'Upstream API failed' }, 502);
  const data = await upstream.json<{ current: { temperature_2m: number; wind_speed_10m: number } }>();

  // 3. Return a trimmed response to the browser
  return json(
    {
      city: `${place.name}, ${place.country}`,
      temperatureC: data.current.temperature_2m,
      windKmh: data.current.wind_speed_10m,
      usingKey: Boolean(env.EXAMPLE_API_KEY),
    },
    200,
    { 'cache-control': 'public, max-age=300' },
  );
};
