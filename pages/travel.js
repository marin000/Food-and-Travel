import { getClient } from "../utils/contentful";
import { DataView } from 'primereact/dataview';
import Link from 'next/link'
import styles from '../styles/Travel.module.css';
import Image from 'next/image';
import getConfig from 'next/config'
const { publicRuntimeConfig: { travelPage: { title } } } = getConfig();

export async function getStaticProps() {

  const client = getClient()
  const travel = await client.getEntries({ content_type: 'travel' });
  const contact = await client.getEntries({ content_type: 'contact' });

  if (!travel || !contact) {
    return {
      redirect: {
        destination: '/page404',
        permanent: false,
      },
    }
  }
  return {
    props: {
      travel: travel.items,
      contact: contact.items[0]
    },
    revalidate: 1
  }
}

export default function Travel({ travel, contact }) {

  const layout = 'grid';

  //travel items
  const itemTemplate = (travel) => {

    const { title, shortDescription, price, slug } = travel.fields;
    const image = travel.fields.image.fields.file;
    return (
      <div className="col-12 md:col-4">
        <div className="product-grid-item card">
          <div className="product-grid-item-content">
            <Link href={`/tours/${slug}`}>
              <img src={`https:${image.url}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={image.url} style={{cursor: 'pointer'}} />
            </Link>
            <Link href={`/tours/${slug}`}>
              <div className="product-name" style={{cursor: 'pointer'}}>{title}</div>
            </Link>
            <div className="product-description">{shortDescription}</div>
          </div>
          <div className="product-grid-item-bottom">
            <span className="product-price">{price}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div  className="childrenContent">
      <div className={styles.titleImgContainer}>
        <div className={styles.title}>
          {title}
        </div>
        <div className={styles.titleImg}>
          <Image
            src="/../public/images/travelImg.jpeg"
            placeholder='blur'
            blurDataURL="/../public/images/travelImg.jpeg"
            alt="menu"
            width={'2000'}
            height={'800'}
          />
        </div>
      </div>
      <div className="dataview-demo">
        <div className="card">
          <DataView value={travel} layout={layout}
            itemTemplate={itemTemplate} rows={9} />
        </div>
      </div>
    </div>
  )
}