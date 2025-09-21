
import sgMail from '@sendgrid/mail'
export function isEmailConfigured(){ return !!process.env.SENDGRID_API_KEY && !!process.env.EMAIL_SENDER }
export async function sendMail(to:string, subject:string, html:string){
  if(!isEmailConfigured()) return
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)
  await sgMail.send({ to, from: process.env.EMAIL_SENDER as string, subject, html })
}
