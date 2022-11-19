import React, { useEffect, useState } from 'react';
import { getClient } from "../../utils/contentful";
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Divider } from 'primereact/divider';
import { GMap } from 'primereact/gmap';
import { Button } from 'primereact/button';
import Image from 'next/image';
import Link from 'next/link'
import styles from '../../styles/TravelSlug.module.css';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import getConfig from 'next/config'
const { publicRuntimeConfig: { slugPage: { timeTitle, bookButton } } } = getConfig();
import { loadGoogleMaps, removeGoogleMaps } from '../../utils/GoogleMaps';
import { Galleria } from 'primereact/galleria';
import 'primeicons/primeicons.css';

const client = getClient()

export async function getStaticPaths() {
  const res = await client.getEntries({ content_type: "travel" })
  const paths = res.items.map(item => {
    return {
      params: { slug: item.fields.slug }
    }
  })
  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  const { items } = await client.getEntries({ content_type: 'travel', 'fields.slug': params.slug })
  const contact = await client.getEntries({ content_type: 'contact' });

  if (!items.length || !contact) {
    return {
      redirect: {
        destination: '/page404',
        permanent: false,
      },
    }
  }

  return {
    props: {
      tour: items[0],
      contact: contact.items[0]
    },
    revalidate: 1
  }
}

export default function TourDetails({ tour, contact }) {
  if (!tour) {
    return (
      <div>
        <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>
      </div>
    )
  }

  const [googleMapsReady, setGoogleMapsReady] = useState(false);
  const [overlays, setOverlays] = useState(null);
  const { title, fullDescription, timetable, price, map, gallery } = tour.fields;
  const titleImage = tour.fields.image.fields;
  const options = {
    center: { lat: map.lat, lng: map.lon },
    zoom: 12
  };

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
        new google.maps.Marker({ position: { lat: map.lat, lng: map.lon }, title: title })
      ]
    );
  }

  const itemTemplate = (item) => {
    let img = item.fields;
    return <img src={img.file.url} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={img.title} style={{ width: '100%', display: 'block' }} />;
  }

  const thumbnailTemplate = (item) => {
    let img = item.fields;
    return <img src={img.file.url} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={img.title} style={{ display: 'block', width: '20vw', objectFit: 'contain' }} />;
  }

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
      <Card>
        <div className={styles.priceBooking}>
          <i className="pi pi-dollar" style={{ 'fontSize': '1.1em', 'marginLeft': '1rem', 'marginBottom': '0.2rem' }}></i>
          <div className={styles.tourPrice}>{price}</div>
          <div className={styles.booking}>
            <Link href={{ pathname: '/booking', query: { name: title } }}>
              <Button label={bookButton} className="p-button-outlined p-button-warning p-button-sm" />
            </Link>
          </div>
        </div>
        <h2 className={styles.header}>{title}</h2>
        {documentToReactComponents(fullDescription)}
      </Card>
      <Divider />
      <Card>
        <div className={styles.timetableDiv}>
          <h3 className={styles.timetableHeader}>{timeTitle}</h3>
          <i className="pi pi-calendar" style={{ 'fontSize': '1.5em', 'marginLeft': '1rem', 'marginTop': '1rem' }}></i>
        </div>
        {documentToReactComponents(timetable)}
      </Card>
      <Divider />
      <div className="card">
        <Galleria value={gallery} responsiveOptions={responsiveOptions} numVisible={5} style={{ maxWidth: '90vw', marginLeft: 'auto', marginRight: 'auto' }}
          item={itemTemplate} thumbnail={thumbnailTemplate} circular autoPlay transitionInterval={2000} />
      </div>

      <Divider />
      {
        googleMapsReady && (
          <div className="card">
            <GMap overlays={overlays} options={options} style={{ width: '100%', minHeight: '420px' }} onMapReady={onMapReady} />
          </div>
        )
      }
    </div>
  )
}