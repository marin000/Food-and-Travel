import { Menubar } from 'primereact/menubar';
import Image from 'next/image';
import Link from 'next/link'
import { useSession } from "next-auth/react";

export default function Navbar() {

  const { data: session } = useSession()

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
    },
    {
      label: session ? 'CMS' : '',
      url: '/cms/home'
    },
    {
      label: session ? 'Sign Out' : '',
      icon: session? 'pi pi-sign-out' : '',
      url: '/api/auth/signout'
    }
  ];

  const start = <Link href={'/'} >
    <a>
      <Image
        src="/../public/logo.png"
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