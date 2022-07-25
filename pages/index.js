import { getClient, getEntries } from "../utils/contentful";
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export async function getStaticProps() {

  const client = getClient()
  const result = getEntries(client, 'homePage')
  return result
}

export default function Home({ result }) {
  const homeData = result[0];
  const titleImage = homeData.fields.titleImage.fields;
  console.log(homeData)
  return (
    <div>
      <Card>
        <div className={styles.titleImgContainer}>
          <div className={styles.title}>
            {homeData.fields.title}
          </div>
          <div className={styles.titleImg}>
            <Image
              src={`https:${titleImage.file.url}`}
              alt={titleImage.title}
              width={titleImage.file.details.image.width}
              height={'800px'}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
