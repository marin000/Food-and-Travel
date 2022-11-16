import { getClient } from "../utils/contentful";
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import Link from 'next/link'
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import getConfig from 'next/config'
import { Divider } from "primereact/divider";
const { publicRuntimeConfig: { homePage: { toursButton, contactText, contactButton, menuButton } } } = getConfig();

export async function getStaticProps() {

  const client = getClient()
  const home = await client.getEntries({ content_type: 'homePage' });
  const menu = await client.getEntries({ content_type: 'menu' });
  const contact = await client.getEntries({ content_type: 'contact' });

  if (!home || !menu || !contact) {
    return {
      redirect: {
        destination: '/page404',
        permanent: false,
      },
    }
  }
  return {
    props: {
      home: home.items[0],
      menu: menu.items,
      contact: contact.items[0]
    },
    revalidate: 1
  }
}
export default function Home({ home, menu, contact }) {
  const homeData = home.fields;
  const titleImage = homeData.titleImage.fields;
  const travelImage = homeData.travelImage.fields;
  const layout = 'grid';

  // menu items
  const itemTemplate = (menu) => {

    const { title, description, price, onHome } = menu.fields;
    const image = menu.fields.image.fields.file;
    if (onHome) {
      return (
        <div className="col-12 md:col-4">
          <div className="product-grid-item card">
            <div className="product-grid-item-content">
              <img src={`https:${image.url}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={image.url} />
              <div className="product-name">{title}</div>
              <div className="product-description">{description}</div>
            </div>
            <div className="product-grid-item-bottom">
              <span className="product-price">{price}</span>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      <div className={styles.titleImgContainer}>
        <div className={styles.title}>
          {homeData.title}
        </div>
        <div className={styles.titleImg}>
          <Image
            src={`https:${titleImage.file.url}`}
            placeholder='blur'
            blurDataURL={`https:${titleImage.file.url}`}
            alt={titleImage.title}
            width={titleImage.file.details.image.width}
            height={'900px'}
          />
        </div>
      </div>
      <div className="dataview-demo">
        <div className="card">
          <DataView value={menu} layout={layout}
            itemTemplate={itemTemplate} rows={9} />
          <Card className={styles.menuButton}>
            <Link href={'/menu'}>
              <Button label={menuButton} className="p-button-outlined p-button-warning p-button" />
            </Link>
          </Card>
        </div>
      </div>
      <Divider />
      <div className="card">
        <Splitter style={{ height: '300px' }}>
          <SplitterPanel className="flex align-items-center justify-content-center">
            <div className={styles.travelSplitter}>
              <h1 className={styles.travelTitle}>{homeData.travelTitle}</h1>
              <p>{homeData.travelDescription}</p>
              <Link href={'/travel'}>
                <Button label={toursButton} className="p-button-outlined p-button-warning" />
              </Link>
            </div>
          </SplitterPanel>
          <SplitterPanel className="flex align-items-center justify-content-center">
            <Image
              src={`https:${travelImage.file.url}`}
              placeholder='blur'
              blurDataURL={`https:${travelImage.file.url}`}
              alt={travelImage.title}
              width={travelImage.file.details.image.width}
              height={'800px'}
            />
          </SplitterPanel>
        </Splitter>
      </div>
      <Divider />
      <Card>
        <div className={styles.contact}>
          <h2 className={styles.contactTitle}>{contactText}</h2>
          <Link href={'/contact'}>
            <Button label={contactButton} className="p-button-outlined p-button-warning" />
          </Link>
        </div>
      </Card>
    </div>
  )
}
