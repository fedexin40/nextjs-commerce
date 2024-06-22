import clsx from 'clsx';
import { ReactNode, useState } from 'react';

export default function MobileMenu({
  UserDetails,
  UserShoppings,
}: {
  UserDetails: ReactNode;
  UserShoppings: ReactNode;
}) {
  const [tab, setTab] = useState(true);

  function displayProfile() {
    setTab(false);
  }

  function displayHistory() {
    setTab(true);
  }

  return (
    <div className="flex h-full flex-col text-sm tracking-wider">
      <div className="flex basis-[5%] flex-row text-[#8b725d]">
        <div
          className={clsx(
            'rounded-tr-md bg-white px-5 py-2 pr-10 [clip-path:polygon(0%_0%,70%_0%,100%_100%,0%_100%)] dark:bg-[#3f3e3e]',
            { 'z-10': !tab },
          )}
          onClick={() => displayProfile()}
        >
          Mi Perfil
        </div>
        <div
          className={clsx(
            'relative right-4 rounded-tl-md bg-[#dbc7b7] px-5 py-2 pr-10 [clip-path:polygon(0%_0%,70%_0%,100%_100%,0%_100%)] dark:bg-black',
            { 'z-10': tab },
          )}
          onClick={() => displayHistory()}
        >
          Historial
        </div>
      </div>
      {tab ? (
        <div className="h-full overflow-y-auto bg-[#dbc7b7] dark:bg-black">{UserShoppings}</div>
      ) : (
        <div className="h-full overflow-y-auto bg-white  pt-10 dark:bg-[#3f3e3e]">
          {UserDetails}
        </div>
      )}
    </div>
  );
}
