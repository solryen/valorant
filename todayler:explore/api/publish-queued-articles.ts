import { isAthensSevenPm, publishNextQueuedArticle, verifyAdminSession } from './_articleGeneration';

function json(res: any, status: number, body: unknown) {
  return res.status(status).json(body);
}

export default async function handler(req: any, res: any) {
  const source = String(req.query.source ?? '');

  if (req.method !== 'GET' && req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed.' });
  }

  if (req.method === 'POST') {
    const authCheck = await verifyAdminSession(process.env, req.headers.authorization ?? null);
    if (!authCheck.ok) {
      return json(res, authCheck.status, { error: authCheck.message });
    }
  } else if (source !== 'cron') {
    return json(res, 400, { error: 'This endpoint only accepts POST or the cron trigger.' });
  } else if (!isAthensSevenPm()) {
    return json(res, 200, { success: true, skipped: true, reason: 'Outside the daily publish window.' });
  }

  try {
    const result = await publishNextQueuedArticle(process.env);
    return json(res, 200, {
      success: true,
      ...result,
    });
  } catch (error) {
    return json(res, 500, {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown queued publish failure.',
    });
  }
}
