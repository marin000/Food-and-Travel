import React, { useState, useRef } from 'react';
import { getClient } from "../utils/contentful";
import Image from 'next/image';
import getConfig from 'next/config'
const { publicRuntimeConfig: { gallery: { title } } } = getConfig();
import styles from '../styles/Gallery.module.css';
import { Galleria } from 'primereact/galleria';

export async function getStaticProps() {

  const client = getClient()
  const images = await client.getEntries({ content_type: 'gallery' });
  const contact = await client.getEntries({ content_type: 'contact' });

  if (!images || !contact) {
    return {
      redirect: {
        destination: '/page404',
        permanent: false,
      },
    }
  }
  return {
    props: {
      images: images.items, 
      contact: contact.items[0]
    },
    revalidate: 1
  }
}
export default function Gallery({ images, contact }) {

  const galleria = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const titleImage = `${process.env.NEXT_PUBLIC_IMG_PREFIX}/images/galleryImg.jpg`;

  const responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  const itemTemplate = (item) => {
    let img = item.fields.image.fields;
    return <img src={img.file.url} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={img.title} style={{ width: '100%', display: 'block' }} />;
  }

  const thumbnailTemplate = (item) => {
    let img = item.fields.image.fields;
    return <img src={img.file.url} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={img.title} style={{ display: 'block' }} />;
  }

  return (
    <div className="childrenContent">
      <div className={styles.titleImgContainer}>
        <div className={styles.title}>
          {title}
        </div>
        <div className={styles.titleImg}>
          <Image
            src={titleImage}
            placeholder='blur'
            blurDataURL={titleImage}
            alt="gallery"
            width={'2000'}
            height={'800'}
          />
        </div>
      </div>
      <div className="card">
        <Galleria ref={galleria} value={images} responsiveOptions={responsiveOptions} numVisible={7} style={{ maxWidth: '850px' }}
          activeIndex={activeIndex} onItemChange={(e) => setActiveIndex(e.index)}
          circular fullScreen showItemNavigators showThumbnails={false} item={itemTemplate} thumbnail={thumbnailTemplate} />

        <div className="grid" style={{ marginLeft: '1rem', marginRight: '0rem'}}>
          {
            images && images.map((image, index) => {
              let img = image.fields.image.fields;
              let imgEl = <img src={img.file.url} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
                alt={img.title} style={{ cursor: 'pointer', width: '20vw', objectFit: 'contain'}}
                onClick={() => { setActiveIndex(index); galleria.current.show() }} />
              return (
                <div className='col-3'  key={index}>
                  {imgEl}
                 </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}