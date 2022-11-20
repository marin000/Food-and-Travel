import emailjs from '@emailjs/browser';

export function sendBookingEmailToClient(data) {
  const { email, tour } = data;
  const templateParams = { tour, email };

  emailjs.send(
    process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID, 
    process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_CLIENT, 
    templateParams, 
    process.env.NEXT_PUBLIC_EMAIL_KEY)
    .then((result) => {
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });
}

export function sendBookingEmail(data) {
  const { fullName, email, dateOfBirth, adultsNum, childrenNum, tour } = data;
  const templateParams = { fullName, tour, dateOfBirth, adultsNum, childrenNum, email };

  emailjs.send(
    process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID,
    process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_AGENCY,
    templateParams,
    process.env.NEXT_PUBLIC_EMAIL_KEY)
    .then((result) => {
      console.log(result.text);
    }, (error) => {
      console.log(error.text);
    });
}