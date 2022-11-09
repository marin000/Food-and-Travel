import { getClient } from "../utils/contentful";
import Image from 'next/image';

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

    return (
        <div>
            
        </div>
    )
  }