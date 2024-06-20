import { ReactNode, useState } from 'react';

export default function MobileMenu({
  UserDetails,
  UserShoppings,
}: {
  UserDetails: ReactNode;
  UserShoppings: ReactNode;
}) {
  const [tab, setTab] = useState(false);

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
          className=" rounded-tr-md bg-[#dbc7b7] px-5 py-2 pr-10 [clip-path:polygon(0%_0%,80%_0%,100%_100%,0%_100%)] dark:bg-[#3f3e3e]"
          onClick={() => displayProfile()}
        >
          Mi Perfil
        </div>
        <div
          className="rounded-tl-md bg-white px-5 py-2 pr-10 [clip-path:polygon(0%_0%,80%_0%,100%_100%,0%_100%)] dark:bg-black"
          onClick={() => displayHistory()}
        >
          Historial
        </div>
      </div>
      {tab ? (
        <div className="h-full overflow-y-auto bg-white dark:bg-black">{UserShoppings}</div>
      ) : (
        <div className="h-full overflow-y-auto bg-[#dbc7b7] pt-10 dark:bg-[#3f3e3e]">
          {UserDetails}
        </div>
      )}
    </div>
  );
}
