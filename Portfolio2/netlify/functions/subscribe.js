const nodemailer = require('nodemailer')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let email
  try {
    ;({ email } = JSON.parse(event.body))
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body.' }) }
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'A valid email address is required.' }) }
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const subscribedAt = new Date().toLocaleString('en-US', {
    timeZone: 'Africa/Kigali',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Subscriber</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f0f4ff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4ff;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(37,99,235,0.12);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1d4ed8 0%,#7c3aed 60%,#9333ea 100%);padding:40px 40px 32px;text-align:center;">
              <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;background:rgba(255,255,255,0.15);border-radius:50%;margin-bottom:16px;">
                <span style="font-size:28px;">🔔</span>
              </div>
              <h1 style="color:#ffffff;margin:0 0 8px;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
                New Subscriber! 🎉
              </h1>
              <p style="color:rgba(255,255,255,0.8);margin:0;font-size:15px;">
                Someone just joined your portfolio newsletter
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">

              <!-- Subscriber card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff;border:1.5px solid #dbeafe;border-radius:12px;margin-bottom:28px;overflow:hidden;">
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;">
                      Subscriber Email
                    </p>
                    <p style="margin:0;font-size:20px;font-weight:700;color:#1d4ed8;">
                      <a href="mailto:${escapeHtml(email)}" style="color:#1d4ed8;text-decoration:none;">
                        ${escapeHtml(email)}
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#eff6ff;padding:14px 28px;border-top:1px solid #dbeafe;">
                    <p style="margin:0;font-size:12px;color:#6b7280;">
                      <strong style="color:#374151;">Subscribed on:</strong>&nbsp; ${subscribedAt} (EAT)
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;" />

              <!-- Quick reply CTA -->
              <p style="margin:0 0 20px;font-size:14px;color:#4b5563;line-height:1.6;">
                This subscriber is interested in your new projects and tech articles.
                You can reach out to them directly by clicking the button below.
              </p>
              <div style="text-align:center;margin-bottom:8px;">
                <a href="mailto:${escapeHtml(email)}?subject=Welcome to my newsletter!"
                   style="display:inline-block;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#ffffff;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.02em;box-shadow:0 4px 14px rgba(37,99,235,0.35);">
                  ✉️ &nbsp;Say Hello to Subscriber
                </a>
              </div>
            </td>
          </tr>

          <!-- Stats strip -->
          <tr>
            <td style="background:#f8faff;border-top:1px solid #e5e7eb;padding:20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align:center;padding:0 12px;">
                    <p style="margin:0;font-size:22px;">🌍</p>
                    <p style="margin:4px 0 0;font-size:11px;color:#6b7280;font-weight:600;">Rwanda, Kigali</p>
                  </td>
                  <td style="text-align:center;padding:0 12px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
                    <p style="margin:0;font-size:22px;">💼</p>
                    <p style="margin:4px 0 0;font-size:11px;color:#6b7280;font-weight:600;">David Kayigamba</p>
                  </td>
                  <td style="text-align:center;padding:0 12px;">
                    <p style="margin:0;font-size:22px;">🚀</p>
                    <p style="margin:4px 0 0;font-size:11px;color:#6b7280;font-weight:600;">Portfolio Newsletter</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1e293b;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                This notification was sent from your
                <strong style="color:#e2e8f0;">Portfolio Newsletter</strong> system.<br />
                David Kayigamba &middot; Software Developer &middot; Kigali, Rwanda
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  try {
    await transporter.sendMail({
      from: `"Portfolio Newsletter" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `🔔 New subscriber: ${email}`,
      html,
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    }
  } catch (err) {
    console.error('Subscribe email error:', err)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to process subscription. Please try again.' }),
    }
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
