
// lib/email.ts
import sgMail from '@sendgrid/mail'

export function isEmailConfigured() {
  return Boolean(process.env.SENDGRID_API_KEY && process.env.EMAIL_SENDER)
}

export async function sendMail(to: string, subject: string, html: string) {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('SendGrid non configurato: salto invio email')
    }
    return
  }
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
    const from = process.env.EMAIL_SENDER as string
    await sgMail.send({ to, from, subject, html })
  } catch (err) {
    console.error('Errore invio email:', err)
  }
}
