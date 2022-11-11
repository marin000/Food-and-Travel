import { getClient } from "../utils/contentful";
import Image from 'next/image';
import { DataView } from 'primereact/dataview';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import styles from '../styles/Menu.module.css';
import getConfig from 'next/config';
const { publicRuntimeConfig: { menuPage: { title, menuButton } } } = getConfig();

export async function getStaticProps() {

  const client = getClient()
  const menu = await client.getEntries({ content_type: 'menu' });
  if (!menu) {
    return {
      redirect: {
        destination: '/page404',
        permanent: false,
      },
    }
  }
  return {
    props: {
      menu: menu.items
    },
    revalidate: 1
  }
}
export default function Menu({ menu }) {
  const layout = 'grid';
  const itemTemplate = (menu) => {

    const { title, description, price } = menu.fields;
    const image = menu.fields.image.fields.file;
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

  return (
    <div>
      <div className={styles.titleImgContainer}>
        <div className={styles.title}>
          {title}
        </div>
        <div className={styles.titleImg}>
          <Image
            src="/../public/images/menuImg.jpeg"
            placeholder='blur'
            blurDataURL="/../public/images/menuImg.jpeg"
            alt="menu"
            width={'2000'}
            height={'800'}
          />
        </div>
      </div>
      <Card className={styles.menuDownload}>
        <a href="" download>
          <Button label={menuButton} className="p-button-outlined p-button-warning" />
        </a>
      </Card>
      <div className="dataview-demo">
        <div className="card">
          <DataView value={menu} layout={layout}
            itemTemplate={itemTemplate} rows={9} />
        </div>
      </div>
    </div>
  )
}