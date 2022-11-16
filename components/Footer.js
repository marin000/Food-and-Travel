import Link from 'next/link'
import { Divider } from "primereact/divider";
import getConfig from 'next/config'
const { publicRuntimeConfig: { footer: { title } } } = getConfig();
import styles from '../styles/Footer.module.css';
import 'primeicons/primeicons.css';

export default function Footer({ props }) {

  const { email, telephone, address } = props.contact.fields;

  return (
    <footer>
        <div className={styles.footerContainer}>
          <h3 className={styles.footerTitle}>{title}</h3>
          <p className={styles.footerText}>Email: {email}</p>
          <p className={styles.footerText}>Tel: {telephone}</p>
          <p className={styles.footerText}>Address: {address}</p>
          <Link href={'#'}>
            <i className="pi pi-facebook" style={{ 'fontSize': '2em', 'marginRight': '1rem', 'cursor': 'pointer', color: 'white' }}></i>
          </Link>
          <Link href={'#'}>
            <i className="pi pi-instagram" style={{ 'fontSize': '2em', 'cursor': 'pointer', color: 'white' }}></i>
          </Link>
        </div>
      <Divider />
      <div className={styles.footerCopyright}>Copyright 2022 Marin</div>
    </footer>
  );
}