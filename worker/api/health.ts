// GET /api/health - simplest possible endpoint. Copy this file to start a new API, then register it in worker/index.ts.
import { json, type Handler } from '../lib';

export const GET: Handler = () => json({ ok: true, time: new Date().toISOString() });
