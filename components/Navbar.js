import { Menubar } from 'primereact/menubar';
import Image from 'next/image';
import Link from 'next/link'

export default function Navbar() {
  const logoImg = `${process.env.NEXT_PUBLIC_IMG_PREFIX}/logo.png`;

  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      url: '/'
    },
    {
      label: 'Menu',
      url: '/menu'
    },
    {
      label: 'Travel',
      url: '/travel'
    },
    {
      label: 'Gallery',
      url: '/gallery'
    },
    {
      label: 'Contact',
      url: '/contact'
    }
  ];

  const start = <Link href={'/'} >
    <a>
      <Image
        src={logoImg}
        alt='logo'
        width={'40'}
        height={'40'}
        style={{ cursor: 'pointer' }}
      />
    </a>
  </Link>;

  return (
    <div>
      <div className="navbar">
        <Menubar model={items} start={start} />
      </div>
    </div>
  );
}