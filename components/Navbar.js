import { Menubar } from 'primereact/menubar';
import Image from 'next/image';
import Link from 'next/link'

export default function Navbar() {

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
    <Image
      src="/../public/logo.png"
      alt='logo'
      width={'40'}
      height={'40'}
      style={{ cursor: 'pointer'}}
    />
  </Link>;

  return (
    <div>
      <div className="navbar">
        <Menubar model={items} start={start} />
      </div>
    </div>
  );
}