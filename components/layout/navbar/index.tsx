import DesktopNavbar from './responsive/desktop';
import MobileNavbar from './responsive/mobile';
import TabletNavbar from './responsive/tablet';

export default async function Navbar() {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopNavbar />
      </div>
      <div className="md:hidden">
        <MobileNavbar />
      </div>
      <div className="hidden md:block lg:hidden">
        <TabletNavbar />
      </div>
    </>
  );
}
