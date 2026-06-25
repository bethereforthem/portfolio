const nodemailer = require('nodemailer')

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let name, email, message
  try {
    ;({ name, email, message } = JSON.parse(event.body))
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body.' }) }
  }

  if (!name || !email || !message) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Name, email and message are required.' }) }
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:30px 40px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">📬 New Portfolio Message</h1>
        <p style="color:rgba(255,255,255,.75);margin:6px 0 0;">Someone reached out via your contact form</p>
      </div>
      <div style="padding:32px 40px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;color:#6b7280;font-size:13px;font-weight:600;width:90px;vertical-align:top;">FROM</td>
            <td style="padding:10px 0;color:#111827;font-size:15px;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#6b7280;font-size:13px;font-weight:600;vertical-align:top;">EMAIL</td>
            <td style="padding:10px 0;">
              <a href="mailto:${escapeHtml(email)}" style="color:#2563eb;text-decoration:none;font-size:15px;">${escapeHtml(email)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;color:#6b7280;font-size:13px;font-weight:600;vertical-align:top;">MESSAGE</td>
            <td style="padding:10px 0;color:#111827;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</td>
          </tr>
        </table>
        <div style="margin-top:28px;border-top:1px solid #e5e7eb;padding-top:20px;">
          <a href="mailto:${escapeHtml(email)}?subject=Re: Your message"
             style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
            Reply to ${escapeHtml(name)}
          </a>
        </div>
      </div>
      <div style="background:#f3f4f6;padding:16px 40px;text-align:center;color:#9ca3af;font-size:12px;">
        Sent from your portfolio contact form · David Kayigamba
      </div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      replyTo: `"${name}" <${email}>`,
      to: process.env.SMTP_USER,
      subject: `New message from ${name}`,
      html,
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    }
  } catch (err) {
    console.error('Email send error:', err)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to send email. Please try again.' }),
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
