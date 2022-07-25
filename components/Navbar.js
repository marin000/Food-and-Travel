import { Menubar } from 'primereact/menubar';

export default function Navbar() {

  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home'
    },
    {
      label: 'Menu'
    },
    {
      label: 'Travel'
    },
    {
      label: 'Gallery'
    },
    {
      label: 'Contact'
    }
  ];

  const start = <img alt="logo" src="showcase/images/logo.png" onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} height="40" className="mr-2"></img>;

  return (
    <div>
      <div className="navbar">
        <Menubar model={items} start={start} />
      </div>
    </div>
  );
}