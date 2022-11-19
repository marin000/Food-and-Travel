import { SMTPClient } from 'emailjs';
import getConfig from 'next/config'
const { publicRuntimeConfig: {
  email: { host },
  emailBooking: { dateText, adultsText, childrenText, emailText, clientSubjectText, clientMessage } } }
  = getConfig();

export default function handler(req, res) {
  const { fullName, email, dateOfBirth, adultsNum, childrenNum, tour } = req.body;
  const fullSubject = `${fullName}: ${tour}`;
  const fullText = `  ${dateText} ${dateOfBirth}\n
    ${adultsText} ${adultsNum}\n
    ${childrenText} ${childrenNum}\n
    ${emailText} ${email}`;

  const fullSubjectClient = `${clientSubjectText} ${tour}`;
  const fullTextClient = clientMessage;

  const client = new SMTPClient({
    user: process.env.NEXT_PUBLIC_MAIL_USER,
    password: process.env.NEXT_PUBLIC_MAIL_PASS,
    host: host,
    ssl: true
  });

  try {
    client.send(
      {
        text: fullText,
        from: email,
        to: process.env.NEXT_PUBLIC_MAIL_USER,
        subject: fullSubject,
      }
    )
    client.send(
      {
        text: fullTextClient,
        from: process.env.NEXT_PUBLIC_MAIL_USER,
        to: email,
        subject: fullSubjectClient
      }
    )
  }
  catch (e) {
    res.status(400).end(JSON.stringify({ message: "Error" }))
    return;
  }
  res.status(200).end(JSON.stringify({ message: 'Send Mail' }))
}