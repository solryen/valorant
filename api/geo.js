export default function handler(req, res) {
  const country = String(req.headers['x-vercel-ip-country'] ?? '').toUpperCase()
  const language = country === 'GR' ? 'el' : 'en'

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json({ country, language })
}
