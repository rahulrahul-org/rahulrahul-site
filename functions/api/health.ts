// GET /api/health - simplest possible endpoint. Copy this file to start a new API.
import { json } from './_lib';

export const onRequestGet: PagesFunction = () => json({ ok: true, time: new Date().toISOString() });
