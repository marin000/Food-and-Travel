import { getClient, getEntries } from "../utils/contentful";
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export async function getStaticProps() {

  const client = getClient()
  const home = await client.getEntries({ content_type: 'homePage' });
  const menu = await client.getEntries({ content_type: 'menu' });
  return {
    props: {
      home: home.items,
      menu: menu.items
    },
    revalidate: 1
  }
}

export default function Home({ home, menu }) {
  console.log(menu)
  const homeData = home[0];
  const titleImage = homeData.fields.titleImage.fields;
  const layout = 'grid';

  const itemTemplate = (menu) => {
    if (!menu) {
      return;
    }
    return (
      <div className="col-12 md:col-4">
        <div className="product-grid-item card">
          <div className="product-grid-item-content">
            <img src={`https:${menu.fields.image.fields.file.url}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={menu.fields.image.fields.file.url} />
            <div className="product-name">{menu.fields.title}</div>
            <div className="product-description">{menu.fields.description}</div>
          </div>
          <div className="product-grid-item-bottom">
            <span className="product-price">{menu.fields.price}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.titleImgContainer}>
        <div className={styles.title}>
          {homeData.fields.title}
        </div>
        <div className={styles.titleImg}>
          <Image
            src={`https:${titleImage.file.url}`}
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
        </div>
      </div>
    </div>
  )
}
