import React, { useState } from 'react';
import { getClient } from "../utils/contentful";
import { useRouter } from "next/router";
import Image from 'next/image';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { Card } from "primereact/card";
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import styles from '../styles/Booking.module.css';
import getConfig from 'next/config'
const { publicRuntimeConfig: { booking: { button } } } = getConfig();
import { format } from 'date-fns';
import { sendBookingEmail, sendBookingEmailToClient } from '../utils/email'

export async function getStaticProps() {

  const client = getClient()
  const contact = await client.getEntries({ content_type: 'contact' });

  if (!contact) {
    return {
      redirect: {
        destination: '/page404',
        permanent: false,
      },
    }
  }
  return {
    props: {
      contact: contact.items[0]
    },
    revalidate: 1
  }
}

export default function Booking({ contact }) {

  const router = useRouter();
  const tour = router.query.name;
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const [adultsNum, setAdultsNum] = useState(0);
  const [childrenNum, setChildrenNum] = useState(0);
  const titleImage = `/..${process.env.NEXT_PUBLIC_IMG_PREFIX}/images/booking.jpg`;

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: null
    },
    validate: (data) => {
      let errors = {};

      if (!data.firstName) {
        errors.firstName = 'First name is required.';
      }

      if (!data.lastName) {
        errors.lastName = 'Last name is required.';
      }

      if (!data.email) {
        errors.email = 'Email is required.';
      }

      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
        errors.email = 'Invalid email address. E.g. example@email.com';
      }

      if (!data.dateOfBirth) {
        errors.dateOfBirth = 'Date of birth is required.';
      }

      return errors;
    },
    onSubmit: (data) => {
      setFormData(data);
      const emailData = {
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        dateOfBirth: format(data.dateOfBirth, 'dd/MM/yyyy'),
        adultsNum,
        childrenNum,
        tour
      };
      const emailDataClient = { tour, email: data.email };
      sendBookingEmail(emailData);
      sendBookingEmailToClient(emailDataClient)
      formik.resetForm();
      setAdultsNum(0);
      setChildrenNum(0);
    }
  });

  const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;
  const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
    return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
  };

  return (
    <div className="childrenContent">
      <div className={styles.titleImgContainer}>
        <div className={styles.titleImg}>
          <Image
            src={titleImage}
            placeholder='blur'
            blurDataURL={titleImage}
            alt="booking"
            width={'2000'}
            height={'800'}
          />
        </div>
      </div>
      <Card>
        <div className="form-demo">
          <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
            <div className="flex align-items-center flex-column pt-6 px-3">
              <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
              <h5>Email sent!</h5>
            </div>
          </Dialog>
          <div className="flex justify-content-center">
            <div className="card">
              <h2>{tour}</h2>
              <form onSubmit={formik.handleSubmit} className="p-fluid">
                <div className="field">
                  <span className="p-float-label">
                    <InputText id="firstName" name="firstName" value={formik.values.firstName} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('firstName') })} />
                    <label htmlFor="firstName" className={classNames({ 'p-error': isFormFieldValid('firstName') })}>First name*</label>
                  </span>
                  {getFormErrorMessage('firstName')}
                </div>
                <div className="field">
                  <span className="p-float-label">
                    <InputText id="lastName" name="lastName" value={formik.values.lastName} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('lastName') })} />
                    <label htmlFor="lastName" className={classNames({ 'p-error': isFormFieldValid('lastName') })}>Last name*</label>
                  </span>
                  {getFormErrorMessage('lastName')}
                </div>
                <div className="field">
                  <span className="p-float-label p-input-icon-right">
                    <i className="pi pi-envelope" />
                    <InputText id="email" name="email" value={formik.values.email} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('email') })} />
                    <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid('email') })}>Email*</label>
                  </span>
                  {getFormErrorMessage('email')}
                </div>
                <div className="field">
                  <span className="p-float-label">
                    <Calendar id="dateOfBirth" name="dateOfBirth" value={formik.values.dateOfBirth} onChange={formik.handleChange} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon className={classNames({ 'p-invalid': isFormFieldValid('dateOfBirth') })} />
                    <label htmlFor="dateOfBirth">Date of birth*</label>
                  </span>
                  {getFormErrorMessage('dateOfBirth')}
                </div>
                <div className="grid p-fluid">
                  <div className="field col-12 md:col-3">
                    <label htmlFor="adults">Adults</label>
                    <InputNumber inputId="adults" value={adultsNum} onValueChange={(e) => setAdultsNum(e.value)} showButtons buttonLayout="horizontal" step={1}
                      decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" mode='decimal' min={0} max={20} />
                  </div>
                  <div className="field col-12 md:col-3">
                    <label htmlFor="children">Children</label>
                    <InputNumber inputId="children" value={childrenNum} onValueChange={(e) => setChildrenNum(e.value)} showButtons buttonLayout="horizontal" step={1}
                      decrementButtonClassName="p-button-danger" incrementButtonClassName="p-button-success" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" mode='decimal' min={0} max={20} />
                  </div>
                </div>
                <Button type="submit" label={button} className="mt-2" />
              </form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

}