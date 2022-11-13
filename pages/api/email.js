import { SMTPClient } from 'emailjs';
import getConfig from 'next/config'
const { publicRuntimeConfig: { email: { host } } } = getConfig();

export default function handler(req, res) {
  const { name, email, subject, message } = req.body;
  const fullSubject = `${name}: ${subject}`;

  const client = new SMTPClient({
    user: process.env.NEXT_PUBLIC_MAIL_USER,
    password: process.env.NEXT_PUBLIC_MAIL_PASS,
    host: host,
    ssl: true
  });

  try {
    client.send(
      {
        text: message,
        from: email,
        to: process.env.NEXT_PUBLIC_MAIL_USER,
        subject: fullSubject,
      }
    )
  }
  catch (e) {
    res.status(400).end(JSON.stringify({ message: "Error" }))
    return;
  }
  res.status(200).end(JSON.stringify({ message: 'Send Mail' }))
}