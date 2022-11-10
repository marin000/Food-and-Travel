import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card } from 'primereact/card';
import styles from '../styles/404.module.css';
import getConfig from 'next/config';
const { publicRuntimeConfig: { notFoundPage: { title, text } } } = getConfig();

export default function NotFound() {

  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }, [])

  return (
    <div className="childrenContent">
      <Card>
        <h1 className={styles.notFoundTitle}>{title}</h1>
        <h2 className={styles.notFoundText}>{text}</h2>
      </Card>
    </div>
  )
}