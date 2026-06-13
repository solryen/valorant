function readSupabaseUrl() {
  return (
    process.env.SUPABASE_URL ??
    process.env.EXPO_PUBLIC_SUPABASE_URL ??
    process.env.VITE_SUPABASE_URL ??
    ''
  ).trim().replace(/\/$/, '');
}

function readSupabaseAnonKey() {
  return (
    process.env.SUPABASE_ANON_KEY ??
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY ??
    ''
  ).trim();
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, apikey, content-type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).send('ok');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed.' });
    return;
  }

  const supabaseUrl = readSupabaseUrl();
  const supabaseAnonKey = readSupabaseAnonKey();

  if (!supabaseUrl || !supabaseAnonKey) {
    res.status(500).json({ error: 'Supabase proxy is not configured.' });
    return;
  }

  const authorization = req.headers.authorization ?? '';
  if (!authorization) {
    res.status(401).json({ error: 'Missing authorization header.' });
    return;
  }

  const upstream = await fetch(`${supabaseUrl}/functions/v1/article-sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: authorization,
    },
    body: JSON.stringify(req.body ?? {}),
  });

  const responseText = await upstream.text();
  res.status(upstream.status);

  const contentType = upstream.headers.get('content-type');
  if (contentType) {
    res.setHeader('Content-Type', contentType);
  } else {
    res.setHeader('Content-Type', 'application/json');
  }

  res.send(responseText);
}
