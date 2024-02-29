import { getMenu } from 'lib/saleor';
import DesktopNavbar from './reposive/desktop';
import MobileNavbar from './reposive/mobile';
import TabletNavbar from './reposive/tablet';

export default async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');

  return (
    <>
      <div className="hidden lg:block">
        <DesktopNavbar menu={menu} />
      </div>
      <div className="md:hidden">
        <MobileNavbar menu={menu} />
      </div>
      <div className="hidden md:block lg:hidden">
        <TabletNavbar menu={menu} />
      </div>
    </>
  );
}
