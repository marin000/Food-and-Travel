import { getClient } from "../utils/contentful";
import Image from 'next/image';
import getConfig from 'next/config'
const { publicRuntimeConfig: { contactPage: { title, formTitle, contactTitle, contactAddress } } } = getConfig();
import styles from '../styles/Contact.module.css';
import { Card } from "primereact/card";
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { Divider } from "primereact/divider";
import { GMap } from 'primereact/gmap';
import { loadGoogleMaps, removeGoogleMaps } from '../utils/GoogleMaps';
import Link from 'next/link'
import 'primeicons/primeicons.css';
import axios from 'axios'

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

export default function Contact({ contact }) {

  const titleImage = contact.fields.image.fields;
  const { name, email, telephone, address, location } = contact.fields;
  const [formData, setFormData] = useState({});
  const [showMessage, setShowMessage] = useState(false);
  const [googleMapsReady, setGoogleMapsReady] = useState(false);
  const [overlays, setOverlays] = useState(null);

  const options = {
    center: { lat: location.lat, lng: location.lon },
    zoom: 12
  };

  useEffect(() => {
    loadGoogleMaps(() => {
      setGoogleMapsReady(true);
    });

    return () => {
      removeGoogleMaps();
    }
  }, [])

  const onMapReady = (event) => {
    setOverlays(
      [
        new google.maps.Marker({ position: { lat: location.lat, lng: location.lon }, title: address })
      ]
    );
  }

  const sendMail = async (data) => {
    axios.post('http://localhost:3000/api/email', data)
      .then(
        (res) => {
          setShowMessage(true);
          console.log('Email sent')
        }
      ).catch(
        (e) => console.log(e)
      )
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    },
    validate: (data) => {
      let errors = {};

      if (!data.name) {
        errors.name = 'Name is required.';
      }

      if (!data.email) {
        errors.email = 'Email is required.';
      }
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
        errors.email = 'Invalid email address. E.g. example@email.com';
      }

      if (!data.subject) {
        errors.subject = 'Subject is required.';
      }

      if (!data.message) {
        errors.message = 'Message is required.';
      }

      return errors;
    },
    onSubmit: (data) => {
      setFormData(data);
      formik.resetForm();
      sendMail(data);
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
        <div className={styles.title}>
          {title}
        </div>
        <div className={styles.titleImg}>
          <Image
            src={`https:${titleImage.file.url}`}
            placeholder='blur'
            blurDataURL={`https:${titleImage.file.url}`}
            alt={titleImage.title}
            width={'2000'}
            height={'800'}
          />
        </div>
      </div>
      <div className={styles.formContact}>
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
                <h2>{formTitle}</h2>
                <form onSubmit={formik.handleSubmit} className="p-fluid">
                  <div className="field">
                    <span className="p-float-label">
                      <InputText id="name" name="name" value={formik.values.name} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('name') })} />
                      <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid('name') })}>Name*</label>
                    </span>
                    {getFormErrorMessage('name')}
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
                      <InputText id="subject" name="subject" value={formik.values.subject} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('subject') })} />
                      <label htmlFor="subject" className={classNames({ 'p-error': isFormFieldValid('subject') })}>Subject*</label>
                    </span>
                    {getFormErrorMessage('subject')}
                  </div>
                  <div className="field">
                    <span className="p-float-label">
                      <InputTextarea id="message" name="message" value={formik.values.message} rows={5} cols={40} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('message') })} />
                      <label htmlFor="message" className={classNames({ 'p-error': isFormFieldValid('message') })}>Message*</label>
                    </span>
                    {getFormErrorMessage('message')}
                  </div>
                  <Button type="submit" label="Send" className="mt-2" />
                </form>
              </div>
            </div>
          </div>
        </Card>
        <Card className={styles.contact}>
          <h2>{contactTitle}</h2>
          <div><h4>Name: </h4>{name}</div>
          <div><h4>Email: </h4>{email}</div>
          <div><h4>Phone: </h4>{telephone}</div>
          <Divider />
          <Link href={'#'}>
            <i className="pi pi-facebook" style={{ 'fontSize': '2em', 'marginRight': '1rem', 'cursor': 'pointer' }}></i>
          </Link>
          <Link href={'#'}>
            <i className="pi pi-instagram" style={{ 'fontSize': '2em', 'cursor': 'pointer' }}></i>
          </Link>
          <Divider />
          <h2>{contactAddress}</h2>
          <div>{address}</div>
          <Divider />
          <div className={styles.contactMap}>
            {
              googleMapsReady && (
                <div className="card">
                  <GMap overlays={overlays} options={options} style={{ width: '100%', minHeight: '200px' }} onMapReady={onMapReady} />
                </div>
              )
            }
          </div>
        </Card>
      </div>
    </div>
  )
}
